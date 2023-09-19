const jwt = require('jsonwebtoken');
const user = require('../model/usermodel');

const user_token = async(req,res,next)=>{
    var token = req.headers.authorization
    console.log(token)
    if(token){
        console.log("token success");
        var userSchema = await jwt.verify(token,'user_data',(err,data)=>{
            if(err){
                console.log(err);
            }
            return data
        })

        if(userSchema == undefined){
            res.json({message:"token in valid"})
        }
        else{
            var data= await user.findById(userSchema.id)
            if(data==null){
                res.json({message:"data not found"})
                console.log(data);
            }
            else{
                req.user=data
                next();
            }
        }
    }
    else{
        res.json({message:"login require"})
    }
}


module.exports=user_token;