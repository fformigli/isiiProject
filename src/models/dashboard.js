const pool = require('../database');

const controller = {}

controller.view = async (req, res) => {
    const dataForm = {
        user: req.user
    }
    res.render('dashboard/dashboard', dataForm);
};

controller.list = async (req, res) => {
    try {
        const query = 'select u.id, u.fullname, u.username, u.active, u.created_at, coalesce(r.name, \'-\') rol '
        query += 'from users u left join roles r on r.id = u.id_rol '
        query += 'order by u.id asc '

        const users = await pool.query(query)
        return res.render('dashboard/dashboard.hbs', {users: users.rows})

    } catch (e) {
        console.error(e);
        req.flash('message', 'Error: ' + e.message);
        return res.redirect('/');
    }
}
module.exports = controller;