$(function() {

  // $('#uploadTemp').on('change', function(){
  //   var img = $(this).val();
  //   console.log(img);
  //   $('.cropper-canvas').find('img').attr('src', img);
  // })



  // Keyboard
  $(document.body).on('keydown', function (e) {

    if (!$image.data('cropper') || this.scrollTop > 300) {
      return;
    }

    switch (e.which) {
      case 37:
        e.preventDefault();
        $image.cropper('move', -1, 0);
        break;

      case 38:
        e.preventDefault();
        $image.cropper('move', 0, -1);
        break;

      case 39:
        e.preventDefault();
        $image.cropper('move', 1, 0);
        break;

      case 40:
        e.preventDefault();
        $image.cropper('move', 0, 1);
        break;
    }

  });
  // Import image
  var $image = $('#image');
   var $inputImage = $('#uploadTemp');
   var URL = window.URL || window.webkitURL;
   var blobURL;

   if (URL) {
     $inputImage.change(function () {
       var files = this.files;
       var file;

       if (!$image.data('cropper')) {
         return;
       }

       if (files && files.length) {
         file = files[0];

         if (/^image\/\w+$/.test(file.type)) {
           blobURL = URL.createObjectURL(file);
           $image.one('built.cropper', function () {

             // Revoke when load complete
             URL.revokeObjectURL(blobURL);
           }).cropper('reset').cropper('replace', blobURL);
           $inputImage.val('');
         } else {
           window.alert('Please choose an image file.');
         }
       }
     });
   } else {
     $inputImage.prop('disabled', true).parent().addClass('disabled');
   }



  $('#image').cropper({
    aspectRatio: 1 / 1,
    preview: '.img-preview',
    crop: function(e){
      console.log(e.width);
      console.log(e.height);
    }
  });


  $('#postTemp').on('click', function(){
    var $this = $(this);
    var data = $this.data();
    var result = $image.cropper('getCroppedCanvas', {'width': 300, 'height': 300});

    var avatar = result.toDataURL('image/jpeg');
    $('#avatarImg').val(avatar);
    console.log($.extend({}, data));
    console.log(data);
    console.log(result);
  })

});
