const mongoose = require ('mongoose');
const Imageurl = new mongoose.Schema({
  url:{type:String}
   
})




module.exports = mongoose.model('imageurl',Imageurl)