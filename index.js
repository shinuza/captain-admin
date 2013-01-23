var express = require('express'),
    core = require('captainjs-core'),
    app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(core.settings.get('MEDIA_ROOT')));
app.use(express.cookieParser());
app.use(core.middleware.authenticate());

app.on('mount', function(parent) {
  app.get('/', function(req, res) {
    if(!req.session) {
      res.redirect(req.originalUrl + 'login');
    } else {
      res.sendfile(__dirname + '/views/layout.html');
    }
  });

  app.get('/login', function(req, res) {
    res.sendfile(__dirname + '/views/login.html');
  });
});

module.exports = app;