const pool = require('../database');

const chargeUserCombos = async () => {
    const roleList = await pool.query('select * from roles order by name');
    return { roles: roleList.rows };
}
const controller = {}

controller.admin = (req, res) => {
    res.render('admin/admin.hbs');
};

controller.signUpGet = async (req, res) => {
    const dataForm = await chargeUserCombos()
    return res.render('auth/signup', dataForm);
};

controller.users =  (req, res) => {
    try {
        let query = 'select u.id, u.fullname, u.username, u.active, u.created_at, coalesce(r.name, \'-\') rol '
        query += 'from users u left join roles r on r.id_rol = u.id_rol '
        query += 'order by id asc '

        pool.query(query, (err, users) => {
            if (err) return done(null, false, req.flash('message', 'No se pudo conectar con la base de datos.'));
            res.render('admin/users.hbs', {users: users.rows});
        });
    } catch (e) {
        throw e
    }
};

controller.usersDelete = (req, res) => {
    const { id } = req.params;
    pool.query('delete from users where id = $1', [id], (err) => {
        if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        req.flash('success','Se elimino el usuario');
        res.redirect('/admin/users');
    });
};

controller.editUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await pool.query('select * from users where id = $1',[id])

        const dataForm = await chargeUserCombos()

        if(user.rows) {
            dataForm.userData = user.rows[0]
            res.render('auth/signup', dataForm)
        } else
            return done(null, false, req.flash('message','No se encontró el usuario.'));

    } catch (e) {
        console.error(e)
        return done(null, false, req.flash('message','No se pudo recuperar los datos del usuario.'));
    }



}


// Permissions


controller.permissions =  (req, res) => {
    pool.query('select * from permissions order by id asc', (err, permissions) => {
        if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        res.render('admin/permissions.hbs', {permissions: permissions.rows});
    });
};

controller.permission_add = async (req, res) => {
    try {
        return res.render('admin/permissionForm.hbs');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/profile');
    }
};

module.exports = controller;