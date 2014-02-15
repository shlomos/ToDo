var http = require('http');

var cookie;
var getRes = function(res) {
	//Set Cookie:
	if(res.headers['set-cookie'] != undefined){
		cookie=res.headers['set-cookie'];
	}
	//Log Headers:
    console.log('STATUS: ' + res.statusCode+'\r\n');
    console.log('HEADERS: ' + JSON.stringify(res.headers)+'\r\n');
	//Log Body:
    res.setEncoding('binary');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
    res.on('end', function () {
        console.log('\r\n'+'connection ended.\n-----------------------------------------\n');
    });
}
console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log('Starting Standard usage test:');
console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
//1
console.log('~~~~~~~~~~~~~~~~~~~~~');
console.log('Register:');
console.log('~~~~~~~~~~~~~~~~~~~~~');
var data = '{"username":"a","password":"aaaaaa","fullname":"a"}';
var req = http.request({
    hostname: 'localhost',
    port: 9134,
    path: '/register',
    method: 'POST',
    headers: {
        'Connection':'keep-alive',
		'Content-Type': 'application/json;charset=UTF-8',
		'Content-Length': data.length
    }
}, getRes);

req.end(data);

//2
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Login:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	data = '{"username":"a","password":"aaaaaa"}';
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/login',
		method: 'POST',
		headers: {
			'Connection':'keep-alive',
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Length': data.length
		}
	}, getRes);

	req.end(data);
},1000);

//3
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Add first todo:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	data = '{"id":0,"value":"first thing."}';
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/item',
		method: 'POST',
		headers: {
			'Connection':'keep-alive',
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Length': data.length,
			'Cookie': cookie
		}
	}, getRes);

	req.end(data);
},2000);

//4
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Add second todo:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	data = '{"id":1,"value":"second thing."}';
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/item',
		method: 'POST',
		headers: {
			'Connection':'keep-alive',
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Length': data.length,
			'Cookie': cookie
		}
	}, getRes);

	req.end(data);
},3000);

//5
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Add third todo:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	data = '{"id":2,"value":"third thing."}';
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/item',
		method: 'POST',
		headers: {
			'Connection':'keep-alive',
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Length': data.length,
			'Cookie': cookie
		}
	}, getRes);

	req.end(data);
},4000);

//6
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Check so far:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/item',
		method: 'GET',
		headers: {
			'Connection':'keep-alive',
			'Cookie': cookie
		}
	}, getRes);

	req.end();
},5000);

//7
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('complete first todo:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	data = '{"id":0,"value":"first thing modified.","status":"1"}';
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/item',
		method: 'PUT',
		headers: {
			'Connection':'keep-alive',
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Length': data.length,
			'Cookie': cookie
		}
	}, getRes);

	req.end(data);
},6000);

//8
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Check so far:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/item',
		method: 'GET',
		headers: {
			'Connection':'keep-alive',
			'Cookie': cookie
		}
	}, getRes);

	req.end();
},7000);

//9
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('delte second todo:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	data = '{"id":1}';
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/item',
		method: 'DELETE',
		headers: {
			'Connection':'keep-alive',
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Length': data.length,
			'Cookie': cookie
		}
	}, getRes);

	req.end(data);
},8000);

//10
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Check so far:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/item',
		method: 'GET',
		headers: {
			'Connection':'keep-alive',
			'Cookie': cookie
		}
	}, getRes);

	req.end();
},9000);

//11
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Delete all todos:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	data = '{"id":-1}';
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/item',
		method: 'DELETE',
		headers: {
			'Connection':'keep-alive',
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Length': data.length,
			'Cookie': cookie
		}
	}, getRes);

	req.end(data);
},10000);

//12
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Check so far:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/item',
		method: 'GET',
		headers: {
			'Connection':'keep-alive',
			'Cookie': cookie
		}
	}, getRes);

	req.end();
},11000);

//13
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Logout:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/logout',
		method: 'GET',
		headers: {
			'Connection':'keep-alive',
			'Cookie': cookie
		}
	}, getRes);

	req.end();
},12000);

//Check bad requests:

//14
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Test wrong requests:');
	console.log('~~~~~~~~~~~~~~~~~~~~~\r\n');
	console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
	console.log('Try get todos after logout:');
	console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/item',
		method: 'GET',
		headers: {
			'Connection':'keep-alive',
			'Cookie': cookie
		}
	}, getRes);
	
	req.end();
},13000);

//15
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Register duplicate');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	data = '{"username":"a","password":"bbbbbb","fullname":"b"}';
	req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/register',
		method: 'POST',
		headers: {
			'Connection':'keep-alive',
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Length': data.length
		}
	}, getRes);

	req.end(data);
},14000);

//16
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Wrong data register:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	data = '{"username":"fool","password":"short","fullname":"b"}';
	req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/register',
		method: 'POST',
		headers: {
			'Connection':'keep-alive',
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Length': data.length
		}
	}, getRes);

	req.end(data);
},15000);

//17
setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Unknown login:');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	data = '{"username":"a","password":"wrongPass"}';
	req = http.request({
		hostname: 'localhost',
		port: 9134,
		path: '/login',
		method: 'POST',
		headers: {
			'Connection':'keep-alive',
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Length': data.length
		}
	}, getRes);

	req.end(data);
},16000);

setTimeout(function(){
	console.log('~~~~~~~~~~~~~~~~~~~~~');
	console.log('Finished all tests!');
	console.log('~~~~~~~~~~~~~~~~~~~~~');
},17000);

