const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    pool.query('select * from users where username = $1', [username], (err, users) => {
        if (err) return done(null, false, req.flash('message', 'No se pudo conectar con la base de datos.'));
        if (!users || users.rowCount === 0) return done(null, false, req.flash('message', 'Usuario no existe'));
        
        const user = users.rows[0];
        helpers.matchPassword(password, user.password, (err, success)=>{
            if(err) return done(null, false, req.flash('message', 'Contraseña Invalida'));
            done(null, user, req.flash('success', 'Bienvenido, ' + user.fullname));
        });
    });
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, username, password, done) => {
    const { fullname, isAdmin } = req.body
    password = await helpers.encryptPassword(password);

    pool.query('select * from users where username = $1', [username], (err, users) => {
        if (err) return done(null, false, req.flash('message', 'No se pudo conectar con la base de datos.'));
        if(users.rows.length > 0) return done(null, false, req.flash('message', 'El username ya existe'));

        pool.query('insert into users(fullname, username, password, isadmin) '
        + 'values ($1, $2, $3, $4) returning id', [fullname, username, password, isAdmin == null ? 0 : isAdmin], (err, data) => {
            if(err) return done(err);
            return done(null, req.user);
        });
    
    }); 
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    pool.query('select * from users where id = $1', [id], (err, users) =>{
        if(err) return done(null, false, req.flash('message', 'No se pudo conectar con la base de datos.'));
        if(!users) return done(null, false, req.flash('message', 'No se encontro el Usuario'));
        done(null, users.rows[0]);
    });
});