const express = require('express');
const router = express.Router() ; 
const faker = require('faker');
const Post = require('../../models/Post');
const {userAuthenticated} = require('../../helpers/authenticate');

router.all ('/*' ,userAuthenticated, (req, res, next)=>{ // router.all represents that every type of request is acceptable
    // '/*' means that every request that will come from admin/ will be accepted 

    req.app.locals.layout = 'admin'; // this will override the home layout with admin layout 
    next();
});

router.get('/', (req, res) => {
    res.render('admin/index'); // 'render' goes into views directory and will look for something like 'home'
});
/*
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard'); // 'render' goes into views directory and will look for something like 'home'
});*/

router.post('/generate-fake-posts', (req,res)=>{
    for(let i = 0 ; i < req.body.amount ; i++)
    {
        var post =new Post();

        post.title = faker.name.title(); 
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        
        /*post.save().then(savedPost=> {}).catch(err=> {
            console.log(err);
        });
        */
        post.save(function(err){
            if(err)
            {
                throw(err);
            }
        });
    }

    res.redirect('/admin/posts');
});


module.exports = router ;