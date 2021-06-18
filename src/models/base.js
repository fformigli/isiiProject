const pool = require('../database');

const controller = {}

const chargeCombos = async () => {
    return {
        statusValues: TASK_STATUS_VALUES,
        priorityValues: TASK_PRIORITY_VALUES
    };
}


controller.list = async (req, res) => {
    try {
        const query = `select * from base_lines order by created_by desc`

        const bases = await pool.query(query)
        return res.render('bases/bases.hbs', {bases: bases.rows})

    } catch (e) {
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/bases');
    }
}

controller.form = async (req, res) => {
    try {
        const dataForm = await chargeCombos();
        dataForm.project = req.params.project

        if(req.params.id){ // si este parametro existe, significa qeu estamos editando
            let query = 'select * from base_lines where id = $1';
            let data = await pool.query(query, [req.params.id])
            dataForm.lineData = data.rows[0]

            query = 'select id task_id, description, status, version from tasks where project_id = $1 order by created_by desc';
            data = await pool.query(query, [dataForm.lineData.project_id])
            dataForm.lineBaseTasks = data.rows

            query = 'select id task_id, description, status, version from tasks where project_id = $1 and id not in (select id) order by created_by desc';
            data = await pool.query(query, [dataForm.lineData.project_id])
            dataForm.projectTasks = data.rows
        }
        console.log("id de linea base", req.params.id)
         dataForm.baseId = req.params.id;

        return res.render('bases/form', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/bases');
    }
};

controller.save = async (req, res) => {
    try {
        const { name, description } = req.body
        const {project} = req.params
        let id;
        if( req.params.id ) { // si este parametro existe, quiere decir que estamos actualizando
            const query = 'update base_lines set name = $1, description = $2 where id = $3 ';

            await pool.query(query, [ name, description, req.params.id ])
            req.flash('success', 'Se actualizó la linea base');

        } else { // sino estamos agregando uno nuevo
            const query = 'insert into base_lines ' +
            '( name, description, created_by, project_id ) ' +
            'values ( $1, $2, $3, $4 ) returning id';

            const lb = await pool.query(query, [ name, description, req.params.id, project ])
            id = lb.rows[0].id
            req.flash('success', 'Se agregó la linea base');
        }

        req.flash('success', 'Se agrego la linea base')

        res.redirect(`/base-lines/edit/${id}`);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/bases');
    }
}

controller.addTask = async (req, res) => {
    const { baseId, task } = req.params
    try {
        console.log("ya entro a task      .....................................................................")
        // insertar project participants
        const sql = 'insert into base_line_tasks (base_line_id, task_id) ' +
            'values ($1, $2)'

        await pool.query(sql, [baseId, task])

        

        req.flash('success', 'Se agrego la tarea a la linea base')
        res.redirect(`/base-lines/edit/${baseId}`)

    } catch (e) {

        req.flash('message', 'Error: ' + e.message);
        return res.redirect(`/base_lines/edit/${baseId}`);
    }
}

controller.removeTask = async (req, res) => {
    const { baseId, task } = req.params
    try {
        console.log("ya entro a task      .....................................................................")
        // insertar project participants
        const sql = 'delete from base_line_tasks where base_line_id = $1 and task_id = $2 '
            
        console.log({baseId,task})
        await pool.query(sql, [baseId, task])

        

        req.flash('success', 'Se desvinculo la tarea')
        res.redirect(`/base-lines/edit/${baseId}`)

    } catch (e) {

        req.flash('message', 'Error: ' + e.message);
        return res.redirect(`/base_lines/edit/${baseId}`);
    }
}

module.exports = controller
