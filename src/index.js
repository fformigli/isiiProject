const express = require('express');
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//routes
app.use(require('./routes/index.js'));

//routes
app.listen(3000);
console.log('Server running on port 3000');