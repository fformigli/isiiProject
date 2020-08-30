const pool = require('../database');

const controller = {}

controller.admin = (req, res) => {
    res.render('admin/admin.hbs');
};

controller.users =  (req, res) => {
    pool.query('select * from users order by id asc', (err, users) => {
        if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        res.render('admin/users.hbs', {users: users.rows});
    });
};

controller.usersDelete = (req, res) => {
    const { id } = req.params;
    pool.query('delete from users where id = $1', [id], (err) => {
        if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        req.flash('success','Se elimino el usuario');
        res.redirect('/admin/users');
    });

};

module.exports = controller;