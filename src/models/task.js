const pool = require('../database');
const { TASK_STATUS_VALUES, TASK_PRIORITY_VALUES } = require('../lib/constants');

const controller = {}

const chargeCombos = async () => {
    return {
        statusValues: TASK_STATUS_VALUES,
        priorityValues: TASK_PRIORITY_VALUES
    };
}

controller.list = async (req, res) => {
    try {
        const query = `select * from tasks order by created_at desc`

        const tasks = await pool.query(query)

        // cambia el value por el label
        tasks.rows.map((task) => {
            const priority = TASK_PRIORITY_VALUES.filter(prior => prior.value === task.priority)
            console.log({priority})
            if(priority.length)
                task.priority = priority[0].label
            else
                task.priority = `No definida`
            return task
        })

        return res.render('tasks/tasks.hbs', {tasks: tasks.rows})

    } catch (err) {
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/');
    }
}

controller.form = async (req, res) => {
    try {
        const dataForm = await chargeCombos();
        dataForm.project = req.params.project

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
    try {
        const { description, status, observation, priority, version } = req.body
        const { project } = req.params

        if( req.params.id ) { // si este parametro existe, quiere decir que estamos actualizando
            const query = 'update tasks set description = $1, status = $2, ' +
                'observation = $3, priority = $4, version = $5 where id = $6 ';

            await pool.query(query, [ description, status, observation, priority, version, req.params.id])
            req.flash('success', 'Se actualizó la Tarea');

        } else { // sino, estamos agregando uno nuevo
            const query = 'insert into tasks ' +
                '( description, status, observation, priority, version, created_by, project_id ) ' +
                'values ( $1, $2, $3, $4, $5, $6, $7 ) ';

            await pool.query(query, [ description, status, observation, priority, version, req.user.id, project])
            req.flash('success', 'Se agregó la Tarea');
        }
        req.flash('success', 'Se agrego la tarea')

        res.redirect(`/projects/edit/${project}`);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/tasks');
    }
}

module.exports = controller