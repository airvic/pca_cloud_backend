const mongoose = require ('mongoose');
const user = new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    image:{type:String},
    username:{type:String},
   password:{type:String}
   
})




module.exports = mongoose.model('User',user)