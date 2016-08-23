var fs = require('fs');
var express = require('express');
var https = require('https');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var serveStatuc = require('serve-static');

var port = process.env.PORT || 3000;
var dbUrl = 'mongodb://localhost:27017/imooc';
var key = fs.readFileSync('./privatekey.pem');
var cert = fs.readFileSync('./certificate.pem');
var https_options = {
  key: key,
  cert: cert
}
var app = express();

mongoose.connect(dbUrl);

// models loading
var models_path = __dirname + '/app/models';
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);

      if(stat.isFile()) {
        if(/(.*)\.(js|coffee)/.test(file)) {
          require(newPath);
        }
      } else if (stat.isDirectory()) {
        walk(newPath);
      }
    });
}
walk(models_path);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  resave: false, // fix the 'express-session' warring
  saveUninitialized: true, // fix the 'express-session' warring
  secret: 'imooc',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

var env = process.env.NODE_ENV || 'development';

if('development' === env) {
  app.set('showStackError', true);
  app.use(logger(':method :url :status'));
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

require('./config/routes')(app)

app.use(serveStatuc(path.join(__dirname, 'public')));
app.locals.moment = require('moment');

https.createServer(https_options, app).listen(3011, function(err) {
  if(err) {
    console.log(err);
  }
  console.log('HTTPS started on port ' + 3011);
});
app.listen(3000);

console.log('server started on port ' + port);
