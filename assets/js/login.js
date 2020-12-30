$(function () {

  $('#link_reg').on('click', function () {

    $('.login-box').hide();
    $('.reg-box').show();
  })

  $('#link_login').on('click', function () {

    $('.login-box').show();
    $('.reg-box').hide();
  })

  var form = layui.form
  var layer = layui.layer
  form.verify({

    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {

      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {

        return '两次密码不一致!';
      }

    }
  })

  $('#form_reg').on('submit', function (e) {
    e.preventDefault();

    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    
    $.post('http://ajax.frontend.itheima.net//api/reguser', data, function (res) {

      if (res.status !== 0) {

        // return console.log(res.message);
        return layer.msg(res.message)
      }
      // console.log('注册成功!');
      layer.msg('注册成功,请登录!')
      $('#link_login').click()
    })

  })

})
