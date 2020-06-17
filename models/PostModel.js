const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define post Schema
const postSchema = new  Schema({
  title:{
    type:String,
    required:true
  },
  status:{
    type:String,
    default:'public',
  },
  description:{
    type:String,
    required:true
  },
  creationDate:{
    type:Date,
    default:Date.now()
  },
  user:{
    type:Schema.Types.ObjectId,
    //reference model to obtain ObjectId from
    ref:'user'
  },
  category:{
    type:Schema.Types.ObjectId,
    //reference model to obtain ObjectId from
    ref:'category'
  },
  comments:[
    {
      type:Schema.Types.ObjectId,
      //reference model to obtain ObjectId from
      ref:'comment'
    }
  ],
  allowComments:{
    type:Boolean,
    default:false
  } ,
  file:{
    type:String ,
    default:''
  }
});

//export module
module.exports = {Post: mongoose.model('post',postSchema)};
