var miniExpress = require("./miniExpress");
var miniHttp = require("./http/miniHttp");
var http = require('http');
var server,app;
var port = 9134;
console.log("Creating server");

app = miniExpress();
app.use('/', miniExpress.static(__dirname+'\\www'));
server = miniHttp.createServer(app);
server.listen(9134,function(){
	console.log('Server listening on port '+port+'.\nCtrl+C to force termination.');
});

var numberOfClients = 500;

setTimeout(function () {
    server.close();
    console.log("Server closed.");
	console.log("responses count: "+s+"/"+numberOfClients+"!");
	console.log("errors count: "+e+"!");
}, 8000);

var s = 0;
var e = 0;
for (var i = 0; i < numberOfClients; i++) 
{
	http.get({ hostname : '127.0.0.1', port:9134, path : '/',agent : false,headers: {
    "Connection":"keep-alive",
    "User-Agent":"Node"}}, function(res) {
		console.log("Got response: " + res.statusCode);
		s++;
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		e++;
	});
}