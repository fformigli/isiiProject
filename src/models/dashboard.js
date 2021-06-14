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
            query += ' left join roles r on r.id = ur.rolid order by u.id asc ';
            let data = await pool.query(query)
            dataForm.users = data.rows

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

/*
controller.form = async (req, res) => {
    try {
        const dataForm = {};
           
            let query = 'select u.id, u.fullname, u.username, u.active, u.created_at, coalesce(r.name, '-') rol '
            query += 'from users u left join user_roles ur on ur.userid = u.id '
            query += 'left join roles r on r.id = ur.rolid order by u.id asc group by r.name';
            let data = await pool.query(query)
            dataForm.users = data.rows

            query = "select Count(*) as 'cantidad_usuario_rol'"
            query += 'from users u left join user_roles r'
            query += 'on r.userid = u.id;'
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

            -- ADMIN


select count(*) as 'cantidad_usuario' 
from users u;

select count(*) as 'canitdad_proyectos' 
from projects p ;

select (count(*) * 100 ) / ( select count(*) from projects p) as porcentaje
from tasks t
where status = 'finalizado';

--PROJECT MANAGER

select count(*) as cantidad_projectos_asignados , status as estado
from tasks t,
     projects p
WHERE t.id = p.id 
group by status;

select count(*) * 100 / (select count(*) from projects p)  porcentaje_tarea_iniciado
from tasks t,
     projects p
WHERE t.id = p.id 
and status = 'iniciado';

select count(*) * 100 / (select count(*) from projects p)  as porcentaje_tarea_pendiente
from tasks t,
     projects p
WHERE t.id = p.id 
and status = 'pendiente';

select count(*) * 100 / (select count(*) from projects p)  as porcentaje_tarea_finalizado
from tasks t,
     projects p
WHERE t.id = p.id 
and status = 'finalizado';

select description as tareas_pendientes 
from tasks t
where status = 'pendiente'
limit 3;


--DEVELOPER

select count(*) as cantidad_projectos_asignados , 
       status as estado, 
       description as tarea
from tasks t,
     projects p
WHERE t.id = p.id 
group by status, description;


select t.id ,
       t.description,
	   (case 
	        when t.priority = 1 then 'Urgente' 
		    when t.priority = 2 then 'Alta'
		    when t.priority = 3 then 'Media'
		    else 'Baja'  
	    end
	   ),
	   created_at
from tasks t
WHERE t.status = 'pendiente'
order by t.priority, t.created_at;


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
*/
module.exports = controller;