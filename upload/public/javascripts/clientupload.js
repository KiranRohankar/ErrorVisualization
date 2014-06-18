
  function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0]; 

    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
        var contents = e.target.result;
        
        $('#visualize').click(function(){
          var arr  = contents.split("\n");
          var element=document.getElementById('write');
        //  for(var j =0;j<178;j++)
          {
          for(var i=0;i<10;i++)
          {
          	var myString = arr[i];
            var myRegexp1 = /\[\s*client\s*\d*\.\d*\.\d*\.\d*](.*)/g;
            var match1 = myRegexp1.exec(myString);
            if(match1===null)
            {
            	continue;
            }
            
         //   var myRegexp2 = /\[(\d{2}\/\w+\/\d{4})/g;
          //  var match2 = myRegexp2.exec(myString);


            element.innerHTML= element.innerHTML+"<br/>"+match1[1]; 
          }
          }
          $('.starter-template').toggle();
        });
  
      }
      r.readAsText(f);
    } else { 
      alert("Failed to load file");
    }
  }

//  document.getElementById('fileinput').addEventListener('change', readSingleFile, false);