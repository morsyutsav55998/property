const express = require('express')
const routes = express.Router()
const upload = require('../config/multer');
const admintoken = require('../middleware/admin_jwt')

const {
    // Admin
    register,
    login,

    // Property
    addproperty,
    deleteproperty,
    viewproperty,
    updateproperty,
    
    filter,

} = require('../controller/admincontroller')

routes.post('/register',register)
routes.post('/login',login)

// Property
routes.post('/addproperty',admintoken,upload.array('files'),addproperty)
routes.delete('/deleteproperty/:id',admintoken,deleteproperty)
routes.get('/propertydata',admintoken,viewproperty)
routes.put('/updateproperty/:id',admintoken,upload.array('files'),updateproperty)

// Filter
routes.post('/filter',admintoken,filter)



module.exports = routes;