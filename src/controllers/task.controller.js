const pool = require('../database');

const controller = {}

const chargeCombos = async () => {
    const values = [`iniciado`, `pendiente`, `finalizado`]
    const statusValues = []
    values.forEach((value) => {
        statusValues.push({ value })
    })

    return { statusValues };
}

controller.list = async (req, res) => {
    try {
        const query = `select * from tasks`

        const tasks = await pool.query(query)
        return res.render('tasks/tasks.hbs', {tasks: tasks.rows})

    } catch (e) {
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/tasks');
    }
}

controller.add = async (req, res) => {
    try {
        const dataForm = await chargeCombos();

        if(req.params.id){ // si este parametro existe, significa qeu estamos editando
            const query = 'select * from tasks where id = $1 order by created_by desc';
            const data = await pool.query(query, [req.params.id])
            dataForm.taskData = data.rows[0]
        }

        return res.render('tasks/add', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/tasks');
    }
};

controller.save = async (req, res) => {
    try {
        const { description, status } = req.body

        if( req.params.id ) { // si este parametro existe, quiere decir que estamos actualizando
            const query = 'update tasks set description = $1, status = $2 where id = $3';

            await pool.query(query, [ description, status, req.params.id])
            req.flash('success', 'Se actualizó la Tarea');

        } else { // sino estamos agregando uno nuevo
            const query = 'insert into tasks ' +
                '( description, status, created_by ) ' +
                'values ( $1, $2, $3 ) ';

            await pool.query(query, [ description, status, req.user.id])
            req.flash('success', 'Se agregó la Tarea');
        }

        res.redirect('/tasks');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/tasks');
    }
}

module.exports = controller