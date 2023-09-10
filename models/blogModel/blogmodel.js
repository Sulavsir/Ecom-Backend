// blogModel.js

const mongoose = require('mongoose');
//const multer = require('multer');
//const upload =multer({dest: 'uploads/'});

const blogSchema = new mongoose.Schema({
  image:{
    type: [String],
    required: [true,'manditory'],
    trim: true
   // path: String,
    //size: String,
    //required: [false,'not so manditory']
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  tags: {
    type: String,
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft'
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
