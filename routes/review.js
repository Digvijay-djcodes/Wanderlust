const express = require('express');
const router = express.Router({mergeParams:true});
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {reviewSchema} = require('../schema.js');
const Review = require('../models/review.js');
var methodOverride = require('method-override');
const {validateReview,isloggedIn,isReviewAuthor}=require('../middleware.js');
const reviewController=require('../controllers/reviews.js');



//REVIEWS
//Post Route for reviews

router.post("/",isloggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Route for reviews

router.delete("/:reviewId",isloggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;
