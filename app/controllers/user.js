var User = require('../models/user');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;


//signup
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: '注册页面'
  });
}

exports.showSignin = function(req, res) {
  res.render('signin', {
    title: '登陆页面'
  });
}


exports.signup = function(req, res) {
  var _user = req.body.user;


  User.findOne({name: _user.name}, function(err, user) {
    if(err) {
      console.log(err);
    }

    if(user) {
      return res.redirect('/signin');
    } else {
      var user = new User(_user);
      user.save(function(err, user) {
        if(err) {
          console.log(err);
        }

        res.redirect('/');
      });
    }
  });

}

// signin
exports.signin =  function(req, res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  User.findOne({name: name}, function(err, user) {
    if(err) {
      console.log(err);
    }

    if(!user) {
      return res.redirect('/signup');
    }

    user.comparePassword(password, function(err, isMatch) {
      if(err) {
        console.log(err);
      }

      if(isMatch) {
        req.session.user = user;

        return res.redirect('/');
      } else {
        return res.redirect('/signin');
      }
    });
  });
}

// logout
exports.logout =  function(req, res){
  delete req.session.user;
  // delete app.locals.user;
  res.redirect('/')
}


// user list page
exports.list = function(req, res) {
  User.fetch(function(err, users) {
    if(err) {
      console.log(err);
    }

    res.render('userlist', {
      title: 'imooc 用户列表',
      users: users
    });
  });
}
// user changePwd
exports.changePwd = function(req, res) {
  var _name = req.session.user.name;
  var _password = req.body.password;
  var _newPwd = req.body.newPwd;

  User.findOne({name: _name}, function(err, user) {
    user.comparePassword(_password, function(err, isMatch) {
    if(!isMatch) {
        res.json({success: 0});
      }

     if(isMatch) {
       bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
         if(err) {
           console.log(err);
         }

         bcrypt.hash(_newPwd, salt, function(err, hash) {
           if(err) {
             console.log(err);
           }

           user.password = hash;
           user.update({$set: {'password': user.password}, $set: {'meta.updateAt': Date.now()}}, function(err, user) {
             if (err) {
               console.log(err);
             }

             delete req.session.user;
             res.json({success: 1});
           });

         });
       });

     }
   });
 });
}

// user postAvatar
exports.postAvatar = function(req, res) {
  var imgData = req.body.avatarImg;
  var _user = req.session.user;


  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64Data, 'base64');
  var avatar = _user._id + '.jpg';
  var newPath = path.join(__dirname, '../../', '/public/upload/user/' + avatar);

  fs.writeFile(newPath, dataBuffer, function(err) {
    if (err) {
      console.log(err);
    }
    req.avatar = path.join('/upload/user/' + avatar);
    console.log(req.avatar);
    User.findOne({name: _user.name}, function(err, user) {
      console.log(user);
      user.avatar = req.avatar;
      user.update({$set: {'avatar': user.avatar}}, function(err){
        if(err) {
          console.log(err);
        }

        res.redirect('/user/update/' + _user._id);
      });
    });
  });

}

// user update
exports.update = function(req, res) {
  var user = req.session.user;
  res.render('user', {
    title: 'imooc 个人中心',
    user: user
  });
}

// midware for user
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;

  if(!user) {
    return res.redirect('/signin');
  }
  next();
}
exports.adminRequired = function(req, res, next) {
  var user = req.session.user;

  if(user.role <= 10) {
    return res.redirect('/signin');
  }
  next();
}
