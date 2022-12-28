const mongoose = require('mongoose');
const passportLocalModel = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const UserSchema  =  new Schema({
    email:{
        type:String,
        required : true,
        unique: true
    }
})
UserSchema.plugin(passportLocalModel);
module.exports = mongoose.model('User', UserSchema);