const Listing = require('./models/listing');
const ExpressError=require('./utils/ExpressError');
const {listingSchema,reviewSchema} = require('./schema.js');
const Review = require('./models/review.js');


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);

    if(error){
        let errmsg=error.details.map(el=>el.message).join(",");
        return next(new ExpressError(400,errmsg));
    }
    else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body,{convert:true});

    if(error){
        let errmsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}

module.exports.isloggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be signed in first!");
        req.session.redirectUrl=req.originalUrl;
        return res.redirect('/login');

    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.ensurePasswordSet = (req, res, next) => {
  if (req.user && req.user.googleId && !req.user.passwordSet) {
    return res.redirect("/set-password");
  }
  next();
};