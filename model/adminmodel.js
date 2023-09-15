const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phone: {
        type: Number
    },
});

module.exports = mongoose.model('admin', adminSchema);