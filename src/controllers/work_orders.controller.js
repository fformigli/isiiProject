const pool = require('../database');

const controller = {}

controller.index = (req, res) => {
    pool.query('select * from work_orders', (err, workOrders) => {
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

controller.save = (req, res) => {

    const { cliente, vehiculo, encargado, status,  telefono, vinnro, combustible, chapa, recorrido,
        description, file } = req.body;

    let sql = 'insert into work_orders '
    + '(cliente, vehiculo, encargado, statusid, fuelid, telefono, chapa, vinnro, recorrido, description, created_by)'
    + 'values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning id';

    pool.query(sql, [cliente, vehiculo, encargado, status, combustible, telefono, chapa, vinnro, recorrido, description, req.user.id], (err, data) => {
        if (err) {
            console.error(err);
            return done(null, false, req.flash('message', 'No se pudo guardar la orden.'));
        }

        //let sqlFile = 'insert into work_order_files (work_order, filename) values ($1, $2)', [data.rows[0].id, file.original_name];

        req.flash('success', 'Se agregó la orden');
        res.redirect('/work-orders');
    });
};

module.exports = controller;