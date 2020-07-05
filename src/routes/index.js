const { Router } = require('express');
const router = Router();
const { get_users, create_user , get_user_by_id, delete_user, update_user} = require('../controllers/index.controller');

// web
router.get('/', (req, res) => {
    res.send('hello world :)');
})

//rest users
router.get('/rest/users', get_users); //listar todo
router.post('/rest/users', create_user); // crear
router.get('/rest/users/:id', get_user_by_id); // listar un usuario
router.delete('/rest/users/:id', delete_user); // eliminar
router.put('/rest/users/:id', update_user); // actualizar

module.exports = router;