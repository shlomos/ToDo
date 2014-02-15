var express = require('./express/miniExpress.js');
var http = require('./express/http/miniHttp.js');
var pathLib = require('path');
var users = require('./users.js');
var uuid = require('node-uuid');
var port = process.env.PORT || 9134;
var app = express();

console.log('Mounting '+'/'+' at '+__dirname+'\\www');

app.use(express.bodyParser());
app.use(express.cookieParser());

// Cookie authentication:
app.use(auth());

//Login or Registration;
app.post('/login', function(req, res){
	var user,status;
	console.log('USER POST');
	//console.log(req.get('content-length')); //DBG
	if(users.getByName(req.body.username) == undefined){
		status={status: 1,msg:"No such username or password."};
		res.json(401,status);
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
			status={status: 0,msg:""};
			res.json(status.status===0?200:500,status);
		}else{
			status={status: 1,msg:"No such username or password."};
			res.json(401,status);
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
	console.log('Logging-out user');
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
	res.json(303,{status:0,msg:""});
});

//Static response:
app.use(express.static(__dirname+'\\www'));

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
					res.json(403,{status: 1,msg:"Already logged in!"});
				}else{
					next();
				}
			}
		}
		if(req.user==undefined){
			if(req.path === '/todoList.html' || req.path.indexOf('/item')===0){
				res.json(401,{status:1,msg:"Must log-in first!"});
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