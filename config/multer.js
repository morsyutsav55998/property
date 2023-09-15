const multer = require('multer')
const path = require('path')
const imagePath = './images'
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',imagePath))
    },
    filename:(req,file,cb)=>{
        var extension = path.extname(file.originalname)
        cb(null,file.fieldname+'-'+Date.now()+extension)
    } 
})

const upload = multer({
    storage: storage,
})

module.exports = upload
