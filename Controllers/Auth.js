const bcrypt  = require("bcrypt");
const User = require("../models/User");

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
        res.status(500)
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