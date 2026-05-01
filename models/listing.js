
const mongoose=require("mongoose");
const Review = require("./review");
const user = require("./user.js");
const listingSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description : String,
    image: {
        filename: String,
        url: {
        type: String,
        default: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v)=> v==="" ? "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    }},
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId, 
            ref:"Review"  
        },
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
},
    category: {
        type: String,
        enum: ["City","Rooms","Castles","Mountains","Camping","Pools","Farms","Nature","Beach","Historical","Domes","Boats"],
        required: true
    }
});

listingSchema.post("findOneAndDelete",async function(listing){
    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;