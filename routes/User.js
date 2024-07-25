const express = require("express");
const router = express.Router();

const { signup, login} = require("../Controllers/Auth");
const {auth, isStudent, isAdmin }=require("../middlewares/auth");


router.post("/login",login);
router.post("/signup",signup);

//protected route

//test route 
router.get("/test", auth,  (req,res)=>{
    res.json({
        success:true,
        message:'Welcome to Protected Route for test',
    })
});

router.get("/student", auth, isStudent, (req,res)=>{
    res.json({
        success:true,
        message:'Welcome to Protected Route for Students',
    })
});

router.get("/admin", auth, isAdmin, (req,res)=>{
    res.json({
        success:true,
        message:'Welcome to Protected Route for Admin',
    })
});

module.exports = router;