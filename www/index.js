var todoApp = angular.module('todoApp', ['ngRoute']);

todoApp.controller('ToDoCtrl', function TodoCtrl($scope, $routeParams,$http, filterFilter) {
	var todos;
	$http.get('/item').success(function(data) {
       todos = $scope.todos = data;
	   
		$scope.newTodo = '';
		$scope.editedTodo = null;

		$scope.$watch('todos', function (newValue, oldValue) {
			$scope.remainingCount = filterFilter(todos, { completed: false }).length;
			$scope.completedCount = todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);
	});
	// Monitor the current route for changes and adjust the filter accordingly.
	$scope.$on('$routeChangeSuccess', function () {
		var status = $scope.status = $routeParams.status || '';

		$scope.statusFilter = (status === 'active') ?
			{ completed: false } : (status === 'completed') ?
			{ completed: true } : null;
	});

	$scope.addTodo = function () {
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}

		todos.push({
			title: newTodo,
			completed: false
		});
		
		$http({
			method: 'POST',
			url: '/item',
			withCredentials: true,
			data: {id:todos.length-1,value:newTodo}
		});

		$scope.newTodo = '';
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		$scope.originalTodo = angular.extend({}, todo);
	};

	$scope.doneEditing = function (todo) {
		$http({
			method: 'PUT',
			url: '/item',
			headers:{
					'content-type':'application/json;charset=UTF-8'
				},
			withCredentials: true,
			data: {id:todos.indexOf(todo),value:todo.title.trim(),status:todo.completed?1:0}
		});
		$scope.editedTodo = null;
		todo.title = todo.title.trim();

		if (!todo.title) {
			$scope.removeTodo(todo);
		}
	};

	$scope.revertEditing = function (todo) {
		todos[todos.indexOf(todo)] = $scope.originalTodo;
		$scope.doneEditing($scope.originalTodo);
	};

	$scope.removeTodo = function (todo) {
		$http({
			method: 'DELETE',
			url: '/item',
			withCredentials: true,
			headers:{
					'content-type':'application/json;charset=UTF-8'
				},
			data: {id:todos.indexOf(todo)}
		});
		todos.splice(todos.indexOf(todo), 1);
	};

	$scope.clearCompletedTodos = function () {
		for(var i=0;i<todos.length;i++){
			if(todos[i].completed){
				$scope.removeTodo(todos[i])
				i--;
			}
		}
		$scope.todos = todos;
	};

	$scope.markAll = function (completed) {
		todos.forEach(function (todo) {
			todo.completed = !completed;
		});
	};
});


todoApp.controller('ToDoLogin', function ($scope,$rootScope, $http, $location) {
	$scope.userLog = '';
	$scope.passLog = '';
	$scope.rememberMe = false;
	$scope.msgLog = '';
	$scope.user = '';
	$scope.pass = '';
	$scope.passwordVer = '';
	$scope.fname = '';
	$scope.msgReg = '';
	$scope.upPattern = /^[\w@#_]+$/;
	$scope.namePattern = /^(\w+\s*)+$/;
	$rootScope.signedUser = $rootScope.signedUser||'Not signed';
	
	//Registration:
	$scope.registerUser = function(){
	var user = {
		username: $scope.user,
		password: $scope.pass,
		fullname: $scope.fname
	};
	$http({
			method: 'POST',
			url: '/Register',
			withCredentials: true,
			data: JSON.stringify(user)
		}).
		success(function(data, status, headers, config) {
			$rootScope.signedUser = user.username;
			$location.path('/');
		}).
		error(function(data, status, headers, config) {
			if(status==404){
				$scope.msgReg = "Could not connect to server.";
			}else if(status==500){
				$scope.msgReg = data.msg.toString();
			}
		});
	}
	
	//Login:
	$scope.loginUser = function(){
		var user = {
				username: $scope.userLog,
				password: $scope.passLog,
				remember: $scope.rememberMe
				};
		$http({
				method: 'POST',
				url: '/login',
				headers:{
					'content-type':'application/json'
				},
				data: JSON.stringify(user)
			}).
			success(function(data, status, headers, config) {
				$rootScope.signedUser = user.username;
				$location.path('/');
			}).
			error(function(data, status, headers, config) {
				if(status==404){
					$scope.msgLog = "Could not connect to server.";
				}else if(status==401){
					$scope.msgLog = data.msg.toString();
				}else if(status==500){
					$scope.msgLog = "Server could not satisfy your request.";
				}
				//write to user the error;
				//alert(status);
		});
	}
});

todoApp.config(function ($routeProvider) {
		$routeProvider.
      when('/', {
        templateUrl: 'todoList.html',
        controller: 'ToDoCtrl'
      }).
	  when('/login', {
        templateUrl: 'TDlogin.html',
        controller: 'ToDoLogin'
      }).
      when('/:status', {
        templateUrl: 'todoList.html',
        controller: 'ToDoCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
});

todoApp.run(function($rootScope, $location) {
    // register listener to watch route changes
    $rootScope.$on("$routeChangeError", function(angularEvent, next, current,rejection) {
		// no logged user, we should be going to #login
		if ( next.templateUrl == 'TDlogin.html' ) {
		  $location.path( "/" );
		} else{
		  // not going to #login, we should redirect now
		  $location.path( "/login" );
		}
    });
});

todoApp.directive('uiValidateEquals', function() {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            function validateEqual(myValue, otherValue) {
                if (myValue === otherValue || myValue==undefined || myValue==='') {
                    ctrl.$setValidity('equal', true);
                    return myValue;
                } else {
                    ctrl.$setValidity('equal', false);
                    return undefined;
                }
            }

            scope.$watch(attrs.uiValidateEquals, function(otherModelValue) {
                validateEqual(ctrl.$viewValue, otherModelValue);               
            });

            ctrl.$parsers.unshift(function(viewValue) {
                return validateEqual(viewValue, scope.$eval(attrs.uiValidateEquals));
            });

            ctrl.$formatters.unshift(function(modelValue) {
                return validateEqual(modelValue, scope.$eval(attrs.uiValidateEquals));                
            });
        }
    };
});

todoApp.directive('todoFocus', function todoFocus($timeout) {
	return function (scope, elem, attrs) {
		scope.$watch(attrs.todoFocus, function (newVal) {
			if (newVal) {
				$timeout(function () {
					elem[0].focus();
				}, 0, false);
			}
		});
	};
});

todoApp.directive('todoEscape', function () {
	var ESCAPE_KEY = 27;
	return function (scope, elem, attrs) {
		elem.bind('keydown', function (event) {
			if (event.keyCode === ESCAPE_KEY) {
				scope.$apply(attrs.todoEscape);
			}
		});
	};
});

