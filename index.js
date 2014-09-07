var connect = require('connect'),
    serveStatic = require('serve-static');

var server = connect();
server.use(serveStatic('./'));

server.listen(8080);

