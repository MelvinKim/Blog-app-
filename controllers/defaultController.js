const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;

module.exports ={
  index: async(req,res) =>{
    //search for posts
    const posts = await Post.find();
    //search for categories
    const categories = await Category.find();

    res.render('default/index',{
      posts:posts,
      categories:categories
    });
  },
  loginGet: (req,res) =>{
    res.render('default/login');
  },
  loginPost: (req,res) =>{

  },
  registerGet: (req,res) =>{
    res.render('default/register');
  },
  registerPost: (req,res)=>{
    //create an Array of errors to handle REGISTRATION errors
    let errors = [];
    if(!req.body.firstName) {
      errors.push({message:'First name is required'})
    }
    if(!req.body.lastName) {
      errors.push({message:'Last name is required'})
    }
    if(!req.body.email) {
      errors.push({message:'Email is required'})
    }
    if(!req.body.password) {
      errors.push({message:'Password is required'})
    }
    if(!req.body.passwordConfirm) {
      errors.push({message:'Please confirm your password'})
    }
    if(req.body.password !== req.body.passwordConfirm) {
      errors.push({message:'Password do not match'})
    }

    if(errors.length > 0){
      res.render('default/register', {
        errors:errors,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email
      });
    }
    else{
      User.findOne({email:req.body.email})
        .then(user =>{
          //check if user exists
          if(user){
            req.flash('error-message','Email already exists!! , Try Login');
            res.redirect('/login');
          }
          else{
            //create new User
            const newUser = new User(req.body);

            //encrypt password
            bcrypt.genSalt(10,(err,salt) =>{
              bcrypt.hash(newUser.password,salt,(err,hash) =>{
                newUser.password = hash;
                  newUser.save()
                      .then( user =>{
                        req.flash('sucess-message',"Registration completed successfully");
                        res.redirect('/login')
                      });
              });
            });
          }
        })
    }
  },

  getSinglePost:(req,res) =>{
    //fetch post id
    const id = req.params.id;

    Post.findById(id)
        .then(post =>{
           if(!post){
             res.status(404).json({message:'Post not found'});
           }
           else{
             res.render('default/singlePost',{post:post});
           }
        })
  },

submitComment:(req,res) =>{
    //check to see if user is logged in first before submitting Comments
    if(req.user){
      Post.findById(req.body.id)
          .then(post => {
            //create a new variable once post is found
          const newComment = new Comment({
            user:req.user.id,
            body:req.body.comment_body
          });

         //push user's comment into the Array
         post.comments.push(newComment);
         post.save().then(savedPost =>{
           newComment.save().then(savedComment =>{
             req.flash('success-message','Comment submitted for review');
             res.redirect(`/post/${post._id}`);
           });
         });

          });
    }
    else{
      req.flash('error-message','Login To Comment');
      res.redirect('/login');
    }
}

}
