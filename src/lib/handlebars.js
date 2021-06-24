const { format } = require('timeago.js');
const dateFormat = require('handlebars-dateformat');
const constants = require('./constants')

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

helpers.checkedOption = (a, b) => {
    return a == b? "checked":"";
}

helpers.filetypeValidator = (a, b) => {
    return a == b;
}

helpers.constantLabel = (name, value) => {
    const values = constants[name].filter((item) => {
        return item.value === value
    })
    console.log({values})
    if(values && values.length > 0)
        return values[0].label
    else
        return ''
}

helpers.equals = (a, b) => {
    return a == b;
}



module.exports = helpers;