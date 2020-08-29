const multer = require('multer');
const path = require('path');

const uploads = multer({
    storage: multer.diskStorage({
        filename: function (req, file, done){
            let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
            done(null, Date.now() + ext);
        },
        destination: path.join(__dirname, '../public/uploads')
    })
})

module.exports = uploads;