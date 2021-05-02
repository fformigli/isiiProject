// connection
const { pool } = require('../database');

// users
const get_users = async (req, res) => {
    try {
        const response = await pool.query('select * from users', (err) => {
            if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        });
        res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const create_user = async (req, res) => {
    try {
        const { name } = req.body;
        const response = await pool.query('insert into users (name) values ($1)', [name], (err) => {
            if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        });
        console.log(response);

        res.status(200).json({
            message: 'User Added',
            body: {
                user: {name}
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const get_user_by_id = async (req, res) => {
    try {
        const response = await pool.query('select * from users where id = $1', [req.params.id], (err) => {
            if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        });
        res.json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const update_user = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;

        const response = await pool.query('update users set name = $1 where id = $2', [name, id], (err) => {
            if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        });
        console.log(response);
        res.json('`User ${id} deleted` updated');
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const delete_user = async (req, res) => {
    try{
        const id = req.params.id;
        const response = await pool.query('delete from users where id = $1', [id], (err) => {
            if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        });
        console.log(response);
        res.json(`User ${id} deleted`);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}


// permissions
const get_permissions = async (req, res) => {
    try {
        const response = await pool.query('select * from permissions', (err) => {
            if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        });
        res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const create_permission = async (req, res) => {
    try {
        const { resources, operation, name } = req.body;
        const response = await pool.query('insert into permissions (resources, operation, name) values ($1, $3, $2)', [resources, operation, name], (err) => {
            if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        });
        console.log(response);

        res.status(200).json({
            message: 'Permission Added',
            body: {
                permission: {name}
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const get_permission_by_id = async (req, res) => {
    try {
        const response = await pool.query('select * from permissions where id = $1', [req.params.id], (err) => {
            if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        });
        res.json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const update_permission = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;

        const response = await pool.query('update permissions set name = $1 where id = $2', [name, id], (err) => {
            if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        });
        console.log(response);
        res.json('`Permission ${id} deleted` updated');
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const delete_permission = async (req, res) => {
    try{
        const id = req.params.id;
        const response = await pool.query('delete from permissions where id = $1', [id], (err) => {
            if(err) return done(null, false, req.flash('message','No se pudo conectar con la base de datos.'));
        });
        console.log(response);
        res.json(`Permission ${id} deleted`);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}



module.exports = {
    get_users, 
    get_user_by_id,
    create_user,
    update_user,
    delete_user,
    get_permissions, 
    get_permission_by_id,
    create_permission,
    update_permission,
    delete_permission
}