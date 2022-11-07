const mongoose = require ('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {type: String, unique: true, require: true},
        email:{type: String, unique: true, require: true},
        password:{type: String, unique: true, require: true},
        online: {default: false},
        lastseen: Date  
    },
    { collection: 'users'}

);

const model = mongoose.model('User', userSchema);

module.exports = model;