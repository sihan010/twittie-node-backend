var http = require('http');
require('dotenv').config();
var app = require('./app');

var port = process.env.PORT || 3000;

var server = http.createServer(app);

server.listen(port,()=>{
    console.log(`server is listening to ${port}`);
})



