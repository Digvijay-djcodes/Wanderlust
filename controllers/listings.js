const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {listingSchema} = require('../schema.js');
const {isloggedIn,isOwner,validateListing}=require('../middleware.js');



module.exports.index=(async(req,res)=>{
    let filter = {};

  // 🔍 SEARCH (title + location)
    if (req.query.search && req.query.search.trim() !== "") {
        filter.$or = [
            { location: { $regex: req.query.search, $options: "i" } },
            { title: { $regex: req.query.search, $options: "i" } },
            {country: { $regex: req.query.search, $options: "i" } },
    ];
}
  // 🏷️ CATEGORY FILTER
    if (req.query.category && req.query.category !== "") {
        if (req.query.category){
            filter.category={
                $regex: `^${req.query.category}$`,
                $options: "i"
            }
        }
    }
    const  allListings=await Listing.find(filter);
    res.render("listings/index.ejs", {  
    allListings,  
    search: req.query.search,  
    category: req.query.category  
});
});

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=(async(req,res)=>{   
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({"path": "reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing, mapToken: process.env.MAP_TOKEN});
});

module.exports.createListing=(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Invalid Listing Data");
    }
    if(typeof req.file === "undefined"){
        throw new ExpressError(400,"Image is required");
    }
    // Geoapify API call
    let response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(req.body.listing.location)}&apiKey=${process.env.MAP_TOKEN}`
    );

    let data = await response.json();
    console.log("Geoapify response data:", data);
    if (!data.features || data.features.length === 0) {
        throw new ExpressError(400, "Invalid location");
    }
    let coordinates = data.features[0].geometry.coordinates;
    const newListing= new Listing(req.body.listing);
    //SAVE coordinates
    newListing.geometry = {
    type: "Point",
    coordinates: coordinates
    };
    let url=req.file.path;
    let filename=req.file.filename;

    newListing.owner = req.user._id;
    newListing.image.url=url;
    newListing.image.filename=filename;
    await newListing.save();
    req.flash("success","Successfully made a new listing!");
    res.redirect("/listings");
});

module.exports.renderEditForm=(async(req,res)=>{
    let {id}=req.params
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing!");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload/","/upload/w_600/");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
});

module.exports.updateListing=(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Invalid Listing Data");
    }
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission to edit!");
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id,req.body.listing);
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image.url=url;
        listing.image.filename=filename;
    }
    await listing.save();
    req.flash("success","Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
});

module.exports.deleteListing=(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted the listing!");
    res.redirect("/listings");
});