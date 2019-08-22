const express = require('express');
const router = express.Router() ; 
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {userAuthenticated}= require('../../helpers/authenticate');

router.all ('/*' , (req, res, next)=>{ // router.all represents that every type of request is acceptable
    // '/*' means that every request that will come from admin/ will be accepted 

    req.app.locals.layout = 'home'; // this will override the home layout with home layout 
    next();
});

router.get('/', (req, res) => {
    
    Post.find({}).then(posts=>{
        Category.find({}).then(categories=>{
            res.render('home/index', {posts : posts , categories : categories }); // 'render' goes into views directory and will look for something like 'home'
        });

    });
    
    
});


router.get('/about', (req, res) => {
    res.render('home/about'); // 'render' goes into views directory and will look for something like 'home'
});


router.get('/login', (req, res) => {
    res.render('home/login'); // 'render' goes into views directory and will look for something like 'home'
});

passport.use(new LocalStrategy ({usernameField: 'email'}, (email, password, done)=>{
    
    // console.log(email);
    // console.log(password);
    User.findOne({email: email}).then(user=>{

        // console.log(user.email);
        // console.log(user.password)

       if(!user) return done(null, false , {message: 'user not found'});

        bcrypt.compare(password , user.password , (err, matched)=>{
            if(err) return err;

            if(matched){
                return done(null , user);
            }
            else{
                return done (null, false, {message: 'Wrong password'});
            }
        });
    }).catch(err=>{
        if(err) console.log(err);
    });

}));

router.get('/logout', (req,res)=>{
    req.logOut();
    res.redirect('/login');
})

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id, function(err, user){
        done(err,user);
    });
});


router.post('/login', (req, res, next) => {
   
    passport.authenticate('local', {
        successRedirect : '/admin',
        failureRedirect : '/login',
        failureFlash : true
    })(req,res,next);
   
   // res.render('home/login'); // 'render' goes into views directory and will look for something like 'home'
});


router.get('/register', (req, res) => {
    res.render('home/register'); // 'render' goes into views directory and will look for something like 'home'
});

router.post('/register', (req, res) => {
    
    let errors = [];
    
    if(!req.body.firstName)
    {
        errors.push({message : 'Enter First Name'});
    }
    if(!req.body.lastName)
    {
        errors.push({message : 'Enter Last name'});const newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : req.body.password
        });

        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password , salt, (err,hash)=>{
                newUser.password = hash;

                newUser.save().then(savedUser => {
                    res.redirect('/'); 
                    console.log('user saved');
                });
                 
            });
        });
    }
    if(!req.body.email)
    {
        errors.push({message : 'Enter Email'})
    }
    if(req.body.password!=req.body.passwordConfirm)
    {
        errors.push({message : 'Password dont match'});
    }

    if(errors.length > 0)
    {
        res.render('home/register' , 
        {
            errors : errors,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email
            
        });
    }
    else
    {
        User.findOne({email : req.body.email}).then(user=>{
            
            if(user)
            {
                req.flash('error_message' , 'User already exists');

                res.redirect('/login');
            }
            else
            {
                const newUser = new User({
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    email : req.body.email,
                    password : req.body.password
                    });
        
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password , salt, (err,hash)=>{
                        newUser.password = hash;
        
                        newUser.save().then(savedUser => {
                            req.flash('success_message' , 'User saved');

                            res.redirect('/login'); 
                            
                            console.log('user saved');
                        });
                         
                    });
                });
            }
            
        });
        


       
    }


    
    
  
});

router.get('/posts/:slug', (req, res) => {

    Post.findOne({slug: req.params.slug}).populate({path : 'comment', populate : {path : 'user', model : 'users'}}).populate('user').then(posts=>{
        Category.find({}).then(categories=>{
            res.render('home/posts', {posts : posts , categories : categories }); // 'render' goes into views directory and will look for something like 'home'
        });
     });
        
});


module.exports = router ;  // exporting router object