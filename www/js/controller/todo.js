
angular.module('todoApp.controllers',[])

.controller('ListCtrl', function($scope, $http, Todos) {
	$scope.todos = Todos;
	$scope.remaining = function() {
		var count = 0;
		angular.forEach($scope.todos, function(todo) {
			count += todo.done ? 0 : 1;
		});
		return count;
	};
})

.controller('CreateCtrl', function($scope, $location, $timeout,
Todos) {
	$scope.todoText = "";
	$scope.todoDetails = "";
	$scope.todoDate="";
	$scope.save = function() {
		Todos.push({text:$scope.todoText, done:false,
	details:$scope.todoDetails, date:$scope.todoDate});
		$location.path('/');
	};
})

.controller('EditCtrl',
	function($scope, $location, $routeParams, Todos) {
	$scope.todos = Todos;
       
    var result = $scope.todos.filter(function (obj) {
            return obj.text == $routeParams.todoText;
     });
	$scope.todoText = result[0].text;
	$scope.todoDetails = result[0].details;
	$scope.todoDate = result[0].date;
	$scope.save = function() {
		var text = $scope.todoText;
		var details = $scope.todoDetails;
		var done = $scope.todoDone;
		var date = $scope.todoDate;
		alert(text);
		angular.forEach($scope.todos, function(todo) {
	if(todo.text == text) {
		todo.text = text;
		todo.details = details;
		todo.date = date;
	}
	});

	$location.path('/');
	};
/*
$scope.destroy = function() {
		$scope.$remove();
		$location.path('/');
	}; */
});