var express = require('express'), app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/views/layout.html');
});

app.listen(9000);