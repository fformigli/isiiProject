const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
//init
const app = express();

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
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//globals
app.use((req, res, next) => {
    next();
});

//routes
app.use(require('./routes/index.js'));
app.use(require('./routes/authentication.js'));
app.use('/links', require('./routes/links.js'));

//public
app.use(express.static(path.join(__dirname, 'public')));

//start
app.listen(app.get('port'), () => {
    console.log('Server running on port '+app.get('port'));
});