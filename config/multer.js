const multer=require('multer');
const path = require('path')
const sharp = require('sharp');
const avtarpath = '/images'
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',avtarpath))
    },
    filename:(req,file,cb)=>{
        var extension = path.extname(file.originalname)
        cb(null,file.fieldname+'-'+Date.now()+extension)
    } 
})
const upload= multer({
    storage:storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the following filetypes - " + filetypes);
    }
});

module.exports=upload;
