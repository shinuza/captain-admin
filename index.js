var express = require('express'),
    app = express();

app.on('mount', function() {
  var settings = require('captainjs-core').settings;

  app.use(express.static(__dirname + '/public'));
  app.use(express.static(settings.get('MEDIA_ROOT')));

  app.get('/', function(req, res){
    res.sendfile(__dirname + '/views/layout.html');
  });
});

if(require.main === module) {
  app.listen(9000, function() {
    console.log('Listening at http://localhost:9000');
  });
}

module.exports = app;