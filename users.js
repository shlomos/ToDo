var ToDoList = require('./todos.js');
var users = {};

module.exports = {
	getByName: function(username){
		return users[username];
	},
	getByUID: function(uid){
		var userKeys=Object.keys(users),usidTemp;
		for(i in userKeys){
			usidTemp = users[userKeys[i]].usid;
			if(usidTemp.id===uid){
				if(usidTemp.exp >= Date.now()){
					return users[userKeys[i]];
				}else{
					return undefined;
				}
			}
		}
		return undefined;
	},
	add:function(user){
		var statusUser;
		if('object' == typeof user){
			statusUser = checkLegalUser(user);
			if(statusUser.status === 0){
				if(users[user.username]==undefined){
					users[user.username]={
						uname: user.username,
						name: user.fullname,
						pass: user.password,
						usid: {id: undefined,exp:undefined},
						todos: new ToDoList()
						};
					return statusUser;	
				}else{
					return {status: 1,msg: "User with name '"+user.username+"' already exists."}; 
				}
			}else{
				return statusUser;
			}
		}
	}
};

var checkLegalUser = function(user){
	var upPattern = /^[\w@#_]+$/;
	var namePattern = /^(\w+\s*)+$/;
	if(upPattern.test(user.username) && user.username.length <= 20 ){
		if(user.password.length >= 6 && user.password.length <= 30 && upPattern.test(user.password)){
			if(namePattern.test(user.fullname) && user.fullname.length <= 50){
				return {status: 0,msg: ''};
			}else{
				return {status: 1,msg: "Name is either illegal or too long!"}; 
			}
		}else{
			return {status: 1,msg: "Password is either illegal,short or too long!"}; 
		}
	}else{
		return {status: 1,msg: "Username is either illegal,short or too long!"}; 
	}
}