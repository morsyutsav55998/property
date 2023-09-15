const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 8000
var passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const mongoose = require('./config/mongoose')

app.use(cookieParser())
app.use(session({
    name : 'utsav garchar',
    secret : 'Coading',
    resave : true,
    saveUninitialized : false,
    Cookie : {      
        maxAge : 200*100*200*1000,
    }
}))
app.use(cors())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:true}))


app.use('/admin',require('./routes/adminroutes'))

app.listen(port,(err)=>{
    if(err){
        console.log(err);
        return false
    }
    console.log("Server is running on port :",port);
})