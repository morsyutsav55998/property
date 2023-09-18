const admin = require('../model/adminmodel')
const sharp = require('sharp');
const zlib = require('zlib');
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
     }
     var data = await admin.findOne({ email });
     if (data == null) {
          res.json({ message: "Plese register or enter valid email" })
     }
     else {
          if (data.password == password) {

               var token = await jwt.sign({ id: data.id }, 'admin_data');

               res.cookie('adminjwt', token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
               });
               res.json({ Message: "Admin Login Successful", Token: token });
          }
          else {
               res.json({ message: "Admin Login Password Failed" })
          }
     }
}

// Property
exports.addproperty = async (req, res) => {
     try {
          const { propertyname, propertytype, propertydetail, price } = req.body;
          const files2 = req.files;
          const files = [];
          for (const file of files2) {
               // const filePath = imgpath + file.filename;
               const resizedFilePath = imgpath + 'resized-' + file.filename;
               await sharp(file.path)
                    .jpeg({ quality: 20 })
                    .toFile(path.join(__dirname, '..', resizedFilePath));
               fs.unlinkSync(file.path);
               files.push(resizedFilePath);
          }
          const admindata = await property.create({ propertyname, propertytype, propertydetail, price, files });
          if (admindata) {
               res.json({ status: 200, message: "Property Inserted Successfully" });
          }
     } catch (error) {
          console.log(error);
     }
}
exports.deleteproperty = async (req, res) => {
     try {
          const propertyToDelete = await property.findById(req.params.id);
          if (propertyToDelete) {
               for (let file of propertyToDelete.files) {
                    let filePath = path.join(__dirname, '../' + file);
                    if (fs.existsSync(filePath)) {
                         fs.unlinkSync(filePath);
                    }
               }
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
          // let propertyTypes = ["2BHK", "3BHK"]; // Add more property types as needed
          // let propertydata = await property.aggregate([
          //      {
          //           $match: {
          //                propertytype: { $in: propertyTypes }
          //           }
          //      }
          // ])
          // res.json({ property: propertydata })
     } catch (error) {
          console.log(error);
     }

}
exports.updateproperty = async (req, res) => {
     try {
          const { propertyname, propertytype, propertydetail, price } = req.body;
          const files2 = req.files;
          if (req.files) {
               const propertyOlddata = await property.findById(req.params.id);
               for (let i = 0; i < propertyOlddata.files.length; i++) {
                    const filePath = path.join(__dirname, '../' + propertyOlddata.files[i]);
                    fs.unlinkSync(filePath);
               }
          }
          const files = [];
          for (const file of files2) {
               const resizedFilePath = imgpath + 'resized-' + file.filename;
               await sharp(file.path)
                    .jpeg({ quality: 20 })
                    .toFile(path.join(__dirname, '..', resizedFilePath));
               fs.unlinkSync(file.path);
               files.push(resizedFilePath);
          }
          const updatedProperty = await property.findByIdAndUpdate(req.params.id, { propertyname, propertytype, propertydetail, price, files }, { new: true });
          if (updatedProperty) {
               res.json({ status: 200, message: "Property Updated Successfully", Updated: updatedProperty });
          }
     } catch (error) {
          console.log(error);
          res.json({ status: 500, message: "An error occurred" });
     }
}

// Filter

exports.filter = async (req, res) => {
     // console.log(req.body);
     // const filterFields = req.body;

     // // Convert string fields to float if they represent numeric values
     // const numericFields = [
     //      "search",
     //      "propertyname",
     //      "propertytype",
     //      "propertydetail",
     // ];
     // numericFields.forEach((field) => {
     //      if (filterFields[field]) {
     //           filterFields[field] = parseFloat(filterFields[field]);
     //      }
     // });

     // // Construct the query object based on non-empty fields in filterFields
     // const query = {};
     // Object.entries(filterFields).forEach(([key, value]) => {
     //      if (value !== null && value !== undefined && value !== "") {
     //           if (key === "search") {
     //                query["price"] = { ...query["price"], $lte: value };
     //           }
     //           else if (key === "propertyname") {
     //                query["price"] = { ...query["price"], $gte: value };
     //           }
     //           else if (key === "propertytype") {
     //                query["price"] = { ...query["price"], $gte: value };
     //           }
     //           else if (key === "propertydetail") {
     //                query["price"] = { ...query["price"], $gte: value };
     //           }
     //           else {
     //                // Check if the value is an array
     //                if (Array.isArray(value)) {
     //                     // If the value is an array, create a $in query
     //                     query[key] = { $in: value };
     //                } else {
     //                     // If the value is not an array, use a simple equality query
     //                     query[key] = value;
     //                }
     //           }
     //      }
     // });

     try {
          const filterFields = req.body;
          const query = {};
          Object.entries(filterFields).forEach(([key, value]) => {
               if (value !== null && value !== undefined && value !== "") {
                    if (Array.isArray(value)) {
                         query[key] = { $in: value };
                    } else {
                         query[key] = value;
                    }
               }
          });
          const propertydata = await property.find(query).collation({ locale: 'en', strength: 2 });
          res.json({message:"Matched data :", propertydata });
     } catch (error) {
          console.log(error);
          res.json({ status: 500, message: "An error occurred" });
     }
}