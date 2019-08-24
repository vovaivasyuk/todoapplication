// eslint-disable-next-line no-undef
var app = angular.module('app',['ui.router', 'todoApp.services','todoApp.controllers']);

app.config(['$stateProvider',function($stateProvider){
	$stateProvider
		.state('first',{
			url: '/new',
			templateUrl:'partials/detail.html',
			controller:'CreateCtrl'
	})
		.state('second',{
			url: '/edit/:todoText',
			controller:'EditCtrl',
			templateUrl:'partials/detail.html'
	})
		.state('third',{
			url:'/',
			controller:'ListCtrl',
			templateUrl:'partials/list.html'

	})
		.state('root',{
			controller:'ListCtrl',
			templateUrl:'partials/list.html'
	})
}]);








	