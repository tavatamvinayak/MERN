const mongoose = require('mongoose');
const {Schema} = mongoose;
const Login = new Schema({
    
    Fname : String,
    Email : { type :String , unique:true },
    Password : String,

    date: { type: Date, default: Date.now },

})

module.exports = mongoose.model('Login' , Login); // database Collection automatically created name is Login