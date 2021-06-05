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
        const query = `select * from projects order by created_at desc`

        const projects = await pool.query(query)
        return res.render('projects/projects.hbs', {projects: projects.rows})

    } catch (e) {
        console.error(e);
        req.flash('message', 'Error: ' + e.message);
        return res.redirect('/projects');
    }
}

controller.form = async (req, res) => {
    try {
        const dataForm = await chargeCombos();

        if(req.params.id){ // si este parametro existe, significa qeu estamos editando
            let query = 'select * from projects where id = $1 order by created_by desc';
            let data = await pool.query(query, [req.params.id])
            dataForm.projectData = data.rows[0]

            // vemos si tiene tareas asignadas
            query = 'select * from tasks where project_id = $1 order by created_at desc limit 3'
            data = await pool.query(query, [req.params.id])
            dataForm.tasks = data.rows

            // vemos si tiene lineas base definidas
            query = 'select * from base_lines where project_id = $1 order by created_at desc limit 3'
            data = await pool.query(query, [req.params.id])
            dataForm.baseLines = data.rows
        }


        return res.render('projects/new', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/projects');
    }
};

controller.save = async (req, res) => {
    try {
        const { name } = req.body

        if( req.params.id ) { // si este parametro existe, quiere decir que estamos actualizando
            const query = 'update projects set name = $1 where id = $2 ';

            await pool.query(query, [ name, req.params.id ])
            req.flash('success', 'Se actualizó el proyecto');

        } else { // sino estamos agregando uno nuevo
            const query = 'insert into projects ' +
            '( name, created_by ) ' +
            'values ( $1, $2 ) ';

            await pool.query(query, [ name, req.params.id ])
            req.flash('success', 'Se agregó el proyecto');
        }

        req.flash('success', 'Se agrego el proyecto')
        res.redirect('/projects');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/projects');
    }
}
module.exports = controller

