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

controller.users = async (req, res) => {
    try {
        let query = 'select u.id, u.fullname, u.username, u.active, u.created_at, coalesce(r.name, \'-\') rol '
        query += 'from users u left join roles r on r.id = u.id_rol '
        query += 'order by u.id asc '

        const users = await pool.query(query)
        return res.render('admin/users.hbs', {users: users.rows});
    } catch (err) {
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/admin');
    }
};

controller.usersDelete = (req, res) => {
    const { id } = req.params;
    pool.query('delete from users where id = $1', [id], (err) => {
        if(err) {
            console.error(err);
            req.flash('message', 'Error: ' + err.message);
            return res.redirect('/admin/users');
        }
        req.flash('success','Se elimino el usuario');
        res.redirect('/admin/users');
    });
};

controller.editUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await pool.query('select * from users where id = $1',[id])

        const dataForm = await chargeUserCombos()
        console.log(user.rows)
        if(user && user.rows.length > 0) {
            dataForm.userData = user.rows[0]
            res.render('auth/signup', dataForm)
        } else {
            throw Error('No se encontró el usuario')
        }

    } catch (err) {
        console.error(err)
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/admin/users');
    }
}

controller.updateUser = async (req, res) => {
    try {
        const { fullname, username, rol } = req.body
        const { id } = req.params

        await pool.query('update users set fullname = $1, username = $2, id_rol = $3 where id = $4',
            [fullname, username, rol, id])

        req.flash('success','Se actualizó el usuario');
        res.redirect('/admin/users')
    } catch (err) {
        console.error(err)
        req.flash('message', 'Error: ' + err.message);
        res.redirect('/admin/users');
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

//Roles
const chargeCombos = async () => {
    const values = [`iniciado`, `pendiente`, `finalizado`]
    const statusValues = []
    values.forEach((value) => {
        statusValues.push({ value })
    })

    return { statusValues };
}

controller.roleList = async (req, res) => {
    try {
        const query = `select * from roles`

        const roles = await pool.query(query)
        return res.render('admin/roles.hbs', {roles: roles.rows})

    } catch (e) {
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/roles');
    }
}


controller.roleAdd = async (req, res) => {
    try {
        const dataForm = await chargeCombos();
        return res.render('admin/rolesForm', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/roles');
    }
};

controller.roleSave = async (req, res) => {
    try {
        const { name } = req.body

        const query = 'insert into roles ' +
            '( name ) ' +
            'values ( $1 ) ';

        const role = await pool.query(query, [ name ])

        req.flash('success', 'Se agregó el rol');
        res.redirect('/roles');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/roles');
    }
}

/*controller.rolesDelete = (req, res) => {
    const { id } = req.params;
    pool.query('delete from roles where id = $1', [id], (err) => {
        if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        req.flash('success','Se elimino el rol');
        res.redirect('/admin/roles');
    });

};*/
module.exports = controller;