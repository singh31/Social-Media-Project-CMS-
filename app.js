const express = require('express');
const app = express();
const path = require('path');
const exphndl = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const upload = require ('express-fileupload');

const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database')
const passport = require('passport');
//mongoose.Promise = global.Promise ;

//bodyParser
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//method overide
app.use(methodOverride('_method'));
//DB connection
mongoose.connect(mongoDbUrl, { useNewUrlParser : true}).then((db)=>{
    console.log('Connected to db ....');
}).catch(err => console.log(err));


app.use(express.static(path.join(__dirname, 'public'))); // to include static files too
// set view engine
const {select,generateTime} = require('./helpers/handlebars-helpers');
app.engine('handlebars', exphndl({ defaultLayout: 'home' , helpers : {select: select , generateTime : generateTime} })); // it tells that use 'home.handlebars' as default layout (views/layouts)
app.set('view engine', 'handlebars');

//Upload middleware
app.use(upload());


// session

app.use(session({

    secret : 'Arjun',
    saveUninitialized : true,
    resave : true 
}));

app.use(flash());
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
// local variable using middlewares

app.use((req,res,next)=> {

    res.locals.user = req.user || null ; 
    res.locals.success_message  = req.flash('success_message');
    res.locals.error_message  = req.flash('error_message');
    //res.locals.form_errors  = req.flash('form_errors');
    res.locals.error  = req.flash('error');
    next();
});



//load routes  
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

//use routes
app.use('/' , home); // middleware as soon as client will go to '/' (root) then app.use will redirect it to main directory
app.use('/admin', admin);
app.use('/admin/posts',posts);
app.use('/admin/categories',categories);
app.use('/admin/comments',comments);


app.listen( 4500 , function() {
    //if(err) thorw err
    console.log('Listening.....');
});