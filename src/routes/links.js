const { Router } = require('express');
const router = Router();
const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('links/add.hbs');
});

router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    await pool.query('insert into links (title, url, description) values ($1, $2, $3)', [title, url, description]);
    req.flash('success', 'Enlace guardado.');
    res.redirect('/links');
});

router.get('/', async (req, res) => {
    const links = await pool.query('select * from links');
    res.render('links/list', {links: links.rows});
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('delete from links where id = $1', [id]);
    res.redirect('/links');
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('delete from links where id = $1', [id]);
    res.redirect('/links');
});


router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const link = await pool.query('select * from links where id = $1', [id]);
    res.render('links/edit', {link: link.rows[0]}); 
});

router.post('/edit/:id', async (req, res) => {
    const { title, url, description } = req.body;
    const { id } = req.params;

    await pool.query('update links set title = $1, url = $2, description = $3 where id = $4', [title, url, description, id]);
    res.redirect('/links');
});

module.exports = router;