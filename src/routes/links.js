const { Router } = require('express');
const router = Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add.hbs');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    await pool.query('insert into links (title, url, description,userid) values ($1, $2, $3, $4)', [title, url, description, req.user.id]);
    req.flash('success', 'Enlace guardado.');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('select * from links where userid = $1', [req.user.id]);
    res.render('links/list', {links: links.rows});
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('delete from links where id = $1', [id]);
    res.redirect('/links');
});


router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const link = await pool.query('select * from links where id = $1', [id]);
    res.render('links/edit', {link: link.rows[0]}); 
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const { id } = req.params;

    await pool.query('update links set title = $1, url = $2, description = $3 where id = $4', [title, url, description, id]);
    res.redirect('/links');
});

module.exports = router;