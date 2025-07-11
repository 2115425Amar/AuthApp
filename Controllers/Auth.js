const bcrypt  = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//signup route handler
exports.signup = async(req,res)=>{
    try{
        const {name ,email, password, role} = req.body;

        //check if user already exist
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User Already Exist'
            })
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }
        catch(err){
        return res.status(500)
        .json({
            success:false,
            message:"error in hashing password",
        })
        }
         
        //create entry for user
        const user = await User.create({
            name,email,password:hashedPassword,role
        })
         
        return res.status(200).json({
            success:true,
            message:"User Created Successfully",
        })
    }
    catch(err){
        console.error(err);
        console.log(err);
        res.status(500)
        .json({
            success:false,
            message:"Error while signup",
        })
    }
}


// ----------------------------------------------------------------------
//login 
exports.login = async(req,res)=>{
    try{
        //data fetch
        const {email,password} = req.body;
        // console.log( email, password);
        
        //validation on email & password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details successfully",
            });
        }

        //check for registered user
   let user = await User.findOne({email});
        // console.log(" User Fetched:", user);
        //if not a regitered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered",
            });
        }

        const payload = {
            email : user.email,
            id : user._id,
            role:user.role,
        }


        //verify password and generate a JWT taken
        if(await bcrypt.compare(password,user.password)){
            //password matched
            let token = jwt.sign(payload, 
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                });
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token", token , options)
            .status(200).json({
                success:true,
                token,
                user,
                message:"User Logged in Successfully",
            });
        }
        else{
            //password does not found
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            });
        }
    }
    catch(err){
        console.error(err);
        console.log(err);
        res.status(500)
        .json({
            success:false,
            message:"Error while logging in",
        })
    }
}