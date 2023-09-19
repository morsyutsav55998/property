const user = require('../model/usermodel')
const property = require('../model/propertymodel')
const jwt = require('jsonwebtoken')
exports.register = async (req, res) => {
    const userdata = await user.create(req.body)
    if (userdata) {
         res.json({ status: 200, message: "User Inserted Successfully" })
    }
    else {
         res.json({ status: 400, message: "Something Wrong" })
    }
}
exports.login = async (req,res)=>{
    const { email, password } = req.body
     if (email == undefined || password == undefined) {
          res.status(404).json({ message: "please some field is required" });
     }
     var data = await user.findOne({ email });
     if (data == null) {
          res.json({ message: "Plese register or enter valid email" })
     }
     else {
          if (data.password == password) {

               var token = await jwt.sign({ id: data.id }, 'user_data');

               res.cookie('userjwt', token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
               });
               res.json({ Message: "User Login Successful", Token: token });
          }
          else {
               res.json({ message: "Admin Login Password Failed" })
          }
     }
}

exports.filter = async (req,res)=>{
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