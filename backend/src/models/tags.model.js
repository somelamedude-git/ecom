const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },

    index:{
        type:Number,
        required:true,
        unique:true
    },
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = {
    Tag
}