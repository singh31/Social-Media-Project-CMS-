const express = require('express');
const router = express.Router() ; 
const Category = require('../../models/Category');
const {userAuthenticated}= require('../../helpers/authenticate');

router.all ('/*' ,userAuthenticated, (req, res, next)=>{ // router.all represents that every type of request is acceptable
    // '/*' means that every request that will come from admin/ will be accepted 

    req.app.locals.layout = 'admin'; // this will override the home layout with admin layout 
    next();
});

router.get('/', (req, res) => {
    Category.find({}).then(categories=>{
        res.render('admin/categories/index', {categories : categories}); // 'render' goes into views directory and will look for something like 'home'
        
    });
    
    
});


router.post('/create', (req, res) => {

    const newCategory  = Category({
        name : req.body.name,
    });

    newCategory.save().then(savedCategory=>{
        res.redirect('/admin/categories'); 
    });

});

router.get('/edit/:id', (req, res) => {

Category.findOne({_id : req.params.id}).then(category=>{
    res.render('admin/categories/edit', {category : category});
});

});


router.put('/edit/:id', (req, res) => {

    Category.findOne({_id : req.params.id}).then(category=>{
        category.name = req.body.name;
        category.save().then(savedCategory=>{
            res.redirect('/admin/categories');
        })
    });

   
});

/*router.get('/delete/:id', (req,res)=>{
    Category.findOne({_id: req.params.id}).then(category =>{
        res.render('admin/categories/delete',{category : category})
    })
});
*/
router.delete('/:id', (req,res)=>{

   
        Category.deleteOne({_id : req.params.id}).then(deletedCategory=>{
            res.redirect('/admin/categories');
        });

});

module.exports = router ;