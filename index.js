var connect = require('connect'),
    serveStatic = require('serve-static');

var server = connect();
server.use(serveStatic('./dist'));

server.listen(8080);

