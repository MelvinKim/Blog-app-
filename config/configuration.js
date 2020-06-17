module.exports = {
    mongoDbUrl: 'mongodb://localhost:27017/BlogDB',
    PORT: process.env.PORT || 4000,
    globalVariables: (req, res, next) => {
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        //checking if user is Authenticated
        res.locals.user = req.user || null;
        next();
    }
};