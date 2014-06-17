var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

//database connectivity
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/vivo');


//databse connectivity ends

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
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
  res.render('index');
});

app.post('/', function(req, res) {
	//console.log(req.files.myFile.path);
 	readFile(req.files.myFile.path);
  deleteAfterUpload(req.files.myFile.path);
  res.end();
});

//for reading apache file
app.post('/apache',function(req,res){

 console.log( req.files.myFile.path); 
readApacheFile(req.files.myFile.path);
deleteAfterUpload(req.file.myFile.path);
res.end();

});

// Start the app

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Private functions

var fs = require('fs');

var readFile = function(path)
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
              var temp= {};
              temp['machine']=match1[1];
              temp['date']=match2[1];
              x[i]=temp;
              
             }
          }
          var myJsonString = JSON.stringify(x);
         console.log(myJsonString);
         var jsonData= JSON.parse(myJsonString);
         //Insert into databse
          var mycollection = db.get('usercollection');
          var promise = mycollection.insert(jsonData);
          promise.type; // 'insert' in this case
          promise.error(function(err){});
          promise.on('error', function(err){

            throw err;
          });

    // Invoke the next step here however you like
   // console.log(content);   // Put all of the code here (not the best solution)
              // Or put the next step in a function and invoke it
});

}

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
       var mycollection = db.get('apache');       
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
              var temp= {};
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
          
             }
          }
        
});



}/*End of apache file read*/


var deleteAfterUpload = function(path) {
  setTimeout( function(){
    fs.unlink(path, function(err) {
      if (err) console.log(err);
      console.log('file successfully deleted');
    });
  }, 60 * 1000);
};