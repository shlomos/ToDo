var express=require('./miniExpress');
var net = require('net');
var app = express();
var http = require('./http/miniHttp');
var clientHttp=require('http');

var numOfTests = 12;

if (process.argv[2]==undefined){
	console.log('please add test num from the following:')
	console.log('1 - test req and res functionality.');
	console.log('2 - test get.');
	console.log('3 - test post.');
	console.log('4 - test put.');
	console.log('5 - test delete.');
	console.log('6 - test prefix.');
	console.log('7 - test order.');
	console.log('8 - test 2 ports.');
	console.log('9 - test different use.');
	console.log('10 - test cookies Parser.');
	console.log('11 - test json Parser.');
	console.log('12 - test urlencoded Parser.');
}

if (process.argv[2]>numOfTests){
	console.log('no such test exist');
}

if (process.argv[2]==0){
	
}

if (process.argv[2]==1){
	testFunctionality();
}

if (process.argv[2]==2){
	testGet();
}

if (process.argv[2]==3){
	testPost();
}

if (process.argv[2]==4){
	testPut();
}
if (process.argv[2]==5){
	testDelete();
}

if (process.argv[2]==6){
	testPrefix();
}
if (process.argv[2]==7){
	testOrder();
}

if (process.argv[2]==8){
	test2ports();
}

if (process.argv[2]==9){
	testDifferentUse();
}

if (process.argv[2]==10){
	testCookies();
}

if (process.argv[2]==11){
	testJson2();
}
if (process.argv[2]==12){
	testUrlencoded2();
}

function testUrlencoded2(){
	console.log("=======================\ntesting urlencoded\n=======================");
	console.log('should print {"name1":"value1","name2":"value2"}');
	console.log('================================================');
	body = 'name1=value1&name2=value2';
	app.use(express.bodyParser());
	app.post('/test', function(req,res){res.json(req.body);});
	//var server = http.createServer(app);
	app.listen(8000, function () {
        console.log("listening");
    });
	var options = 	{
					port:8000,
					path:'/test',
					method:'POST',
					headers:{
						'Content-type':'application/x-www-form-urlencoded',
						'Content-Length':body.length
						},
					};
	
	var req=clientHttp.request(options,	function (res) {
		res.setEncoding('utf8');
		console.log('got result');
		res.on('data', function (chunk) {
			console.log(chunk);
		});
	});
	req.write(body);
	req.end();
}

function testJson2(){
	console.log("=======================\ntesting json parser\n=======================");
	console.log('should print {"name1":"value1","name2":"value2"}');
	console.log('================================================');
	var body = '{\n"name1":"value1",\n"name2":"value2"\n}';
	app.use(express.bodyParser());
	app.post('/test/body', function(req,res){res.json(req.body);});
	//var server = http.createServer(app);
	app.listen(8000, function () {
        console.log("listening");
    });
	var options = 	{
					port:8000,
					path:'/test/body',
					method:'POST',
					headers:{
						'Content-type':'application/json',
						'Content-Length':body.length
						},
					};
	
	var req=clientHttp.request(options,	function (res) {
		res.setEncoding('utf8');
		console.log('got result');
		res.on('data', function (chunk) {
			console.log(chunk);
		});
	});
	req.write(body);
	req.end();
}

function testCookies(){
	console.log("=======================\ntesting cookies\n=======================");
	console.log('should print {"name1":"value1","name2":"value2"}');
	console.log('================================================');
	app.use(express.cookieParser());
	app.post('/test/cookies', function(req,res){res.json(req.cookies);});
	//var server = http.createServer(app);
	app.listen(8000, function () {
        console.log("listening");
    });
	var options = 	{
					port:8000,
					path:'/test/cookies',
					method:'POST',
					headers:{
							Cookie: 'name1=value1; name2=value2',
							'Content-Length':0
							}
					};
	
	var req=clientHttp.request(options,	function (res) {
		res.setEncoding('utf8');
		console.log('got result');
		res.on('data', function (chunk) {
			console.log(chunk);
		});
	});
	req.end("");
}



function test2ports(){
	console.log("=======================\ntesting two ports\n=======================");
	console.log('should print "test get" twice');
	console.log('==============================================');
	app.get('/test/get', function(req,res,next){
		console.log('test get');
		res.send('something');
		next();
	});
	
	http.createServer(app).listen(8000);
	app.listen(9000);
	
	var req1=clientHttp.request({
				port:8000,
				path:'/test/get',
				method:'GET'},
					function (res) {
					console.log('got result');
	});
	req1.end();
	
	var req2=clientHttp.request({
				port:9000,
				path:'/test/get',
				method:'GET'},
					function (res) {
					console.log('got result');
	});
	req2.end();

	
	
}

function testFunctionality(){
	
	var text = "some text";

	console.log("=======================\ntesting functionality\n=======================");
	app.use('/a/:param/b',function(req,res,next) {
		console.log('testing req.protocol. the result should be: http');
		console.log(req.protocol + '\n');
		
		console.log('testing req.host. the result should be: localhost');
		console.log(req.host + '\n');
		
		console.log('testing req.params. the result should be: param1');
		console.log(req.params);
		console.log('\n');
		
		console.log('testing req.path. the result should be: /a/param1/b/path');
		console.log(req.path + '\n');
		
		console.log('testing req.query. the result should be: query1 , query2');
		console.log(req.query.q1 + ' , ' + req.query.q2 + '\n');
		
		console.log('testing res.set and req.get. the result should be: setset');
		res.set('abcd','setset');
		console.log(res.get('ABCD') + '\n');
		
		console.log('testing res.statusCode. the result should be: 654');
		res.status(654);
		console.log(res.statusCode + '\n');
		
		console.log('testing req.is. the result should be: true');
		console.log(req.is('text/*'));		
		
		res.send('something');
		
	});
		
	//var server = http.createServer(app);
	app.listen(8000, function () {
        console.log("listening");
    });
	
	var options = {
				port:8000,
				path:'/a/param1/b/path?q1=query1&q2=query2',
				Host: 'localhost',
				version: '1.1',
				headers:{
						'Content-type':'text/html',
						'Content-Length':text.length
						},
				method:'POST'
				};
	
	//check one params + path + query:
	var req=clientHttp.request(options, function (res) { 
		res.setEncoding('utf8');
		console.log('got result');
        //server.close();	
	
	});
	req.write(text);
	req.end();

	
}

function testGet(){
	console.log("=======================\ntesting get\n=======================");
	app.get('/test/get', function(req,res,next){
		console.log('test get succeded');
		res.send('something');
	});
	
	//var server = http.createServer(app);
	app.listen(8000, function () {
        console.log("listening");
    });
	
	var options = 	{
					port:8000,
					path:'/test/get',
					method:'GET',
					headers:{'Content-Length':0}
					};
	
	var req=clientHttp.request(options,	function (res) {
		console.log('got result');
		//server.close();	
	});
	req.end("");
}

function testPost(){
	console.log("=======================\ntesting post\n=======================");
	app.post('/test/post', function(req,res,next){
		console.log('test post succeded');
		res.send('something');
	});
	
	//var server = http.createServer(app);
	app.listen(8000, function () {
        console.log("listening");
    });
	
	var options = 	{
					port:8000,
					path:'/test/post',
					method:'POST',
					headers:{'Content-Length':0}
					};
	
	var req=clientHttp.request(options, function (res) {
		console.log('got result');
		//server.close();	
	});
	req.write("");
	req.end();
}


function testPut(){
	console.log("=======================\ntesting put\n=======================");
	app.put('/test/put', function(req,res,next){
		console.log('test put succeded');
		res.send('something');
	});
	
	//var server=http.createServer(app);
	app.listen(8000, function () {
        console.log("listening!");
    });
	
	var options = 	{
					port:8000,
					path:'/test/put',
					method:'PUT',
					headers:{'Content-Length':0}
					};
	
	var req=clientHttp.request(options,	function (res) {
		console.log('got result');
		//server.close();	
	});
	req.write("");
	req.end();
}

function testDelete(){
	console.log("=======================\ntesting delete\n=======================");
	app.delete('/test/delete', function(req,res,next){
		console.log('test delete succeded');
		res.send('something');
	});
	
	//var server=http.createServer(app);
	app.listen(8000, function () {
        console.log("listening!");
    });
	
	var options = 	{
					port:8000,
					path:'/test/delete',
					method:'DELETE',
					headers:{'Content-Length':0}
					};
	
	var req=clientHttp.request(options, function (res) {
		console.log('got result');
		//server.close();	
	});
	req.write("");
	req.end();
}

function testPrefix(){

	console.log("=======================\ntesting prefix\n=======================");
	app.get('/test/get', function(req,res,next){
		console.log('test prefix succeded');
		res.send('something');
	});
	
	var server = http.createServer(app);
	server.listen(8000, function () {
        console.log("listening!");
    });
	
	var options = 	{
					port:8000,
					path:'/test/get/sssssdd',
					method:'GET'
					};
	
	var req=clientHttp.request(options, function (res) {
		console.log('got result');
		//server.close();	
	});
	req.write("");
	req.end();
}

function testOrder(){

	console.log("=======================\ntesting order\n=======================");
	app.get('/test/order', function(req,res,next){
		console.log('get1');
		res.send('something');
		next();
	});
	app.use('/test/order', function(req,res,next){
		console.log('use2');
		res.send('something');
		next();
	});
	app.get('/test/order', function(req,res,next){
		console.log('get3');
		res.send('something');
		next();
	});
	app.use('/test/order', function(req,res,next){
		console.log('use4');
		res.send('something');
	});
	
	//var server=http.createServer(app);
	app.listen(8000, function () {
        console.log("listening!");
    });
	
	var options = 	{
					port:8000,
					path:'/test/order',
					method:'GET'
					};
	
	var req=clientHttp.request(options,	function (res) {
		console.log('got result');
		//server.close();	
	});
	console.log('should print get1, use2, get3, use4');
	req.end();
}

function testDifferentUse(){
	console.log("=======================\ntesting different use\n=======================");
	console.log("should get nothing");
	app.get('/test/post', function(req,res,next){
		console.log('got get on post. very bad');
		res.send('something');
	});
	
	//var server = http.createServer(app);
	app.listen(8000, function () {
        console.log("listening");
    });
	
	var options = 	{
					port:8000,
					path:'/test/post',
					method:'POST',
					headers:{'Content-Length':0}
					};
	
	var req=clientHttp.request(options, function (res) {
		console.log('got result');
		//server.close();	
	});
	req.write("");
	req.end();
}
