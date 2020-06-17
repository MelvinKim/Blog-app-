//create a comment model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a model object
const CommentSchema = new Schema({
    body:{
      type:String,
      required:true
    },
    user:{
      type:Schema.Types.ObjectId,
       ref:'user'
    },
    date:{
      type:Date,
      default:Date.now()
    },
    commentIsApproved:{
      type:Boolean,
      default:false
    }
});


//export the model
//module.exports = mongoose.model('comment',CommentSchema);
module.exports = {Comment:mongoose.model('comment', CommentSchema)};
