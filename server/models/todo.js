const mongoose = require('mongoose');

let Todo = mongoose.model('Todo', new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            minLength: 1,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Number
        }
    },
    {
        versionKey: false
    }
));

module.exports = {Todo};
