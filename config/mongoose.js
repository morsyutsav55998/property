const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dharmik:Dharmik5599@cluster0.cnfcnth.mongodb.net/property')
const db = mongoose.connection
db.once('open',(err)=>{
     if(err){
          console.log(err);
          return false;
     }
     console.log('DB is connected');
})
module.exports = db 