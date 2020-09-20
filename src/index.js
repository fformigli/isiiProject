const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


//init
const app = express();

require('./lib/passport');

//settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//middlewares
app.use(session({
    secret: 'testsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//globals
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//public
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use(require('./routes/index.js'));
app.use((req, res)=>{
    res.status(404).render('others/not_found.hbs')
});


//start
app.listen(app.get('port'), '0.0.0.0', () => {
    console.log('Server running on port ' + app.get('port'));
});