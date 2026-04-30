const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const {saveRedirectUrl}=require('../middleware.js');

module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signup=(async(req,res,next)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);

    req.login(registeredUser,err=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
    });
}catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
});

module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
};

module.exports.login=(req,res)=>{
    req.flash("success","Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/listings");
    });
};