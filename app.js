const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const { mongoDbUrl, PORT } = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');
const { globalVariables } = require('./config/configuration');
const methodOverride = require('method-override');
const { selectOption } = require('./config/customFunctions');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;


//initialize app
const app = express();

//configure database
mongoose.connect(mongoDbUrl, {
        useNewUrlParser: true, useUnifiedTopology:true
    })
    .then(response => {
        console.log("MongoDB connected Successfully....");
    })
    .catch(err => {
        console.log("Something went wrong during database connection...." + err);
    })

//configure express
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//configure sessions
app.use(session({
    secret: 'mysecret',
    saveUninitialized: true,
    resave: true
}));

//configure flash
app.use(flash());

//configure passport
app.use(passport.initialize());
app.use(passport.session());

//use global variables
app.use(globalVariables);

//express fileUpload
app.use(fileUpload());



//static files
app.use(express.static(path.join(__dirname, 'public')));

//setting up view engine
// app.engine('handlebars',hbs({
//   defaultLayout:'default'
// }));
// app.set('view engine','handlebars');
app.engine('.hbs', hbs({ defaultLayout: 'default', extname: '.hbs', helpers: { select: selectOption } }));
app.set('view engine', '.hbs');

//middleware for method-override
app.use(methodOverride('newMethod'));

//Routes
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);

//create a listning port
//port number should be accompanied by a CALLBACK function
app.listen(PORT, (req, res) => {
    console.log(`Server started on port ${PORT}`);
});
