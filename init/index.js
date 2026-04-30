require('dotenv').config({path: '../.env'});
console.log("MAP_TOKEN in listings.js:", process.env.MAP_TOKEN);
const mongoose = require('mongoose');
const initdata=require('./data.js');
const listing=require("../models/listing.js");
const fetch = require("node-fetch");

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


const initDB = async () => {
  // 1. Delete old data
    await listing.deleteMany({});

    let newData = [];

  // 2. Loop through all listings
    for (let obj of initdata.data) {

    try {
      // 3. Call Geoapify API
        let response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(obj.location)}&apiKey=${process.env.MAP_TOKEN}`
        );

        let data = await response.json();

      // 4. Handle invalid locations
        if (!data.features || data.features.length === 0) {
        console.log("Skipping:", obj.location);
        continue;
        }

      // 5. Extract coordinates
        let coordinates = data.features[0].geometry.coordinates;

      // 6. Push updated object
        newData.push({
        ...obj,
        owner: "69f1b0314db8aa38c3fd3385", // keep your existing owner
        geometry: {
            type: "Point",
            coordinates: coordinates,
        },
        });

    } catch (err) {
        console.log("Error for:", obj.location);
        console.log(err);
    }
}

  // 7. Insert updated data
    await listing.insertMany(newData);

    console.log("✅ Database initialized with coordinates");
};

initDB();
