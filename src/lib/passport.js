const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

async function validarUserExistente(username){
    const users = await pool.query('select * from users where username = $1', [username])
    if(users.rows.length > 0)
        return true;
    return false;
}

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    
    const users = await pool.query('select * from users where username = $1', [username])
    if(users.rows.length > 0) {
        const user = users.rows[0];
        if( await helpers.matchPassword(password, user.password) )
            done(null, user,req.flash('success','Bienvenido, '+user.fullname));
        else
            done(null, false, req.flash('message','Contraseña Invalida'));

    } else {
        return done(null, false, req.flash('message','Usuario no existe'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, username, password, done) => {
    const { fullname, isAdmin } = req.body
    password = await helpers.encryptPassword(password);
    
    newUser = {
        username,
        password,
        fullname,
        isAdmin
    };

    //validar si el usuario ya existe
    if(await validarUserExistente(username)){
        return done(null, false, req.flash('message', 'El username ya existe'));
    }

    const result = await pool.query('insert into users(fullname, username, password, isadmin) '
        + 'values ($1, $2, $3, $4) returning id', [fullname, username, password, isAdmin==null?0:isAdmin]);
    newUser.id = result.rows[0].id;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const users = await pool.query('select * from users where id = $1', [id]);
    done(null, users.rows[0]);
});