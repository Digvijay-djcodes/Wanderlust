if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
};
const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {listingSchema} = require('../schema.js');
const {isloggedIn,isOwner,validateListing,ensurePasswordSet}=require('../middleware.js');
const listingController=require('../controllers/listings.js');
const multer  = require('multer');
const {storage} = require('../config/cloudConfig.js');
const upload = multer({storage});

//Index and Create Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isloggedIn,ensurePasswordSet,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

//New Route
router.get("/new",isloggedIn,ensurePasswordSet,listingController.renderNewForm);


//Show ,Update and Delete Route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isloggedIn,isOwner,ensurePasswordSet,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isloggedIn,isOwner,ensurePasswordSet,wrapAsync(listingController.deleteListing));


//Edit Route
router.get("/:id/edit",isloggedIn,isOwner,ensurePasswordSet,wrapAsync(listingController.renderEditForm));

module.exports=router;  