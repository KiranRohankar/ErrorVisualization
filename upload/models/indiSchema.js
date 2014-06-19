var mongoose = require('mongoose');

//schema for individual
module.exports = mongoose.model('individual',{
machine:String,
date:String
});
