const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body);
    console.log(username);
    console.log(password);
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, username, password, done) => {
    const { fullname } = req.body
    password = await helpers.encryptPassword(password);

    newUser = {
        username,
        password,
        fullname
    };
    const result = await pool.query('insert into users(fullname, username, password) '
        + 'values ($1, $2, $3) returning id', [fullname, username, password]);
    newUser.id = result.rows[0].id;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const users = await pool.query('select * from users where id = $1', [id]);
    done(null, users.rows);
});