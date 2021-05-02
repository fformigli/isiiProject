const { isLoggedIn, isNotLoggedIn, isAdmin } = require('../lib/auth');
const { Router } = require('express');
const router = Router();
const uploads = require('../lib/multer');

// controllers
const admin = require('../models/admin');
const authentication = require('../models/authentication');
const rest = require('../models/rest');
const workOrders = require('../models/work_orders');
const dashboard = require('../models/dashboard');
const task = require('../models/task')
const project = require('../models/project')
const base = require('../models/base')

// authentication
router.post('/admin/users', isLoggedIn, isAdmin, authentication.signUpPost);
router.get('/signin', isNotLoggedIn, authentication.signInGet);
router.post('/signin', isNotLoggedIn, authentication.signInPost);
router.get('/profile', isLoggedIn, authentication.profile);
router.get('/forbidden',isLoggedIn, authentication.forbidden);
router.get('/logout', isLoggedIn, authentication.logout);

// work orders
router.get('/work-orders', isLoggedIn, workOrders.list);
router.get('/work-orders/add', isLoggedIn, workOrders.add);
router.get('/work-orders/edit/:id', isLoggedIn, workOrders.edit);
router.post('/work-orders/save', isLoggedIn, uploads.single('archivos'),  workOrders.saveNew);
router.post('/work-orders/save/:id', isLoggedIn, uploads.single('archivos'),  workOrders.saveUpdate);
router.get('/work-orders/delete/file/:wo/:id', isLoggedIn,  workOrders.deleteFiles);
router.post('/work-orders/add/comment/:wo', isLoggedIn,  workOrders.addComment);

// admin
router.get('/signup', isLoggedIn, isAdmin, admin.signUpGet);
router.get('/admin/users/edit/:id', isLoggedIn, isAdmin, admin.editUser)
router.post('/admin/users/:id', isLoggedIn, isAdmin, admin.updateUser)
router.get('/admin', isLoggedIn, isAdmin, admin.admin);
router.get('/admin/users', isLoggedIn, isAdmin, admin.users);
router.get('/admin/users/delete/:id', isLoggedIn, isAdmin, admin.usersDelete);
router.get('/admin/roles', isLoggedIn, isAdmin, admin.roleList);
router.get('/admin/rolesForm', isLoggedIn, isAdmin, admin.roleAdd);
router.post('/admin/roles', isLoggedIn, isAdmin, admin.roleSave);
router.get('/admin/roles/edit/:id', isLoggedIn, isAdmin, admin.roleAdd);
router.post('/admin/roles:id', isLoggedIn, isAdmin, admin.roleSave);
router.get('/admin/permissions', isLoggedIn, isAdmin, admin.permissions);

// rest users
router.get('/rest/users', rest.get_users); //listar todo
router.post('/rest/users', rest.create_user); // crear
router.get('/rest/users/:id', rest.get_user_by_id); // listar un usuario
router.delete('/rest/users/:id', rest.delete_user); // eliminar
router.put('/rest/users/:id', rest.update_user); // actualizar

// dashboard
router.get('/', isLoggedIn, dashboard.view);
router.get('/dashboard', isLoggedIn, dashboard.view); // todo

// tareas
router.get('/tasks', isLoggedIn, task.list)
router.get('/tasks/add', isLoggedIn, task.form)
router.post('/tasks', isLoggedIn, task.save)
router.get('/tasks/edit/:id', isLoggedIn, task.form)
router.post('/tasks/:id', isLoggedIn, task.save)

// proyectos
router.get('/projects', isLoggedIn, project.list)
router.get('/projects/new', isLoggedIn, project.form)
router.post('/projects', isLoggedIn, project.save)
router.get('/projects/edit/:id', isLoggedIn, project.form)
router.post('/projects/:id', isLoggedIn, project.save)

// lineas base
router.get('/base-lines', isLoggedIn, base.list)
router.get('/base-lines/add', isLoggedIn, base.form)
router.post('/base-lines', isLoggedIn, base.save)
router.get('/base-lines/edit/:id', isLoggedIn, base.form)
router.post('/base-lines/:id', isLoggedIn, base.save)

module.exports = router;