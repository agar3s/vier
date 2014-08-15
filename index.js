var connect = require('connect'),
    serveStatic = require('serve-static');

var server = connect();
server.use(serveStatic('./app'));

server.listen(3000);

