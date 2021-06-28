const pool = require('../database');

const auth = {}

auth.isLoggedIn = (req, res, next) =>{
    if (req.isAuthenticated()){
        const query = 'select distinct ur.contextid, p.operation, p.resources' +
            ' from users u' +
            ' join user_roles ur on ur.userid = u.id' +
            ' join roles r on r.id = ur.rolid' +
            ' join rol_permiso rp on rp.id_rol = ur.rolid' +
            ' join permissions p on p.id = rp.id_permiso' +
            ' where u.id = $1';

        return pool.query(query, [req.user.id])
            .then(result => result.rows)
            .then(rows => {
                res.locals.userPermissions = rows // asignamos el user a la respuesta

                next()
            })
            .catch(e => {
                console.log('error', e)
                req.flash('message', 'Error: ' + e.message);
                res.redirect('/signin');
            })
    } else {
        return res.redirect('/signin');
    }
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

module.exports = auth