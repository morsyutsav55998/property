const jwt = require('jsonwebtoken');
const admin = require('../model/adminmodel');

const admin_token = async(req,res,next)=>{
    var token = req.headers.authorization
    console.log(token)
    if(token){
        console.log("token success");
        var adminSchema = await jwt.verify(token,'admin_data',(err,data)=>{
            if(err){
                console.log(err);
            }
            return data
        })

        if(adminSchema == undefined){
            res.json({message:"token in valid"})
        }
        else{
            var data= await admin.findById(adminSchema.id)
            if(data==null){
                res.json({message:"data not found"})
                console.log(data);
            }
            else{
                req.admin=data
                next()
            }
        }
    }
    else{
        res.json({message:"login require"})
    }
}


module.exports=admin_token;