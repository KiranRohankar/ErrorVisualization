var mongoose = require('mongoose');

//schema for apache
module.exports = mongoose.model('apache',{

date:String,
ip:String,
message:String
});
