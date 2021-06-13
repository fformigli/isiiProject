const pool = require('../database');

const controller = {}

controller.view = async (req, res) => {
    const dataForm = {
        user: req.user
    }
    res.render('dashboard/dashboard', dataForm);
};
/*
controller.list = async (req, res) => {
    try {
        let query = 'select u.id, u.fullname, u.username, u.active, u.created_at, coalesce(r.name, \'-\') rol '
        query += 'from users u left join roles r on r.id = u.id_rol '
        query += 'order by u.id asc '

        const users = await pool.query(query)
        return res.render('dashboard/dashboard', {users: users.rows});

    } catch (e) {
        console.error(e);
        req.flash('message', 'Error: ' + e.message);
        return res.redirect('/');
    }
}
*/

controller.form = async (req, res) => {
    try {
        const dataForm = {};

            let query = 'select u.id, u.fullname, u.username, u.active, u.created_at, coalesce(r.name, \'-\') rol '
            query += 'from users u left join roles r on r.id = u.id_rol '
            query += 'order by u.id asc ';
            let data = await pool.query(query)
            dataForm.users = data.rows

            query = 'select * from projects'
            data = await pool.query(query)
            dataForm.projectData = data.rows

            query = 'select * from roles order by created_at desc'
            data = await pool.query(query)
            dataForm.roles = data.rows

            query = 'select * from permissions'
            data = await pool.query(query)
            dataForm.permissions = data.rows

            query = 'select * from base_lines order by created_at desc'
            data = await pool.query(query)
            dataForm.baseLines = data.rows

            query = "select * from tasks where status = 'finalizado'"
            data = await pool.query(query)
            dataForm.tasksComplete = data.rows

            query = "select * from tasks where status = 'iniciado' or status = 'pendiente'"
            data = await pool.query(query)
            dataForm.tasksIncomplete = data.rows

            query = 'select * from tasks'
            data = await pool.query(query)
            dataForm.tasks = data.rows


            let aux = (dataForm.tasksComplete.length*100)/dataForm.tasks.length
            dataForm.porcentaje = aux.toString();

            aux = (dataForm.tasksIncomplete.length*100)/dataForm.tasks.length
            dataForm.porcentajeIncompleto = aux.toString();
        
        return res.render('dashboard/dashboard', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/');
    }
};


module.exports = controller;