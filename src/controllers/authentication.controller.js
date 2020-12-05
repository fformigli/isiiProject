const { isLoggedIn, isNotLoggedIn, isAdmin } = require('../lib/auth');
const passport = require('passport');

const controller = {}

controller.signUpGet = (req, res) => {
    res.render('auth/signup');
};

controller.signUpPost = passport.authenticate('local.signup', {
    successRedirect: '/admin/users',
    failureRedirect: '/signup',
    failureFlash: true
});

controller.signInGet = (req, res) => {
    res.render('auth/signin');
};

controller.signInPost = (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
};

controller.profile = (req, res) => {
    res.render('auth/profile');
};

controller.forbidden = (req, res)=>{
    req.flash('message', 'No posee permisos para ver esta página');
    res.redirect('/profile');
};

controller.logout = (req, res) => {
    req.logOut();
    res.redirect('/signin');
};

controller.apiLogin = (req, res) => {
    const user = { userId: 1, displayName: "test ok" }
    res.json(user)
}

module.exports = controller;