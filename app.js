const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
var methodOverride = require('method-override');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


main() // promise object returned
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
})
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views/listings"));

app.get("/listings",async(req,res)=>{
   const  allListings=await Listing.find({});
   res.render("index.ejs",{allListings});
})

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
});

//Show Route
app.get("/listings/:id",async(req,res)=>{   
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("show.ejs",{listing});
});

//Create Route
app.post("/listings",async(req,res)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params
    const listing=await Listing.findById(id);
    res.render("edit.ejs",{listing});
});

//Update Route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})  

//app.get("/",(req,res)=>{
//  res.send("This is Root Page");
//})

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
})