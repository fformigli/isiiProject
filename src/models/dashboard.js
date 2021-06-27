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
        console.log(req.user.id, req.user)
        /*Admin*/
        let query = "select u.id, u.fullname, u.username, u.active, u.created_at, coalesce(r.name, '-') rol "
        query += ' from users u left join user_roles ur on ur.userid = u.id '
        query += ' left join roles r on r.id = ur.rolid order by u.id asc limit 3';
        let data = await pool.query(query)
        dataForm.users = data.rows
 

        query = "select coalesce(r.name, 'Hola-') rol "
        query += ' from users u left join user_roles ur on ur.userid = u.id '
        query += ' left join roles r on r.id = ur.rolid where u.id = $1';
        let data1 = await pool.query(query, [req.user.id])
        dataForm.users1 = data1.rows


        
        console.log("HOLA",dataForm.users1)

        dataForm.userId = req.user.id

        query = "select * from tasks where status = 'finalizado'"
        data = await pool.query(query)
        dataForm.tasksComplete = data.rows

        console.log("xxx",dataForm.tasksComplete)

        query = ' select Count(*) as cantidad '
        query += ' from users u left join user_roles r on r.userid = u.id '
        data = await pool.query(query)
        dataForm.userRol = data.rows[0].cantidad

        query =' select count(*) as cantidad ' 
        query +=' from projects p '
        data = await pool.query(query)
        dataForm.cantProyecto = data.rows[0].cantidad

        query = ' select (count(*) * 100 ) / ( select count(*) from tasks p) as porcentaje '
        query += ' from tasks t ' 
        query += " where status = 'finalizado' " 
        data = await pool.query(query)
        dataForm.porcFinalizado = data.rows[0].porcentaje 

        query = ' select count(*) as cantidad '
        query += ' from users u '
        data = await pool.query(query)
        dataForm.cantUsers = data.rows[0].cantidad

        /*Project Manager*/

        query = ' select count(*) as cantidad_projectos_asignados , status as estado '
        query += ' from tasks t group by status ' 
        data = await pool.query(query)
        dataForm.proyectoEstado = data.rows

        query = " select count(*) as cantidad from projects p, project_participants pp "
        query +=" where p.id = pp.projectid and userid = "+dataForm.userId
        data = await pool.query(query)
        dataForm.proyectosUsuario = data.rows[0].cantidad
        
        query =  ' select count(*) * 100 / (select count(*) from tasks p)  as porcentaje_tarea_pendiente ' 
        query += " from tasks t where status = 'pendiente' or status = 'iniciado'"
        data = await pool.query(query)
        dataForm.porcentajeIncompleto = data.rows[0].porcentaje_tarea_pendiente   
        
        query =  ' select id, name, description, status, created_by '
        query += ' from base_lines limit 5'
        data = await pool.query(query)
        dataForm.baseLines = data.rows



        // Developer
        
        query = " select count(*) as pendiente from tasks t , projects p where t.project_id = p.id  and status = 'pendiente' and assigned_to = "+dataForm.userId
        data = await pool.query(query)
        dataForm.tasksPendiente = data.rows[0].pendiente

        query = " select * from tasks t, projects p where t.project_id = p.id and status = 'iniciado' and assigned_to = "+dataForm.userId
        data = await pool.query(query)
        dataForm.tasksIncomplete = data.rows

        query =  " select count(*) * 100 / (select count(*) from tasks p)  as porcentaje_tarea_pendiente_solo "
        query += " from tasks t where status = 'pendiente' "
        data = await pool.query(query)
        dataForm.porcPendiente = data.rows[0].porcentaje_tarea_pendiente_solo

        query = 'select * from tasks'
        data = await pool.query(query)
        dataForm.tasks = data.rows

        query = " select t.id, t.description, t.status, (case when t.priority = 1 then 'Urgente' when t.priority = 2 then 'Alta' when t.priority = 3 then 'Media' else 'Baja' end) Prioridad, t.version, p.name, t.observation "
        query += " from tasks t, projects p where t.project_id = p.id and status != 'finalizado' and assigned_to = "+dataForm.userId+" limit 5"
        data = await pool.query(query)
        dataForm.tasksprogramador = data.rows

        query = " select count(*) as cantidad from tasks t, projects p where t.project_id = p.id  and assigned_to = "+dataForm.userId
        data = await pool.query(query)
        dataForm.tasksDevelop = data.rows[0].cantidad
        // let aux = (dataForm.tasksComplete.length*100)/dataForm.tasks.length
        // dataForm.porcentaje = aux.toString();

        // aux = (dataForm.tasksIncomplete.length*100)/dataForm.tasks.length
        // dataForm.porcentajeIncompleto = aux.toString();


        return res.render('dashboard/dashboard', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/');
    }
};


module.exports = controller;