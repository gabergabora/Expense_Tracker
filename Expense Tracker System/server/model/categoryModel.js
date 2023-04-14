var mongoose = require('mongoose');

var categorySchema= new mongoose.Schema({
    savings : {type: Array},
    expenses : {type: Array}
});

module.exports= mongoose.model('Category',categorySchema, 'Categories');
