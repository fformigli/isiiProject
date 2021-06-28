const pool = require('../database');

const controller = {}

controller.view = async (req, res) => {
    const dataForm = {
        user: req.user
    }
    res.render('dashboard/dashboard', dataForm);
};

controller.form = async (req, res) => {
    try {
        const dataForm = {};

        /*Admin*/
        let query = "select u.id, u.fullname, u.username, u.active, u.created_at, coalesce(r.name, '-') rol "
        query += ' from users u left join user_roles ur on ur.userid = u.id '
        query += ' left join roles r on r.id = ur.rolid order by u.id asc limit 3';
        let data = await pool.query(query)
        dataForm.users = data.rows

        dataForm.userId = req.user.id

        query = "select * from tasks where status = 'finalizado'"
        data = await pool.query(query)
        dataForm.tasksComplete = data.rows

        query = ' select Count(*) as cantidad '
        query += ' from users u left join user_roles r on r.userid = u.id '
        data = await pool.query(query)
        dataForm.userRol = data.rows[0].cantidad

        query =' select count(*) as cantidad ' 
        query +=' from projects p '
        data = await pool.query(query)
        dataForm.cantProyecto = data.rows[0].cantidad

        query = "select * from tasks t where status = 'finalizado'"
        const porcFinalizado = await pool.query(query)
        query = 'select * from tasks t'
        const todasTareas = await pool.query(query)
        dataForm.porcFinalizado = porcFinalizado.rows.length * 100 / (todasTareas.rows.length == 0? 1 : todasTareas.rows.length)

        query = ' select count(*) as cantidad '
        query += ' from users u '
        data = await pool.query(query)
        dataForm.cantUsers = data.rows[0].cantidad

        /*Project Manager*/

        query = ' select count(*) as cantidad_projectos_asignados , status as estado from tasks t join project_participants pp on t.project_id= pp.projectid where pp.userid = $1 group by status '
        data = await pool.query(query, [req.user.id])
        dataForm.proyectoEstado = data.rows

        query = " select count(*) as cantidad from projects p, project_participants pp  where p.id = pp.projectid and userid = $1"
        data = await pool.query(query, [req.user.id])
        dataForm.proyectosUsuario = data.rows[0].cantidad

        query = 'select * from tasks t join project_participants pp on pp.projectid = t.project_id where pp.userid = $1 and status in (\'iniciado\',\'pendiente\')'
        const pendientes = await pool.query(query, [req.user.id])
        query = 'select * from tasks t join project_participants pp on pp.projectid = t.project_id where pp.userid = $1'
        const todas = await pool.query(query, [req.user.id])
        dataForm.porcentajeIncompleto = pendientes.rows.length * 100 / (todas.rows.length == 0? 1 : todas.rows.length)
        
        query =  ' select id, name, description, status, created_by from base_lines bl join project_participants pp on bl.project_id= pp.projectid where pp.userid = $1 limit 3'
        data = await pool.query(query, [req.user.id])
        dataForm.baseLines = data.rows

        // Developer
        query = " select count(*) as pendiente from tasks t , projects p where t.project_id = p.id  and status = 'pendiente' and assigned_to = "+dataForm.userId
        data = await pool.query(query)
        dataForm.tasksPendiente = data.rows[0].pendiente

        query = " select * from tasks t, projects p where t.project_id = p.id and status = 'iniciado' and assigned_to = "+dataForm.userId
        data = await pool.query(query)
        dataForm.tasksIncomplete = data.rows

        query = 'select * from tasks t join project_participants pp on pp.projectid = t.project_id where pp.userid = $1 and status in (\'pendiente\')'
        data = await pool.query(query, [req.user.id])
        dataForm.porcPendiente = data.rows.length * 100 / (todas.rows.length == 0? 1 : todas.rows.length)

        query = 'select * from tasks where assigned_to = $1'
        data = await pool.query(query, [req.user.id])
        dataForm.tasks = data.rows

        query = " select t.id, t.description, t.status, (case when t.priority = 1 then 'Urgente' when t.priority = 2 then 'Alta' when t.priority = 3 then 'Media' else 'Baja' end) Prioridad, t.version, p.name, t.observation "
        query += " from tasks t, projects p where t.project_id = p.id and status != 'finalizado' and assigned_to = "+dataForm.userId+" limit 5"
        data = await pool.query(query)
        dataForm.tasksprogramador = data.rows

        query = " select count(*) as cantidad from tasks t, projects p where t.project_id = p.id  and assigned_to = "+dataForm.userId
        data = await pool.query(query)
        dataForm.tasksDevelop = data.rows[0].cantidad


        return res.render('dashboard/dashboard', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/');
    }
};


module.exports = controller;