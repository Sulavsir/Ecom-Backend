const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categories = new Schema({
   categorie:{
         type:String,
         required :true
   },
   subCategories:[{
        name:{
            type:String
        }
   }]
})
module.exports = mongoose.model('categories',categories)