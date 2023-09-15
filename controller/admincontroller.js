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

exports.login = async (req, res) => {

     const { email, password } = req.body

     if (email == undefined || password == undefined) {

          res.status(404).json({ message: "please some field is required" });
          console.log(req.body)

     }

     console.log(req.body)

     var data = await admin.findOne({ email });

     if (data == null) {

          // console.log("please register or enter valid email");
          res.json({ message: "Plese register or enter valid email" })

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
               console.log("enter valid password")

          }
     }
}

// Property

exports.addproperty = async (req, res) => {
     try {
          var { propertyname,propertytype,propertydetail } = req.body
          var files2 = req.files
          var files = []
          for (var file of files2) {
               files.push(imgpath + file.filename)
          }
          const admindata = await property.create({propertyname,propertytype,propertydetail,files})
          console.log(admindata);
          if (admindata) {
               res.json({ status: 200, message: "Property Inserted Successfully" })
          }
     } catch (error) {
          console.log(error);
     }
}

exports.deleteproperty = async (req, res) => {

     // try {
     //      var data = await property.findById(req.params.id)
     //      var imgpaths = data.images
     //      for (var imgpath of imgpaths) {
     //           fs.unlinkSync(path.join(__dirname, '../' + imgpath), (err) => {
     //                if (err) {
     //                     console.log(err);
     //                } else {
     //                     console.log("Image deleted successfully");
     //                }
     //           })
     //      }
     //      await property.findByIdAndDelete(req.params.id)
     //      res.json({ message: "Property and associated images deleted successfully" })

     // } catch (error) {
     //      console.log(error, 'catch error');
     // }
     try {
          const propertyToDelete = await property.findById(req.params.id);
          if (propertyToDelete) {
              // Delete images from the file system
              for (let file of propertyToDelete.files) {
                  let filePath = path.join(__dirname, '../' + file);
                  if (fs.existsSync(filePath)) {
                      fs.unlinkSync(filePath);
                  }
              }
              // Delete property from the database
              await property.findByIdAndDelete(req.params.id);
              res.json({ status: 200, message: "Property and associated images deleted successfully" });
          } else {
              res.json({ status: 404, message: "Property not found" });
          }
      } catch (error) {
          console.log(error);
          res.json({ status: 500, message: "An error occurred" });
      }
}
exports.viewproperty = async (req, res) => {
     try {
          let propertydata = await property.find()
          res.json({ property: propertydata })
     } catch (error) {
          console.log(error);
     }
}
exports.updateproperty = async (req, res) => {
     try {
          console.log(req.body);
          console.log(req.files);
          // var { propertyname, propertytype, propertydetail } = req.body
          // var files2 = req.files
          // var files = []
          // for (var file of files2) {
          //     files.push(imgpath + file.filename)
          // }
          // const updatedProperty = await property.findByIdAndUpdate(req.params.id, {propertyname, propertytype, propertydetail, files}, {new: true})
          // if (updatedProperty) {
          //     res.json({ status: 200, message: "Property Updated Successfully", Updated: updatedProperty })
          // }
      } catch (error) {
          console.log(error);
          res.json({ status: 500, message: "An error occurred" });
      }
}