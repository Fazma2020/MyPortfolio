const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({


    name: {type:String},
    email: {type:String, unique: true},
    password:{type:String, required: true},
    role: { type: String, enum: ['admin', 'user','restricted']},
    uniqueID: {type: String},

   
});
module.exports = mongoose.model('User',userSchema)

