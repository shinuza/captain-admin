var path = require('path'),
    express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

//TODO: Temporary
function autorender(req, res) {
  var view = path.basename(req.url) || 'layout';
  res.sendfile(__dirname + '/views/' + view + '.html');
}

app.get('/', function(req, res) {
  if(!req.originalUrl.match(/\/$/)) {
    return res.redirect(301, '');
  }

  if(!req.session) {
    res.redirect('login');
  } else {
    autorender(req, res);
  }
});

app.get('/login', autorender);
app.get('/setup', autorender);

module.exports = app;