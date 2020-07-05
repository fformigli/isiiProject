const express = require('express');
const morgan = require('morgan');
//init
const app = express();

//settings
app.set('port', process.env.PORT || 3000)

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//globals

//routes
app.use(require('./routes/index.js'));

//public

//start
app.listen(app.get('port'), () => {
    console.log('Server running on port '+app.get('port'));
});