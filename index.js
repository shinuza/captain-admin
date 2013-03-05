var express = require('express'),
    core = require('captainjs-core'),
    app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(core.modules.settings.get('MEDIA_ROOT')));
app.use(express.cookieParser());
app.use(core.modules.middleware.authenticate());

app.get('/', function(req, res) {
  if(!req.originalUrl.match(/\/$/)) {
    return res.redirect(301, '');
  }

  if(!req.session) {
    res.redirect('login');
  } else {
    res.sendfile(__dirname + '/views/layout.html');
  }
});

app.get('/login', function(req, res) {
  res.sendfile(__dirname + '/views/login.html');
});

module.exports = app;