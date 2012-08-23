'use strict';

/* Controllers */

function AppCtrl($scope, $http) {
  $http({method: 'GET', url: '/json/name'}).
  success(function(data, status, headers, config) {
    $scope.name = data.name;
  }).
  error(function(data, status, headers, config) {
    $scope.name = 'Error!'
  });
  	setTimeout(function() {
		$('#featuredContent').orbit({ fluid: '16x9' });	
	}, 2000);
}

function MyCtrl1($scope) {
	console.info($scope);
	$scope.save = function () {
		var socket = io.connect('http://localhost');
		socket.emit('save', {
			name: $scope.name,
			age: $scope.age
		});
		console.info(socket);
		console.info($scope.name, $scope.age);
	};
}
// MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
