//import post models
const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const { isEmpty } = require('../config/customFunctions');

module.exports = {
    index: (req, res) => {
        res.render('admin/index')
    },

    getPosts: (req, res) => {
        //retrieve data from the database
        Post.find()
            .populate('category')
            .then(posts => {
                res.render('admin/posts/index', {
                    posts: posts
                });
            });

    },

    createPostsGet: (req, res) => {
        Category.find()
            .then(cats => {
                res.render('admin/posts/create', {
                    categories: cats
                });
            });

    },

    submitPosts: (req, res) => {
        //TODO :Form Date validation is pending

        const commentsAllowed = req.body.allowComments ? true : false;

        //check for any input file
        let filename = '';

        //check if required file is not empty
        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            //create an upload directory
            let uploadDir = './public/uploads/';
            file.mv(uploadDir + filename, (err) => {
                if (err) {
                    throw err;
                }

            });
        }

        const newPost = new Post({
            title: req.body.title,
            status: req.body.status,
            description: req.body.description,
            allowComments: commentsAllowed,
            category: req.body.category,
            file: `/uploads/${filename}`
        });
        //save data
        newPost.save()
            .then(post => {
                console.log(post);
                req.flash('success-message', 'Post created Successfully...')
                res.redirect('/admin/posts')
            });
    },

    createPost: (req, res) => {
        res.render('admin/posts/create');
    },

    editPost: (req, res) => {
        //store id in a variable
        const id = req.params.id;

        Post.findById(id)
            .then(post => {

                Category.find()
                    .then(cats => {
                        res.render('admin/posts/edit', {
                            post: post,
                            categories: cats
                        });
                    })

            });
    },

    editPostSubmit: (req, res) => {
        const commentsAllowed = req.body.allowComments ? true : false;

        const id = req.params.id;

        Post.findById(id)
            .then(post => {

                post.title = req.body.title;
                post.status = req.body.status;
                post.allowComments = req.body.allowComments;
                post.description = req.body.description;
                post.category = req.body.category;

                post.save()
                    .then(updatePost => {
                        req.flash('success-message', `The Post ${updatePost.title} updated Successfully`);
                        res.redirect('/admin/posts');
                    })

            });

    },

    deletePost: (req, res) => {
        Post.findByIdAndDelete(req.params.id)
            .then(deletedPost => {
                req.flash('success-message', `The post ${deletedPost.title} has been deleted`);
                res.redirect('/admin/posts');
            });
    },

    //create all category methods
    getCategories: (req, res) => {

        Category.find()
            .then(cats => {
                res.render('admin/category/index', { categories: cats });
            });
    },

    createCategories: (req, res) => {
        var categoryName = req.body.name;

        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });

            newCategory.save()
                .then(category => {
                    res.status(200).json(category);
                });
        }

    },

    editCategoriesGetRoute: async(req, res) => {
        //getting id from the parameters
        const catId = req.params.id;
        //getting the categories asynchronously
        const cats = await Category.find();
        Category.findById(catId)
            .then(cat => {
                res.render('admin/category/edit', {
                    category: cat,
                    categories: cats
                });
            });
    },

    submitEditCategoriesPage: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;
        if (newTitle) {
            Category.findById(catId)
                .then(category => {
                    category.title = newTitle;
                    category.save()
                        .then(updated => {
                            res.status(200).json({ url: '/admin/category' })
                        })
                })
        }

    },

    //comments route section
    getComments: (req, res) => {
        //find all comments present in the database
        Comment.find()
            //populate only those of the corresponding user
            .populate('user')
            .then(comments => {
                res.render('admin/comments/index', { comments: comments })
            })
    }

}