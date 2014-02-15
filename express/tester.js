var miniExpress = require('./miniExpress.js');
var http = require('http');
var miniHttp = require('./http/miniHttp');
var net=require('net');

var port = 9134;
var app = miniExpress();
var con;
var server;

console.log('mounting '+'/'+' at '+__dirname+'\\www');
app.get('/static/', miniExpress.static(__dirname+'\\www'));
server = miniHttp.createServer(app);
server.listen(9134,function(){
	console.log('Server listening on port '+port+'.\nCtrl+C to force termination.');
});

var getRes = function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('binary');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk.length);
    });
    res.on('end', function () {
        console.log('connection ended.\n-----------------------------------------\n');
    });
}


var req = http.request({
    hostname: 'localhost',
    port: 9134,
    path: '/static/index.html',
    method: 'GET',
    headers: {
        'Connection':'keep-alive'
    }
}, getRes);

req.end();

setTimeout(function(){
    req = http.request({
        hostname: 'localhost',
        port: 9134,
        path: '/static/',
        method: 'GET',
        headers: {
            'Connection':'keep-alive'
        }
    }, getRes);

    req.end();
},1000);

setTimeout(function(){
    req = http.request({
        hostname: 'localhost',
        port: 9134,
        path: '/static/notPresent.html',
        method: 'GET',
        headers: {
            'Connection':'keep-alive'
        }
    }, getRes);

    req.end();
},2000);

setTimeout(function(){
    req = http.request({
        hostname: 'localhost',
        port: 9134,
        path: '/static/index.html',
        method: 'POST',
        headers: {
            'Connection':'keep-alive',
			'Content-Length': 0
        }
    }, getRes);

    req.end();
},3000);

setTimeout(function(){
    req = http.request({
        hostname: 'localhost',
        port: 9134,
        path: '/static/index.html',
        method: 'UNREAL',
        headers: {
            'Connection':'keep-alive',
			'Content-Length': 0
        }
    }, getRes);

    req.end();
},4000);

setTimeout(function(){
    req = http.request({
        hostname: 'localhost',
        port: 9134,
        path: '/static/../../tester.js',
        method: 'GET',
        headers: {
            'Connection':'keep-alive'
        }
    }, getRes);

    req.end();
},5000);

setTimeout(function(){
    req = http.request({
        hostname: 'localhost',
        port: 9134,
        path: '/static/index.js',
        method: 'GET',
        headers: {
            'Connection':'keep-alive'
        }
    }, getRes);

    req.end();
},6000);

setTimeout(function(){
    req = http.request({
        hostname: 'localhost',
        port: 9134,
        path: '/static/style.css',
        method: 'GET',
        headers: {
            'Connection':'keep-alive'
        }
    }, getRes);

    req.end();
},7000);

setTimeout(function(){
    req = http.request({
        hostname: 'localhost',
        port: 9134,
        path: '/static/photo.jpg',
        method: 'GET',
        headers: {
            'Connection':'keep-alive'
        }
    }, getRes);

    req.end();
},8000);

setTimeout(function(){
    req = http.request({
        hostname: 'localhost',
        port: 9134,
        path: '/static/profile.html',
        method: 'GET',
        headers: {
            'Connection':'close'
        }
    }, getRes);

    req.end();
},9000); 

setTimeout(function(){
	con = net.createConnection(9134,"127.0.0.1");
	con.on('data',function(data){
		console.log(data.toString()+"\nconnection ended.\n-----------------------------------------\n"); //should be 2087 bytes.
	});
    con.write("GET /static/ HTTP/2.1\r\nHost: localhost:9134\r\nAgent: Node\r\nContent-Length: 0\r\n\r\n");
},10000);

setTimeout(function(){
	con = net.createConnection(9134,"127.0.0.1");
	con.on('data',function(data){
		console.log(data.toString()+"\nconnection ended.\n-----------------------------------------\n");
	});
    con.write("GET /static/ HTTP/1.1\r\nHost: localhost:9134\r\nAgent: Node\r\nConnection: keep-alive\r\n\r\n"+
		"GET /static/index.js HTTP/1.1\r\nHost: localhost:9134\r\nAgent: Node\r\nConnection: close\r\n\r\n");
},13000);

setTimeout(function(){
	con = net.createConnection(9134,"127.0.0.1");
	con.on('data',function(data){
		console.log("BODY:"+data.toString().length+"\nconnection ended.\n-----------------------------------------\n");
	});
    con.write("GET /static/ HTTP/1.1\r\nHost: localhost:9134\r\nAgent: Node\r\nConnection: keep-alive\r\nContent-Length: 3\r\n\r\n");
    setTimeout(function(){
        con.write("abc");
    },1000);
},14000);


setTimeout(function () {
	console.log("Finished static test.");
    server.close();
	server = null;
	app = null;
},18000);

setTimeout(function () {
	app = miniExpress();
	console.log('\nMounting '+'/'+' at '+__dirname+'\\www\n');
	app.post('/',miniExpress.bodyParser());
	app.post('/',miniExpress.cookieParser());
	app.post('/public/:name/data/',function(req,res,next){
		console.log('Params:');
		console.log(req.params);
		console.log('Body:');
		console.log(req.body);
		console.log('Cookies:');
		console.log(req.cookies);
		res.send(200,'dynamic test 1 complete.');
	});
	app.get('/public/', function(req,res,next){
		console.log('Query:');
		console.log(req.query);
		res.cookie('main','1',{maxAge: 90000,domain: 'localhost',secure: true,httpOnly: true});
		res.cookie('secondary','2',{maxAge: 90000,domain: 'localhost',secure: true,httpOnly: true});
		res.send(200,'dynamic test 2 complete.');
	});
	server = miniHttp.createServer(app);
	server.listen(9134,function(){
		console.log('Server listening on port '+port+'.\nCtrl+C to force termination.');
	}); 
},19000);

setTimeout(function () {
	console.log('Testing routes:');
	console.log(app.routes);
	console.log('\n-----------------------------------------\n');
},20000);

setTimeout(function(){
	req = http.request({
        hostname: 'localhost',
        port: 9134,
        path: '/public/sshenz62/data/',
        method: 'POST',
        headers: {
            'Connection':'close',
			'Cookie':'main=1;secondary=2',
			'Content-Length':'18',
			'Content-Type':'application/x-www-form-urlencoded'
        }
    }, getRes);

    req.end("product=toothbrush");
},21000);

setTimeout(function () {
	req = http.request({
        hostname: 'localhost',
        port: 9134,
        path: '/public/?p=house+horse',
        method: 'GET',
        headers: {
            'Connection':'close',
			'Cookie':'main=1;secondary=2'
        }
    }, getRes);

    req.end();
},22000);

setTimeout(function () {
	console.log("Finished all tests!");
    server.close();
},23000);







