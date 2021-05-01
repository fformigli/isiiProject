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
        const query = `select * from base_lines`

        const bases = await pool.query(query)
        return res.render('bases/bases.hbs', {bases: bases.rows})

    } catch (e) {
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/bases');
    }
}

controller.add = async (req, res) => {
    try {
        const dataForm = await chargeCombos();

        if(req.params.id){ // si este parametro existe, significa qeu estamos editando
            const query = 'select * from base_lines where id = $1 order by created_by desc';
            const data = await pool.query(query, [req.params.id])
            dataForm.lineData = data.rows[0]
        }

        return res.render('bases/addLine', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/bases');
    }
};

controller.save = async (req, res) => {
    try {
        const { name } = req.body

        if( req.params.id ) { // si este parametro existe, quiere decir que estamos actualizando
            const query = 'update base_lines set name = $1 where id = $2 ';

            await pool.query(query, [ name, req.params.id ])
            req.flash('success', 'Se actualizó la linea base');

        } else { // sino estamos agregando uno nuevo
            const query = 'insert into base_lines ' +
            '( name, created_by ) ' +
            'values ( $1, $2 ) ';

            await pool.query(query, [ name, req.params.id ])
            req.flash('success', 'Se agregó la linea base');
        }

        res.redirect('/bases');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/bases');
    }
}
module.exports = controller
