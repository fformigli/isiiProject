const pool = require('../database');
const { TASK_STATUS_VALUES, TASK_PRIORITY_VALUES } = require('../lib/constants');

const controller = {}

const chargeCombos = () => {
    return {
        statusValues: TASK_STATUS_VALUES,
        priorityValues: TASK_PRIORITY_VALUES
    };
}

const assignableTo = (project) => {
    const sql = 'select id, fullname' +
        ' from users u' +
        ' join project_participants pp on pp.userid = u.id' +
        ' where pp.projectid = $1' +
        ' order by fullname'

    return pool.query(sql, [project])
        .then(res => res.rows)
        .catch(e => {
            throw e
        })
}

controller.list = async (req, res) => {
    try {
        const query = 'select t.*, u.fullname as assigned_to' +
            ' from tasks t' +
            ' join users u on u.id = t.assigned_to' +
            ' where u.id = $1' +
            ' order by created_at desc'

        const tasks = await pool.query(query, [req.user.id])

        return res.render('tasks/tasks.hbs', {tasks: tasks.rows})

    } catch (err) {
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/');
    }
}

controller.form = async (req, res) => {
    try {
        const dataForm = chargeCombos();
        dataForm.project = req.params.project
        dataForm.assignableTo = await assignableTo(dataForm.project)

        if(req.params.id){ // si este parametro existe, significa qeu estamos editando
            const query = 'select * from tasks where id = $1 order by created_by desc';
            const data = await pool.query(query, [req.params.id])
            dataForm.taskData = data.rows[0]
        }

        return res.render('tasks/form', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/tasks');
    }
};

controller.save = async (req, res) => {
    const { project } = req.params
    try {
        const { assignedTo, description, status, observation, priority, version } = req.body

        if(!assignedTo) {
            throw new Error('La tearea debe ser asignada a un usuario.')
        }

        if( req.params.id ) { // si este parametro existe, quiere decir que estamos actualizando

            // validamos que la tarea no este en una LB
            const sqlValidator = 'select * from base_line_tasks where task_id = $1'
            const validator = await pool.query(sqlValidator, [req.params.id])
            if(validator.rows.length > 0)
                throw new Error('No se puede modificar. La tarea está en una Linea Base')

            const query = 'update tasks set description = $1, status = $2, ' +
                'observation = $3, priority = $4, version = $5, ' +
                ' assigned_to = $7 where id = $6 ';

            await pool.query(query, [ description, status, observation, priority, version, req.params.id, assignedTo])
            req.flash('success', 'Se actualizó la Tarea');

        } else { // sino, estamos agregando uno nuevo
            const query = 'insert into tasks ' +
                '( description, status, observation, priority, version, created_by, project_id, assigned_to ) ' +
                'values ( $1, $2, $3, $4, $5, $6, $7, $8 ) ';

            await pool.query(query, [ description, status, observation, priority, version, req.user.id, project, assignedTo])
        }
        req.flash('success', 'Se guardó la tarea')

        res.redirect(`/projects/edit/${project}`);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        let red = `/tasks/edit/${project}`
        if(req.params.id)
            red = `/tasks/edit/${project}/${req.params.id}`

        return res.redirect(red);
    }
}

module.exports = controller