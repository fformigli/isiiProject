const { isLoggedIn, isNotLoggedIn, isAdmin } = require('../lib/auth');
const { Router } = require('express');
const router = Router();
const uploads = require('../lib/multer');

// controllers
const admin = require('../controllers/admin.controller');
const authentication = require('../controllers/authentication.controller');
const rest = require('../controllers/rest.controller');
const workOrders = require('../controllers/work_orders.controller');

// authentication
router.get('/signup', isLoggedIn, isAdmin, authentication.signUpGet);
router.post('/signup', isLoggedIn, isAdmin, authentication.signUpPost);
router.get('/signin', isNotLoggedIn, authentication.signInGet);
router.post('/signin', isNotLoggedIn, authentication.signInPost);
router.get('/profile', isLoggedIn, authentication.profile);
router.get('/forbidden',isLoggedIn, authentication.forbidden);
router.get('/logout', isLoggedIn, authentication.logout);

// work orders
router.get('/', isLoggedIn, workOrders.list);
router.get('/work-orders', isLoggedIn, workOrders.list);
router.get('/work-orders/add', isLoggedIn, workOrders.add);
router.get('/work-orders/edit/:id', isLoggedIn, workOrders.edit);
router.post('/work-orders/save', isLoggedIn, uploads.single('archivos'),  workOrders.saveNew);
router.post('/work-orders/save/:id', isLoggedIn, uploads.single('archivos'),  workOrders.saveUpdate);
router.get('/work-orders/delete/file/:wo/:id', isLoggedIn,  workOrders.deleteFiles);
router.post('/work-orders/add/comment/:wo', isLoggedIn,  workOrders.addComment);

// admin
router.get('/admin', isLoggedIn, isAdmin, admin.admin);
router.get('/admin/users', isLoggedIn, isAdmin, admin.users);
router.get('/admin/users/delete/:id', isLoggedIn, isAdmin, admin.usersDelete);

// rest users
router.get('/rest/users', rest.get_users); //listar todo
router.post('/rest/users', rest.create_user); // crear
router.get('/rest/users/:id', rest.get_user_by_id); // listar un usuario
router.delete('/rest/users/:id', rest.delete_user); // eliminar
router.put('/rest/users/:id', rest.update_user); // actualizar

// api
router.get('/api/auth/login', authentication.apiLogin);


module.exports = router;