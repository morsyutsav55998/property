const admin = require('../model/adminmodel')
const jwt = require('jsonwebtoken')
const path = require('path');
const imgpath = '/images/'
const fs = require('fs');

const property = require('../model/propertymodel')

exports.register = async (req, res) => {
     const admindata = await admin.create(req.body)
     if (admindata) {
          res.json({ status: 200, message: "Admin Inserted Successfully" })
     }
     else {
          res.json({ status: 400, message: "Something Wrong" })
     }
}

exports.login = async (req, res) =>{

     const { email, password } = req.body
    
     if(email== null || password==null){
          res.status(404).json({message:"please some field is required"});
          console.log(req.body)
     }
     console.log(req.body)

     var data = await admin.findOne({ email });

     if (data == null) {

          console.log("please register or enter valid email");
          res.json({ message: "Plese register or enter valid email" });

     }
     else { 

          if (data.password == password) {

               var token = await jwt.sign({ id: data.id }, 'admin_data');
             
               res.cookie('adminjwt', token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
               });
               // console.log(token);
               console.log("login successfully");
               res.json({ Message: "Admin Login Successful", Token: token });
          }
          else {
               // console.log(req.body);
               res.json({ message: "Admin Login Password Failed" })
               console.log("enter valid password");

          }
     }
}

// Property

exports.addproperty = async (req, res) => {

     console.log(req.body);
     console.log(req.files);

     var { propertyname,propertytype,propertydetail} = req.body
     var files = req.files
     // var image = [];
     // for (var file of files) {
     //      image.push(imgpath + file.filename)
     // }
     // console.log(image);
     // const admindata = await property.create(location,propertytype,contactdetail,image)
     // if (admindata) {
     //      res.json({ status: 200, message: "Property Inserted Successfully" })
     // }

}

exports.deleteproperty = async (req,res)=>{

     try {

          var data = await property.findById(req.params.id)
          var imgpath = data.image
          fs.unlinkSync(path.join(__dirname, '../' + imgpath), () => {

              res.json({ message: "Image deleted successfully" })
          })

          await property.findByIdAndDelete(req.params.id)
          res.json({ message: "Property deleted successfully" })

      } catch (error) {
          console.log(error, 'catch error');
      }
}
exports.viewproperty = async (req,res)=>{
     try {
          let propertydata = await property.find()
          res.json({ property: propertydata })
      } catch (error) {
          console.log(error);
      }
}
exports.updateproperty = async (req,res)=>{  
    const userToUpdate = await property.findById(req.params.id);
    const oldImagePath = path.join(__dirname, '../' + userToUpdate.image);
    if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
    }
    const newImagePath = '/images/' + req.file.filename;

    const updatedUser = await property.findByIdAndUpdate(req.params.id, { ...req.body, image: newImagePath }, { new: true });
    res.json({ message: "Property updated successfully", Updated: updatedUser });
}