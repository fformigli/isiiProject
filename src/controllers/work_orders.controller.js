const pool = require('../database');
const fs = require('fs');
const path = require('path');

const controller = {}

async function chargeCombos() {
    try {
        const statusList = await pool.query('select * from work_order_status order by id');
        const fuelList = await pool.query('select * from work_order_fuel order by id');
        const userList = await pool.query('select id, fullname from users where active = 1 order by fullname');
        return { 'statusList': statusList.rows, 'fuelList': fuelList.rows, 'userList': userList.rows };
    } catch (err){
        throw err;
    }
}

controller.list = async (req, res) => {
    try {
        let dataForm = await chargeCombos();
        dataForm.filter = req.query
        console.log(dataForm.filter)
        
        let where = req.user.isadmin ? 'where true ' : `where encargado = ${req.user.id} `;
        if (dataForm.filter){
            if(dataForm.filter.status && dataForm.filter.status !== 'all'){
                where += `and wo.statusid = ${dataForm.filter.status} `
            }
            if(dataForm.filter.encargado && dataForm.filter.encargado !== 'all'){
                where += `and wo.encargado = ${dataForm.filter.encargado} `
            }
            if(dataForm.filter.search){
                where += `and coalesce(wo.cliente,'')||coalesce(wo.vehiculo,'') ilike '%${dataForm.filter.search}%' `
            }
        }
        console.log(where)

        const sql = 'select wo.id, wo.cliente, wo.vehiculo, wo.telefono, wo.created_at,u.fullname as encargado, s.description as status, wo.description '
            + 'from work_orders wo join users u on u.id = wo.encargado join work_order_status s on s.id = wo.statusid '
            + where
            + 'order by created_at desc ';

        console.log(sql)

        const workOrders = await pool.query(sql);
        dataForm.workOrders = workOrders.rows

        console.log(dataForm)
        console.log(dataForm.workOrders)

        return res.render('work-orders/list.hbs', dataForm);

    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/profile');
    }

};

controller.add = async (req, res) => {
    try {
        const dataForm = await chargeCombos();
        return res.render('work-orders/form.hbs', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/profile');
    }
};

controller.saveNew = async (req, res) => {
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
            var ext = path.extname(req.file.originalname).toLowerCase();
            let filetype = 'img';
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg')
                filetype = 'video';

            await pool.query('insert into work_order_files (work_order, filename, filetype) values ($1, $2, $3)', [wo.rows[0].id, req.file.filename, filetype]);
        }

        req.flash('success', 'Se agregó la orden');
        res.redirect('/work-orders');

    } catch (err) {
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        res.redirect('/work-orders/add');
    }
};

controller.edit = async (req, res) => {
    const { id } = req.params;
    const dataForm = await chargeCombos();

    try {
        // obtenemos el wo
        const wo = await pool.query('select * from work_orders where id = $1', [id]);
        dataForm.wo = wo.rows[0];

        const wof = await pool.query('select * from work_order_files where work_order = $1 order by id', [id]);
        dataForm.wof = wof.rows;

        const woc = await pool.query('select c.comment, u.fullname as created_by, c.created_at from work_order_comments c, users u where work_order = $1 and c.created_by = u.id order by c.id', [id]);
        dataForm.woc = woc.rows;

        res.render('work-orders/form.hbs', dataForm);

    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        res.redirect('/work-orders');
    }
};

controller.saveUpdate = async (req, res) => {
    const { cliente, vehiculo, encargado, status,  telefono, vinnro, combustible, chapa, recorrido, description } = req.body;
    const { id } = req.params;

    console.log(description);
    
    try {
        // actualizamos la orden de trabajo
        const sql = 'update work_orders'
        + ' set cliente = $1, vehiculo = $2, encargado = $3, statusid = $4, fuelid = $5, telefono = $6, chapa = $7, vinnro = $8,'
        + ' recorrido = $9, description = $10'
        + ' where  id = $11';

        await pool.query(sql, [cliente, vehiculo, encargado, status, combustible, telefono, chapa, vinnro, recorrido, description, id]);
        
        // si tiene archivos, agregamos
        if(req.file){
            var ext = path.extname(req.file.originalname).toLowerCase();
            let filetype = 'unknown';
            if(ext == '.png' || ext == '.jpg' || ext == '.gif' || ext == '.jpeg')
                filetype = 'img';
            if(ext == '.avi' || ext == '.mp4' || ext == '.wmv' || ext == '.wma')
                filetype = 'video';

            await pool.query('insert into work_order_files (work_order, filename, filetype) values ($1, $2, $3)', [id, req.file.filename, filetype]);
        }

        req.flash('success', 'Se actualizó la orden');

    } catch (err) {
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
    }
    res.redirect('/work-orders/edit/'+id);
};

controller.deleteFiles = async (req, res) => {
    const { wo, id } = req.params;

    try {
        const wof = await pool.query('select * from work_order_files where id = $1', [id]);
        await pool.query('delete from work_order_files where id = $1', [id]);
        fs.unlink(path.join(__dirname, '../public/uploads/' + wof.rows[0].filename), (err) => {
            if(err){
                console.error(err);
                throw "No se pudo eliminar el archivo; " + err.message;
            }
        });
        req.flash('success', 'se elimino el archivo');
    } catch (err) {
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
    }

    res.redirect('/work-orders/edit/'+wo);

};

controller.addComment = async (req, res) => {
    const { wo } = req.params
    const { comment } = req.body

    try {
        await pool.query('insert into work_order_comments (work_order, comment, created_by) ' +
            'values ($1, $2, $3)', [wo, comment, req.user.id])

        req.flash('success', 'Comentario agregado');

    } catch (err) {
        console.error(err)
        req.flash('message', 'Error: ' + err.message)
    }
    res.redirect('/work-orders/edit/'+wo);
};

module.exports = controller;