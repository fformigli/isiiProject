const pool = require('../database');

const controller = {}

controller.admin = (req, res) => {
    res.render('admin/admin.hbs');
};

controller.users =  async (req, res) => {
    const users = await pool.query('select * from users order by id asc');
    res.render('admin/users.hbs', {users: users.rows});
};

controller.usersDelete = async (req, res) => {
    const { id } = req.params;
    await pool.query('delete from users where id = $1', [id]);

    req.flash('success','Se elimino el usuario');
    res.redirect('/admin/users');
};

module.exports = controller;