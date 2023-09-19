const express = require('express')
const routes = express.Router()
const usertoken = require('../middleware/user_jwt')

const {
    register,
    login,
    filter
} = require('../controller/usercontroller')

routes.post('/register',register)
routes.post('/login',login)

// User filter

routes.post('/filter',usertoken,filter);

module.exports = routes