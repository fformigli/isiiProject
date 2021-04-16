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
            const query = 'select * from tasks where id = $1';
            dataForm.taskData = await pool.query(query, [req.params.id])
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

        const query = 'insert into tasks ' +
            '( description, status, created_by ) ' +
            'values ( $1, $2, $3 ) ';

        const task = await pool.query(query, [ description, status, req.user.id])

        req.flash('success', 'Se agregó la Tarea');
        res.redirect('/tasks');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/tasks');
    }
}

module.exports = controller