const pool = require('../database');
const { PERMISSION_OPERATIONS } = require('../lib/constants')

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

const chargePermissionCombos = async () => {
    return { operations: PERMISSION_OPERATIONS };
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

        const dataForm = {}

        if(req.params.id){ // si este parametro existe, significa qeu estamos editando
            const query = 'select * from roles where id = $1';
            const data = await pool.query(query, [req.params.id])
            dataForm.rolData = data.rows[0]
        }

        dataForm.permissions = await pool.query('select * from permissions order by name')

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

        if( req.params.id ) { // si este parametro existe, quiere decir que estamos actualizando
            const query = 'update roles set name = $1 where id = $2';

            await pool.query(query, [ name, req.params.id ])
            req.flash('success', 'Se actualizó el rol');

        } else { // sino estamos agregando uno nuevo
            const query = 'insert into roles ' +
                '( name, created_by ) ' +
                'values ( $1, $2 ) ';

            await pool.query(query, [ name, req.user.id])
            req.flash('success', 'Se agregó el rol');
        }

        res.redirect('/admin/roles');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/admin/roles');
    }
}

/* CHESS SECTION */
controller.permissionsAdd = async (req, res) => {
    try {
        const dataForm = await chargePermissionCombos();

        if(req.params.id){ // si este parametro existe, significa qeu estamos editando
            const query = 'select * from permissions where id = $1';
            const data = await pool.query(query, [req.params.id])
            dataForm.rolData = data.rows[0]
        }

        return res.render('admin/permissionForm', dataForm);
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/roles');
    }
};

controller.permissionsSave = async (req, res) => {
    try {
        const { resources, operation, name } = req.body

        if( req.params.id ) { // si este parametro existe, quiere decir que estamos actualizando
            const query = 'update permissions set resources = $1, operation= $2, name = $3 where id = $4';

            await pool.query(query, [ resources, operation, name, req.params.id ])
            req.flash('success', 'Se actualizó el permiso');

        } else { // sino estamos agregando uno nuevo
            const query = 'insert into permissions ' +
                '( resources, operation, name ) ' +
                'values ( $1, $2, $3 ) ';

            await pool.query(query, [ resources, operation,name])
            req.flash('success', 'Se agregó el permiso');
        }

        res.redirect('/admin/permissions');
    } catch (err){
        console.error(err);
        req.flash('message', 'Error: ' + err.message);
        return res.redirect('/admin/permissions');
    }
}
/******/
module.exports = controller;