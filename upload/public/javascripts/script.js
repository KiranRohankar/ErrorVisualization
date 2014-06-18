$(function() {
  
  var showInfo = function(message) {
    $('div.progress').hide();
    $('strong.message').text(message);
    $('div.alert').show();
  };
  
  $('input[type="submit"]').on('click', function(evt) {

   $('#visualize').removeAttr('disabled');
     $('#uploadFile').attr('disabled','true');
   
    evt.preventDefault();
    $('div.progress').show();
    var formData = new FormData();
    var file = document.getElementById('myFile').files[0];
  var reader = new FileReader();
        reader.onload = function(e) {
        var  contents = reader.result;
         var arr  = contents.split("\n");
         if(arr[0].indexOf("dv-docs") > -1)
         {
          console.log("its a dv docs file")
         }
         else if(arr[0].indexOf("individual") > -1)
         {
          console.log("its a individual file");
         }
         else
         {
          console.log("its apache file");
         }
        }

        reader.readAsText(file);    

    
       formData.append('myFile', file);
    
    
    var xhr = new XMLHttpRequest();
    
    xhr.open('post', '/apache', true);
    
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100;
        $('div.progress div.bar').css('width', percentage + '%');
      }
    };
    
    xhr.onerror = function(e) {
      showInfo('An error occurred while submitting the form. Maybe your file is too big');
    };
    
    xhr.onload = function() {

      showInfo(this.statusText);
    };
    
    xhr.send(formData);
   

  });
  
});