const pool = require('../database');

const controller = {}

const chargeCombos = async () => {
    return { };
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
            const query = 'select * from base_lines where id = $1';
            const data = await pool.query(query, [req.params.id])
            dataForm.lineData = data.rows[0]
        }

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

        if( req.params.id ) { // si este parametro existe, quiere decir que estamos actualizando
            const query = 'update base_lines set name = $1, description = $2 where id = $3 ';

            await pool.query(query, [ name, description, req.params.id ])
            req.flash('success', 'Se actualizó la linea base');

        } else { // sino estamos agregando uno nuevo
            const query = 'insert into base_lines ' +
            '( name, description, created_by, project_id ) ' +
            'values ( $1, $2, $3, $4 ) ';

            await pool.query(query, [ name, description, req.params.id, project ])
            req.flash('success', 'Se agregó la linea base');
        }

        res.redirect('/base-lines');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/bases');
    }
}
module.exports = controller
