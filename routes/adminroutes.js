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
    updateproperty
} = require('../controller/admincontroller')

routes.post('/register',register)
routes.post('/login',login)

// Property
routes.post('/addproperty',admintoken,upload.array('files'),addproperty)
routes.delete('/deleteproperty/:id',admintoken,deleteproperty)
routes.get('/propertydata',viewproperty)
routes.put('/updateproperty/:id',admintoken,upload.single('image'),updateproperty)



module.exports = routes;