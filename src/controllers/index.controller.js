// connection
const { Pool } = require('pg');
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'exclusiv_cars_db'
});

// users
const get_users = async (req, res) => {
    const response = await pool.query('select * from users');
    res.status(200).json(response.rows);
}

const create_user = async (req, res) => {
    try {
        const { name } = req.body;
        const response = await pool.query('insert into users (name) values ($1)', [name]);
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
    const response = await pool.query('select * from users where id = $1', [req.params.id]);
    res.json(response.rows);
    //const response = pool.query
}

const update_user = async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    const response = await pool.query('update users set name = $1 where id = $2', [name, id]);
    console.log(response);
    res.json('User updated');
}

const delete_user = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('delete from users where id = $1', [id]);
    console.log(response);
    res.json(`User ${id} deleted`);
}

module.exports = {
    get_users, 
    create_user,
    get_user_by_id,
    update_user,
    delete_user
}