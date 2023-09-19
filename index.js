const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 8000
var passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const mongoose = require('./config/mongoose')

// Session
app.use(session({
    name: 'utsav garchar',
    secret: 'Coading',
    resave: true,
    saveUninitialized: false,
    Cookie: {
        maxAge: 200 * 100 * 200 * 1000,
    }
}))

// Function call
app.use(cookieParser())
app.use(cors())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/admin', require('./routes/adminroutes'))
app.use('/user', require('./routes/useroutes'))

// Server
app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log("Server is running on port :", port);
})