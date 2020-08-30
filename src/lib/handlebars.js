const { format } = require('timeago.js');
const dateFormat = require('handlebars-dateformat');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
}

helpers.formatter = (timestamp, format) => {
    return dateFormat(timestamp, format);
}

helpers.selectedOption = (a, b) => {
    return a == b? "selected":"";
}

helpers.filetypeValidator = (a, b) => {
    return a == b;
}

module.exports = helpers;