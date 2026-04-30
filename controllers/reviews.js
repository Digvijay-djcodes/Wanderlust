const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {reviewSchema} = require('../schema.js');
const {validateReview,isloggedIn,isReviewAuthor}=require('../middleware.js');

module.exports.createReview=(async(req,res)=>{
    const listing= await Listing.findById(req.params.id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","Successfully added the review!");
    res.redirect(`/listings/${listing._id}`);
});

module.exports.deleteReview=(async(req,res)=>{
    const {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
});