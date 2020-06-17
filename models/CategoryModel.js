const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define post Schema
const CategorySchema = new  Schema({
  title:{
    type:String,
    required:true
  }

});

//export module
module.exports = {Category: mongoose.model('category',CategorySchema)};
//module.exports = {Category: mongoose.model('category', CategorySchema )};
