const bcrypt = require('bcryptjs');

const helpers = {}

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)
    return hash;
};

helpers.matchPassword = (password, savedPassword, done) => {
    bcrypt.compare(password, savedPassword, (err, match) => {
        if(err) return console.error(err);
        if(!match) return done('Contraseña Incorrecta', false);
        return done(null, match);
    });
};

module.exports = helpers;