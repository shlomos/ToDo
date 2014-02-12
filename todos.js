module.exports = ToDoList

function ToDoList(){
	var items = [];
	
	this.get = function(){
		return items;
	};
	
	this.add = function(id,value){
		if(items[id]!=undefined){
			return {status: 1,msg: "item with id="+id+" already exists."};
		}else{
			items[id] = {completed: false,title: value};
			return {status: 0,msg: ''};
		}
	};
	
	this.alter = function(id,value,status){
		if(items[id] == undefined){
			return {status: 1,msg: "Item with id="+id+" doesn't exist."};
		}else{
			items[id].title=value;
			items[id].completed=(status==1)?true:false;
			return {status: 0,msg: ''};
		}
	};
	
	this.remove = function(id){
		if(id === -1){
			items = [];
			return {status: 0,msg: ''};
		}else if(items[id]==undefined){
			return {status: 1,msg: "Item with id="+id+" doesn't exist."};
		}else{
			items.splice(id,1);
			return {status: 0,msg: ''};
		}
	};
}