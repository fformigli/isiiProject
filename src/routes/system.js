const { Router } = require('express');
const router = Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/manage', isLoggedIn, (req, res) => {
    res.render('/manage');
});