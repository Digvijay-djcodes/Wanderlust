const mongoose = require('mongoose');
const initdata=require('./data.js');
const listing=require("../models/listing.js");

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

const initDB= async ()=>{
    await listing.insertMany(initdata.data);
    console.log("Database Initialized with Data");
}

initDB();