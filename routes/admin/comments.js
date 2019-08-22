const express = require('express');
const router = express.Router() ;
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

router.all ('/*' , (req, res, next)=>{ // router.all represents that every type of request is acceptable
    // '/*' means that every request that will come from admin/ will be accepted 

    req.app.locals.layout = 'admin'; // this will override the home layout with admin layout 
    next();
});

router.get('/', (req,res)=>{

   Comment.find({}).then (comments=>{
    res.render('admin/comments/index', {comments : comments});
   }).catch(err=>{
       if(err)
       {
           console.log(err);
       }
   });


});


router.post('/', (req,res)=>{

    Post.findOne({_id: req.body.id}).then( post=>{
        console.log(post);
        
        const newComment = new Comment({
            user : req.user.id,
            body : req.body.body
        });

        post.comment.push(newComment);
        
        post.save().then(savedpost=>{
            console.log('post saved');
            newComment.save().then(savedComment=>{
                console.log('comment saved');
                res.redirect(`/posts/${post.id}`);
            }).catch(err=>{
                if(err)
                console.log(err);
            });
            
        }).catch(err=>{
            console.log(err);
        });
    });


   // res.send('IT WORKS');
});


router.delete('/:id', (req,res)=>{

    Comment.deleteOne({_id : req.params.id}).then(deleteItem=>{
        Post.findByIdAndUpdate({comment : req.params.id}, {$pull : {comment : req.params.id}}, (err, data)=>{
            if(err)
            console.log(err);
            res.redirect('/admin/comments');
        });


    }).catch(err => {
        console.log(err);
    });
});



router.post('/approve-comment', (req, res)=>{



Comment.findByIdAndUpdate(req.body.id , {$set : {approveComment: req.body.approveComment}},(err,result)=>{
    if(err) console.log(err);

    res.send(result);
})
    
});



module.exports = router ;