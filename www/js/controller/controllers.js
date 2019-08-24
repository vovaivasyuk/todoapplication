angular.module('todoApp.controllers',[])

app.controller('ListCtrl', function($scope, $http, Todos) {
	$scope.todos = Todos;
	$scope.remaining = function() {
		let count = 0;
		angular.forEach($scope.todos, function(todo) {
			count += todo.done ? 0 : 1;
		});
		return count;
	};
});

app.controller('CreateCtrl', function($scope, $location, $timeout,
Todos) {
	$scope.todoText = "";
	$scope.todoDetails = "";
	$scope.todoDate="";
	$scope.save = function() {
		Todos.push({text:$scope.todoText, done:false,
	details:$scope.todoDetails, date:$scope.todoDate});
		
		$location.path('/');
	};
});

app.controller('EditCtrl',
	function($scope, $location, $stateParams, Todos) {
	$scope.todos = Todos;
       
    var result = $scope.todos.filter(function (obj) {
            return obj.text == $stateParams.todoText;

     }); 
	$scope.todoText = result[0].text;
	$scope.todoDetails = result[0].details;
	$scope.todoDate = result[0].date;
	$scope.save = function() {
		let text = $scope.todoText;
		let details = $scope.todoDetails;
		let done = $scope.todoDone;
		let date = $scope.todoDate;
		angular.forEach($scope.todos, function(todo) {
	if(todo.text == text) {
		todo.text = text;
		todo.details = details;
		todo.date = date;
	}
	});

	$location.path('/');
	}; });