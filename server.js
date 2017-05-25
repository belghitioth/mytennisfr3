var express = require('express')
  , path = require('path')
  , http = require('http');

var app = express();


  app.set('port', process.env.PORT || 3000);
  app.use(express.static(path.join(__dirname, './app')));


app.get('*', function(req, res) {
  res.sendfile('./app/index.html')
})

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
