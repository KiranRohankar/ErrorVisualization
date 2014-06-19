var mongoose = require('mongoose');

//schema for dvdocs
module.exports = mongoose.model('dvdocs',{
machine:String,
date:String
});


