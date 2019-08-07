angular.module('todoApp.services',[])
	.factory('Todos', function() {
		var items = [
			{text:'first', done:true, details:''},
			{text:'Second', done:false,details:''},
			{text:'Third', done:false, details:''}
			]
			return items;
	})