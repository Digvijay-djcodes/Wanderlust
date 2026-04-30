const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default;
const userSchema= new mongoose.Schema({
    email: {
        type: String,
        required: true,
        },
});
//console.log("password local mongoose",passportLocalMongoose);
//console.log(typeof passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;

    