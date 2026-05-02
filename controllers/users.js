const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const {saveRedirectUrl,isloggedIn}=require('../middleware.js');

module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signup=(async(req,res,next)=>{
    try{
    let {username,email,password}=req.body;
    let existingUser=await User.findOne({email});
    if(existingUser){
        req.flash("error","A user with that email already exists!");
        return res.redirect("/signup");
    }
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);

    req.login(registeredUser,err=>{
        if(err){
            return next(err);
        }
        req.flash("success","Account Created!  Welcome to Wanderlust!");
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

module.exports.login = async (req, res) => {

  let user = await User.findOne({ username: req.body.username });

  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/login");
  }

  // BLOCK Google users without password
  if (user.googleId && !user.passwordSet) {
    req.flash("error", "Please login with Google or set a password.");
    return res.redirect("/login");
  }

  req.flash("success", "Welcome back!");
  res.redirect("/listings");
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

module.exports.googleCallBack = async (req, res) => {

  // Proper success message
  if (req.isNewUser) {
    req.flash("success", "Account created successfully!");
  } else {
    req.flash("success", "Welcome back! Logged in successfully.");
  }

  // Redirect to set password if needed
  if (req.user && req.user.googleId && !req.user.passwordSet) {
    return res.redirect("/set-password");
  }

  res.redirect("/listings");
};


module.exports.renderSetPasswordForm=(req,res)=>{
    res.render("user/setPassword.ejs");
};


module.exports.setPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    // validation
    if (!newPassword || newPassword.length < 6) {
      req.flash("error", "Password must be at least 6 characters.");
      return res.redirect("/set-password");
    }

    let user = await User.findById(req.user._id);

    // safety
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    // set password
    await user.setPassword(newPassword);

    user.passwordSet = true;
    await user.save();

    // update session
    req.login(user, (err) => {
      if (err) return next(err);

      req.flash("success", "Password set successfully!");
      res.redirect("/listings");
    });

  } catch (err) {
    next(err);
  }
};