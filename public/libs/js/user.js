$(function() {
  $('#navTab').on('click', function(e) {
    e.preventDefault();
    $(this).tab('show');
  });


  $('#changePwd').on('click', function(){
    var password = $('#inputOldpwd').val();
    var newPwd = $('#inputNewpwd').val();
    var rePwd = $('#inputRepwd').val();

    if(password === '' && $('#inputOldpwd').parent().find('.err').text() === '') {
      $('#inputOldpwd').after('<p class="err text-danger">清填写密码</p>')
    }
    if(newPwd === '' && $('#inputNewpwd').parent().find('.err').text() === '') {
      $('#inputNewpwd').after('<p class="err text-danger">清填写新密码</p>')
    }
    if(rePwd === '' && $('#inputRepwd').parent().find('.err').text() === '') {
      $('#inputRepwd').after('<p class="err text-danger">清重新填写新密码</p>')
    }
    if(newPwd !== rePwd && rePwd !== '') {
      $('#inputRepwd').after('<p class="err text-danger">密码不一致</p>')
    }
    if(password !== '' && newPwd !== '' && rePwd !== '' && newPwd === rePwd) {
      $.ajax({
        type: 'post',
        url: '/user/changePwd/',
        data: {'password': password, 'newPwd': newPwd}
      }).done(function(results) {
        $('#password').find('.err').remove();
        if(results.success === 0) {
          $('#inputOldpwd').after('<p class="err text-danger">密码错误</p>')
        } else if (results.success === 1) {
          $('#changePwd').after('&nbsp;&nbsp;<span>密码修改成功！清重新<a href="/signin">登陆</a></span>');
          $('#password').find('input[type="text"]').val('');
        }
      });
    }
  });

  $('#password').find('input[type="text"]').on('focus', function() {
    $(this).parent().find('.err').remove();
  });
});
