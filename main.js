var express = require('./miniExpress.js');
var http = require('./http/miniHttp.js');
var pathLib = require('path');
var users = require('./users.js');
var uuid = require('node-uuid');
var port = process.env.PORT || 80;
var app = express();

console.log('Mounting '+'/'+' at '+__dirname+'/www');

//Parsing params:

/* app.use(function(req,res,next){
	console.log(req.get('content-length'));
	console.log(req.get('content-type'));
	console.log(req.headers);
	console.log(req.body);
	next();
});  */

app.use(express.bodyParser());
app.use(express.cookieParser());

//Login or Registration;
app.post('/login', function(req, res){
	var user;
	console.log('USER POST');
	//console.log(req.get('content-length')); //DBG
	if(users.getByName(req.body.username) == undefined){
		res.send(401,'No such username or password.');
	}else{
		user = users.getByName(req.body.username);
		//console.log(req.body.password+":"+user.pass); //DBG
		if(req.body.password===user.pass){
			user.usid.id = uuid.v1();
			if(req.body.remember){
				user.usid.exp = new Date(Date.now() + 2592000000); //expires in 30 days.
			}else{
				user.usid.exp = new Date(Date.now() + 1800000); //expires in 30 minutes.
			}
			res.cookie('usid',user.usid.id,{
				expires:user.usid.exp,
				path:'/',
				httpOnly: true
			});
			res.send(200);//Allow
		}else{
			res.send(401,'No such username or password.');
		}
	}
});

app.post('/register', function(req, res){
	console.log("adding user");
	console.log(req.body);
	var status = users.add(req.body);
	if(status.status === 0){
		var user = users.getByName(req.body.username);
		user.usid.id = uuid.v1();
		user.usid.exp = new Date(Date.now() + 1800000); //expires in 30 mins.
		res.cookie('usid',user.usid.id,{
			expires:user.usid.exp,
			path:'/',
			httpOnly: true
		});
	}
	res.json(status.status===0?200:500,status);
});

app.get('/logout', function(req,res){
	var cook = req.cookies['usid'];
	if(cook != undefined){
		var user = users.getByUID(cook);
		if(user != null && user != undefined){
			user.usid.id=undefined;
			res.cookie('usid',cook,{
				expires: new Date(0), //expired.
				path:'/',
				httpOnly: true
			});
		}
	}
	res.set('Location','/#/login');
	res.set('Content-length','0');
	res.send(303);
});

// Cookie authentication:
app.use(auth());

//Static response:
app.use(express.static(__dirname+'/www'));

//To do operations:
app.get('/item', function(req, res){
	var items = req.user.todos;
	console.log('ITEMS GET');
	res.json(items.get());
});

app.post('/item', function(req, res){
	var status,
		items = req.user.todos;
	console.log('ITEM POST');
	status = items.add(req.body.id,req.body.value);
	res.json(status.status===0?200:500,status);
});

app.put('/item',function(req, res){
	var items = req.user.todos;
	console.log('ITEM PUT-UPDATE');
	status = items.alter(req.body.id,req.body.value,req.body.status);
	res.json(status.status===0?200:500,status);
});

app.delete('/item',function(req, res){
	var items = req.user.todos;
	console.log("ITEM DELETE : " + req.body.id);
	status = items.remove(req.body.id);
	res.json(status.status===0?200:500,status);
});


//Authentication by cookie function:
function auth(){
	return function(req,res,next){
		var usid = req.cookies['usid'],
			user,
			path = pathLib.normalize(req.path);
		if(usid != undefined && usid != null){
			user = users.getByUID(usid);
			if(user){
				req.user = user;
				if(req.path === '/TDlogin.html'){
					res.set('Content-length','0');
					res.send(403);
				}else{
					next();
				}
			}
		}
		if(req.user==undefined){
			if(req.path === '/todoList.html' || req.path.indexOf('/item')===0){
				res.set('Content-length','0');
				res.send(401);
			}else{
				next();
			}
		}
	}
} 

var server = http.createServer(app);
server.listen(port,function(){
	console.log('Server listening on port '+port+'.\nCtrl+C to force termination.');
});