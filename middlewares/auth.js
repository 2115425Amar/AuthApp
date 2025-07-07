const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next)=>{
    try{
        console.log("cookie", req.cookies.token);
        console.log("body",req.body.token);
      //  console.log("header", req.header("Authorization"));

        const token = req.cookies.token ||
            req.body.token ||
           (req.header("Authorization") && req.header("Authorization").replace("Bearer", "").trim());

        if(!token ||  token===undefined){
            return res.status(401).json({
                success:false,
                message:"Token Missing"
            })
        }

        //verify the token
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decode;
            next();
        }catch(err){
            return res.status(401).json({
                success:false,
                message:"Token is Invalid"
            });
        }
    }catch(err){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying the token"
        });
    }
};


exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a Protected Route for students"
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"user role is not matching"
        });
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a Protected Route for Admin"
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"user role is not matching"
        });
    }
}