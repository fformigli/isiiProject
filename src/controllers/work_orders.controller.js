const pool = require('../database');

const controller = {}

controller.index = (req, res) => {
    const sql = 'select wo.id, wo.cliente, wo.vehiculo, wo.telefono, wo.created_at,u.fullname as encargado, s.description as status, wo.description '
        + 'from work_orders wo join users u on u.id = wo.encargado join work_order_status s on s.id = wo.statusid '
        + 'order by created_at desc ';

    pool.query(sql, (err, workOrders) => {
        if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        res.render('work-orders/list.hbs',{workOrders : workOrders.rows});
    });
};

controller.add = async (req, res) => {

    const statusList = await pool.query('select * from work_order_status order by id');
    const fuelList = await pool.query('select * from work_order_fuel order by id');
    const userList = await pool.query('select * from users where active = 1 order by fullname');

    resLists = { 'statusList': statusList.rows, 'fuelList': fuelList.rows, 'userList': userList.rows};

    res.render('work-orders/form.hbs', resLists);
};

controller.save = async (req, res) => {
    const { cliente, vehiculo, encargado, status,  telefono, vinnro, combustible, chapa, recorrido, description } = req.body;
    
    // intentamos crear la orden
    try {
        // creamos la orden de trabajo
        const sql = 'insert into work_orders '
        + '(cliente, vehiculo, encargado, statusid, fuelid, telefono, chapa, vinnro, recorrido, description, created_by) '
        + 'values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning id';

        const wo = await pool.query(sql, [cliente, vehiculo, encargado, status, combustible, telefono, chapa, vinnro, recorrido, description, req.user.id]);
        
        // si tiene archivos, agregamos
        if(req.file){
            await pool.query('insert into work_order_files (work_order, filename) values ($1, $2)', [wo.rows[0].id, req.file.filename]);
        }

        req.flash('success', 'Se agregó la orden');
        res.redirect('/work-orders');

    } catch (err) {
        console.error(err);
        return done(null, false, req.flash('message', 'No se pudo guardar la orden.'));
    }
};

module.exports = controller;