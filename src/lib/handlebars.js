const { format } = require('timeago.js');
const dateFormat = require('handlebars-dateformat');
const constants = require('./constants')

const helpers = {};

helpers.timeago = (timestamp) => format(timestamp)

helpers.formatter = (timestamp, format) => dateFormat(timestamp, format)

helpers.selectedOption = (a, b) => a == b? "selected" : ""

helpers.verifyPermission = (resources, operation, permissions) => permissions.some( i => i.resources === resources && i.operation === operation)

helpers.checkedOption = (a, b) => a == b? "checked" : ""

helpers.filetypeValidator = (a, b) => a == b

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

helpers.equals = (a, b) => a == b



module.exports = helpers;