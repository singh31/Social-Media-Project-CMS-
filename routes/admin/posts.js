const express = require('express');
const router = express.Router() ; 
const Post = require('../../models/Post');
const { isEmpty} = require('../../helpers/upload-helper');
const Category = require('../../models/Category');
const {userAuthenticated}= require('../../helpers/authenticate');


router.all ('/*',userAuthenticated , (req, res, next)=>{ // router.all represents that every type of request is acceptable
    // '/*' means that every request that will come from admin/ will be accepted 

    req.app.locals.layout = 'admin'; // this will override the home layout with admin layout 
    next();
});

router.get('/' , (req,res)=>{
        
   //console.log(req.file);
   
    Post.find({})
    .populate('category').then( posts=>{
        res.render('admin/posts/index', {posts : posts});
    }); 
});


router.get('/my-post' , (req,res)=>{
        
    //console.log(req.file);
    
     Post.find({user: req.user.id})
     .populate('category').then( posts=>{
         res.render('admin/posts/my-post', {posts : posts});
     }); 
 });


router.get('/create' , (req,res)=>{
 
    Category.find({}).then(categories=>{
        res.render('admin/posts/create', {categories: categories});
    });
    
});

router.post('/create' , (req,res)=>{

    let filename = '' ; 
    if(!isEmpty(req.files))
    {
        //console.log('Not EMPTY');
        let file = req.files.file;
         filename = Date.now() +'-' +file.name; 
        let dirUploads = './public/uploads/';'./public/uploads/'
        file.mv(dirUploads + filename , err=>{
            if(err) throw err;
        });
    }
    
    

 //   console.log(req.files);
    
    let allowComment;

    if(req.body.allowComments)
    {
        allowComment = true;
    }
    else
    {
        allowComment = false;
    }

    const newPost = new Post({
        user: req.user.id,
        title : req.body.title,
        status : req.body.status,
        allowComments : allowComment,
        body : req.body.body,
        category : req.body.category,
        files : filename,
    });

    newPost.save().then(savedPost => { 
        //console.log('savedPost');
        req.flash('success_message' , `Post : ${savedPost.title} was saved successfully`);
        
        res.redirect('/admin/posts');
    }).catch(err=>{
        console.log(err);
    });

   // console.log(req.body);
    //res.send('working ');
});

router.get('/edit/:id', (req,res)=>{
    //res.send(req.params.id); 
    Post.findOne({_id : req.params.id}).then(post=>{
        Category.find({}).then(categories=>{
            res.render('admin/posts/edit', {post : post , categories: categories});
        });
    });
    
});

router.put('/edit/:id', (req,res)=>{
  //
   Post.findOne({_id : req.params.id})
   .then(post=>{
    
    if(req.body.allowComments)
    {
        allowComment = true;
    }
    else
    {
        allowComment = false;
    }
  
    let filename = '' ; 
    if(!isEmpty(req.files))
    {
        //console.log('Not EMPTY');
        let file = req.files.file;
         filename = Date.now() +'-' +file.name; 
        let dirUploads = './public/uploads/';'./public/uploads/'
        file.mv(dirUploads + filename , err=>{
            if(err) throw err;
        });
    }
    
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComment;
        post.body = req.body.body;
        post.category = req.body.category;
        post.files = filename;
        
 
  
    post.save().then(updatedPost => { 
        //console.log('savedPost');
        req.flash('success_message' , `Post : ${updatedPost.title} was Editted successfully`);
        res.redirect('/admin/posts');
    }).catch(err=>{
        console.log(err);
    });
});
});

router.delete('/:id' , (req,res)=>{

    Post.findOne({_id: req.params.id}).populate('comment').then(post=>{
            
        if(!post.comment.length < 1)
        {
            post.comment.forEach(comment=>{
  
                comment.remove();
            });
        }
        
        post.remove();  
        
        
        
        res.redirect('/admin/posts');
    });
    /*
    Post.remove({_id: req.params.id },()=>{
        console.log('deleted');
    });*/
});
  







module.exports = router ;
