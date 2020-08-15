const { Router } = require('express');
const router = Router();
const { isLoggedIn, isAdmin} = require('../lib/auth');
const pool = require('../database');
+router.get('/', isLoggedIn, isAdmin, (req, res) => {
    res.render('manage/manage.hbs');
});

router.get('/users', isLoggedIn, isAdmin, async (req, res) => {
    const users = await pool.query('select * from users');
    res.render('manage/users.hbs', {users: users.rows});
});

module.exports = router;