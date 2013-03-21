var path = require('path'),
    express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

function render(req, res) {
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
    render(req, res);
  }
});

app.get('/login', render);
app.get('/create_user', render);

module.exports = app;