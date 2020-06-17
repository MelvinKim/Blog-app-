const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const  {isUserAuthenticated} = require('../config/customFunctions');

router.all('/*',isUserAuthenticated,(req,res,next) =>{
  req.app.locals.layout = 'admin';
  next();
})

router.route('/')
      .get(adminController.index);

router.route('/posts')
      .get(adminController.getPosts)

router.route('/posts/create')
      .get(adminController.createPostsGet)
      .post(adminController.submitPosts);

router.route('/posts/edit/:id')
      .get(adminController.editPost)
      .put(adminController.editPostSubmit)

router.route('/posts/delete/:id')
      .delete(adminController.deletePost);

//Admin category routes
router.route('/category/')
      .get(adminController.getCategories)
      .post(adminController.createCategories);

router.route('/category/edit/:id')
      .get(adminController.editCategoriesGetRoute)
      .post(adminController.submitEditCategoriesPage);

//comments routes
router.route('/comment')
      .get(adminController.getComments);



module.exports = router;
