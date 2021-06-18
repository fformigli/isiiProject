const pool = require('../database');

const auth = {}

auth.isLoggedIn = (req, res, next) =>{
    if (req.isAuthenticated())
        return next();
    return res.redirect('/signin');
}

auth.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated())
        return next();
    return res.redirect('/profile');
}

auth.isAdmin = (req, res, next) => {
    if(req.user.isadmin)
        return next();
    return res.redirect('/forbidden');
}

auth.hasPermission = (req, res, next) => {
    next()
}

module.exports = auth