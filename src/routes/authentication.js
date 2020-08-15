const { Router } = require('express');
const router = Router();
const { isLoggedIn, isNotLoggedIn, isAdmin } = require('../lib/auth');
const passport = require('passport');

router.get('/signup', isLoggedIn, isAdmin, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isLoggedIn, isAdmin, passport.authenticate('local.signup', {
    successRedirect: '/manage/users',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('auth/profile');
});

router.get('/forbidden',isLoggedIn, (req, res)=>{
    req.flash('message', 'No posee permisos para ver esta página');
    res.redirect('/profile');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;