const mongoose = require('mongoose');
const URLslugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    user: 
    {
        type: Schema.Types.ObjectId,
        ref : 'users'
    },

    
    category : {

        type : Schema.Types.ObjectId, // this will let us select id of the model
        ref  : 'categories' // reference from mongo db

    },

    title:{
        type: String,
        required : true
    },

    status:{
        type: String,
        default : 'public'
    },

    allowComments : {
        type: Boolean,
        required: true
    },

    body:{
        type : String,
        required : true
    },
    files:{
        type : String,
        
    },
    date: {
        type: Date,
        default : Date.now(),
    },

    slug : {
        type : String,
    },
    comment : [{

        type : Schema.Types.ObjectId, // this will let us select id of the model
        ref  : 'comments' // reference from mongo db

    }]

},{usePushEach : true});

PostSchema.plugin(URLslugs('title' , {field : 'slug'}));

module.exports = mongoose.model('posts' , PostSchema);