var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

/*
database connectivity starts with mongo with monk plugin

*/
var mongo = require('mongodb');
//var monk = require('monk');
//var db = monk('localhost:27017/vivo');
var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {

});
var dvSchema = require('./models/dvSchema');
var indiSchema = require('./models/indiSchema');
var apacheSchema = require('./models/apacheSchema');

var ddlg = new dvSchema({
  machine: "kiransgarage.com",
  date: "10/June/14"
});


//create database connection
mongoose.connect('mongodb://localhost:27017/vivo');


/*
databse connectivity ends
*/

app.engine('html', require('ejs').renderFile);
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({ 
    keepExtensions: true, 
    uploadDir: __dirname + '/tmp',
    limit: '20mb'
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



// Routes

app.get('/', function(req, res) {
  res.render('index.html');
});
app.get('/create',function(req,res){
ddlg.save(function(err, thor) {
  if (err) return console.error(err);
  
});
res.send("ok");


});
/*
For readig dvdocs file
*/
app.post('/dvdocs', function(req, res) {
	//console.log(req.files.myFile.path);
 	readDvdocsFile(req.files.myFile.path);
  deleteAfterUpload(req.files.myFile.path);
  res.end();
});

/*
for reading apache file
*/
app.post('/apache',function(req,res){

var filePath=req.files.myFile.path;
  
readApacheFile(filePath);

deleteAfterUpload(filePath);
res.end();

});

/*
for reading individual file
*/
app.post('/individual',function(req,res){
var filePath=req.files.myFile.path;
  
readIndividualFile(filePath);

deleteAfterUpload(filePath);
res.end();


});


app.get('/getUnique',function(req,res){

  apacheSchema.collection.distinct("ip",function(error,result){

    if(error)
    {
        console.log(error);

    }
    else
    {
      for (var i = 0; i < result.length; i++) {
      var myip=result[i]; 
      console.log(myip);
     apacheSchema.collection.count({ ip: myip }, function (err, count) {
  if (err){
    console.log(err);
  }
  console.log(result[i]+"  "+ count);
  
});

  
      }
      
     
      
    }

  });

  res.end();

});


// Start the app

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Private functions

var fs = require('fs');



/*
Function for reading dvdocs file
*/
var readDvdocsFile = function(path)
{
	var content;
// First I want to read the file
fs.readFile(path, function read(err, data) {
    if (err) {
        throw err;
    }
    content = data;
    var stringdata= data.toString();
    var arr = stringdata.split('\n');

    var x = new Array(arr.length-1);
            
    for(var i=0;i<arr.length-1;i++)
          {
            var myString = arr[i];
            var myRegexp1 = /([\w+-?]*)/g;
            var match1 = myRegexp1.exec(myString);
            var myRegexp2 = /\[(\d{2}\/\w+\/\d{4})/g;
            var match2 = myRegexp2.exec(myString);
          
            if(!(match1[1]===null) || !(match2[1]===null))
            {
             // var temp= {};
             // temp['machine']=match1[1];
              //temp['date']=match2[1];

              var ddlg = new dvSchema({
                machine: match1[1],
                date: match2[1]
                });

              ddlg.save(function(err, thor) {
            if (err) return console.error(err);
              });
              
             }
          }
          //var myJsonString = JSON.stringify(x);
         //console.log(myJsonString);
         //var jsonData= JSON.parse(myJsonString);
         //Insert into databse
        /*  var mycollection = db.get('dvdocs');
          var promise = mycollection.insert(jsonData);
          promise.type; // 'insert' in this case
          promise.error(function(err){});
          promise.on('error', function(err){

            throw err;
          });
      */
    // Invoke the next step here however you like
   // console.log(content);   // Put all of the code here (not the best solution)
              // Or put the next step in a function and invoke it
});

}/*End of dvdocs file read*/








//Read apache error log file
var readApacheFile = function(path)
{

  var content;
// First I want to read the file
fs.readFile(path, function read(err, data) {
    if (err) {
        throw err;
    }
    content = data;
    var stringdata= data.toString();
    var arr = stringdata.split('\n');
    
    var x = new Array(arr.length-1);
              
    for(var i=0;i<arr.length-1;i++)
          {
            var myString = arr[i];
            var date = /\[\s*\w{3}\s*(\w+)\s*(\d{2})\s*\d{2}:\d{2}:\d{2}\s*(\d{4})/g;
            var match1 = date.exec(myString);
            var ip = /\[\s*client\s*(\d*\.\d*\.\d*\.\d*)]/g;
             var match2 = ip.exec(myString);
            
            var message = /\[\s*client\s*\d*\.\d*\.\d*\.\d*](.*)/g;
            var match3 = message.exec(myString);

            if(match1===null || match2===null ||match3===null)
            {
              continue;
            }
              
          
            if(!(match1[1]===null) || !(match2[1]===null))
            {
         /*     var temp= {};
              temp['date']=match1[1]+"/"+match1[2]+"/"+match1[3];
              temp['ip']=match2[1];
              temp['message']=match3[1];
            //  x[i]=temp;
         
             var myJsonString = JSON.stringify(temp);
            var jsonData= JSON.parse(myJsonString);
            

          var promise = mycollection.insert(jsonData);
          promise.type; // 'insert' in this case
          promise.error(function(err){});
          promise.on('error', function(err){

            throw err;
          });
        */
        var ddlg = new apacheSchema({
                date: match1[1],
                ip: match2[1],
                message: match3[1]
                });

              ddlg.save(function(err, thor) {
            if (err) return console.error(err);
              });

          
             }
          }
        
});



}/*End of apache file read*/



/*
Function for reading individual file
*/
var readIndividualFile = function(path)
{
  var content;
// First I want to read the file
fs.readFile(path, function read(err, data) {
    if (err) {
        throw err;
    }

    content = data;
    var stringdata= data.toString();
    var arr = stringdata.split('\n');

    var x = new Array(arr.length-1);
            
    for(var i=0;i<arr.length-1;i++)
          {
            var myString = arr[i];
            var myRegexp1 = /([\w+-?]*)/g;
            var match1 = myRegexp1.exec(myString);
            var myRegexp2 = /\[(\d{2}\/\w+\/\d{4})/g;
            var match2 = myRegexp2.exec(myString);
          
            if(!(match1[1]===null) || !(match2[1]===null))
            {
              

              var ddlg = new indiSchema({
                machine: match1[1],
                date: match2[1]
                });

              ddlg.save(function(err, thor) {
            if (err) return console.error(err);
              });
             }
          }
       /*   var myJsonString = JSON.stringify(x);
         console.log(myJsonString);
         var jsonData= JSON.parse(myJsonString);
         //Insert into databse
       var mycollection = db.get('individual');
          var promise = mycollection.insert(jsonData);
          promise.type; // 'insert' in this case
          promise.error(function(err){});
          promise.on('error', function(err){

            throw err;
          });
      */
    // Invoke the next step here however you like
   // console.log(content);   // Put all of the code here (not the best solution)
              // Or put the next step in a function and invoke it
});

}


/*
End of individual file read
*/


var deleteAfterUpload = function(path) {
  setTimeout( function(){
    fs.unlink(path, function(err) {
      if (err) console.log(err);
      console.log('file successfully deleted');
    });
  }, 60 * 1000);

};