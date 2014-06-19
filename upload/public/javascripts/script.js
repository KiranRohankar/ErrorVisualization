
$(function() {
  
  var showInfo = function(message) {
    $('div.progress').hide();
    $('strong.message').text(message);
    $('div.alert').show();
  };
 
    $('#importFile').bind('click',function() {
        $('#uploadFile').attr('disabled',false);
    });


  $('input[type="submit"]').on('click', function(evt) {

   $('#visualize').removeAttr('disabled');
     $('#uploadFile').attr('disabled','true');
   
    evt.preventDefault();
    $('div.progress').show();
    var formData = new FormData();
    var file = document.getElementById('myFile').files[0];
    formData.append('myFile', file);
    var xhr = new XMLHttpRequest();

  var reader = new FileReader();
        reader.onload = function(e) {
        var  contents = reader.result;
         var arr  = contents.split("\n");
         if(arr[0].indexOf("dv-docs") > -1)
         {
          console.log("its a dv docs file");
          xhr.open('post', '/dvdocs', true);
          xhr.send(formData);
         }
         else if(arr[0].indexOf("individual") > -1)
         {
          console.log("its a individual file");
          xhr.open('post', '/individual', true);
          xhr.send(formData);

         }
         else
         {
          console.log("its apache file");
          xhr.open('post', '/apache', true);
          xhr.send(formData);
          }
        }

        reader.readAsText(file);    

    
       
    
    
    
    
    
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
    
   
   

  });
   
});


/*myElement.addEventListener('change',function(){
var myButton = document.getElementById('uploadFile');
  myButton.disabled=false;

},false);
*/