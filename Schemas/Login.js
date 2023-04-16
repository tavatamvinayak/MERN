const mongoose = require('mongoose');
const {Schema} = mongoose;
const Login = new Schema({
    Fname : String,
    Email : String,
    Password : String
})

module.exports = mongoose.model('Login' , Login); // database Collection automatically created name is Login