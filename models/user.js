const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default;
const userSchema= new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        },
    googleId:{
        type: String,
        unique: true
    },
    passwordSet: {
        type: Boolean,
        default: false
    },
});
//console.log("password local mongoose",passportLocalMongoose);
//console.log(typeof passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;

    