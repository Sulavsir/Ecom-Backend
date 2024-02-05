const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categories = new Schema({
   category:{
         type:String,
         required :true
   },
   subCategories:[{
        name:{
            type:String
        }
   }]
},{timestamps:true})
module.exports = mongoose.model('categories',categories)