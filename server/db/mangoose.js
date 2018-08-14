const mongoose = require('mongoose');

const connect = async () => {
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
};

module.exports = {connect};
