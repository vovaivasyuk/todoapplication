angular.module('todoApp.services',[])
	.factory('Todos', function() {
		var items = [
			{text:'first', done:true, details:'',date:''},
			{text:'Second', done:false,details:'',date:''},
			{text:'Third', done:false, details:'',date:''}
			]
			return items;
	})