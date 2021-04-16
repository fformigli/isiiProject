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


controller.add = async (req, res) => {
    try {
        const dataForm = await chargeCombos();
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

        const query = 'insert into projects ' +
            '( name, created_by ) ' +
            'values ( $1, $2 ) ';

        const project = await pool.query(query, [ name, req.user.id])

        req.flash('success', 'Se agregó el proyecto');
        res.redirect('/projects');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/projects');
    }
}

module.exports = controller

