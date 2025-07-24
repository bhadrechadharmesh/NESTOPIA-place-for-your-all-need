const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema ;
const passportLoacalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
});

userSchema.plugin(passportLoacalMongoose);

const User = mongoose.model("user",userSchema);

module.exports = User ; 