const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveRedirectUrl,isloggedIn,ensurePasswordSet}=require('../middleware.js');
const usersController=require('../controllers/users.js');



router.get("/signup",usersController.renderSignupForm);

router.post("/signup",wrapAsync(usersController.signup));

router.get("/login",usersController.renderLoginForm);

router.post("/login",(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash: true})),usersController.login);

router.get("/logout",usersController.logout);

// GOOGLE LOGIN
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//  GOOGLE CALLBACK
router.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res, next) => {
    req.isNewUser = req.authInfo?.isNewUser;  // ✅ IMPORTANT
    next();
  },
  usersController.googleCallBack
);


// SHOW SET PASSWORD PAGE
      router.get("/set-password", isloggedIn, usersController.renderSetPasswordForm);

// HANDLE PASSWORD SET
router.post("/set-password", isloggedIn,usersController.setPassword);
module.exports=router;