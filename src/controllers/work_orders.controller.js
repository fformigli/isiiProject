const pool = require('../database');

const controller = {}

controller.index = (req, res) => {
    pool.query('select * from work_orders', (err, workOrders) => {
        if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        res.render('work-orders/list.hbs',{workOrders : workOrders.rows});
    });
};

controller.add = (req, res) => {
    res.render('work-orders/form.hbs');
};

controller.save = async (req, res) => {
    const { title, url, description } = req.body;
    await pool.query('insert into links (title, url, description,userid) values ($1, $2, $3, $4)', [title, url, description, req.user.id], (err) => {
        if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
    });
    req.flash('success', 'Enlace guardado.');
    res.redirect('/work-orders');
};

module.exports = controller;