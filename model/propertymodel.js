const mongoose = require('mongoose');
const propertySchema = new mongoose.Schema({
    propertyname: {
        type: String
    },
    propertytype:{
        type: String
    },
    propertydetail:{
        type: Object
    },
    files:{
        type: Array
    }
});
module.exports = mongoose.model('property', propertySchema);