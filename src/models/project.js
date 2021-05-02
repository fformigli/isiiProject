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
        const query = `select * from projects`

        const projects = await pool.query(query)
        return res.render('projects/projects.hbs', {projects: projects.rows})

    } catch (e) {
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/projects');
    }
}

controller.form = async (req, res) => {
    try {
        const dataForm = await chargeCombos();

        if(req.params.id){ // si este parametro existe, significa qeu estamos editando
            const query = 'select * from projects where id = $1 order by created_by desc';
            const data = await pool.query(query, [req.params.id])
            dataForm.projectData = data.rows[0]
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

        res.redirect('/projects');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/projects');
    }
}
module.exports = controller

