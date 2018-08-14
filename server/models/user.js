const mongoose = require('mongoose');

let User = mongoose.model('User', new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
            minLength: 1,
            trim: true
        }
    },
    {
        versionKey: false
    }
));

module.exports = {User};
