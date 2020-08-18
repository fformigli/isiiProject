const pool = require('../database');

const controller = {}

controller.index = async (req, res) => {
    const workOrders = await pool.query('select * from work_orders');
    res.render('work-orders/list.hbs',{workOrders : workOrders.rows});
};

controller.add = (req, res) => {
    res.render('work-orders/form.hbs');
};

controller.save = async (req, res) => {
    const { title, url, description } = req.body;
    await pool.query('insert into links (title, url, description,userid) values ($1, $2, $3, $4)', [title, url, description, req.user.id]);
    req.flash('success', 'Enlace guardado.');
    res.redirect('/work-orders');
};

module.exports = controller;