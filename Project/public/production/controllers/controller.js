var app = angular.module('app', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/dashboard");
	$stateProvider
		.state('dashboard', {
			url: "/dashboard",
			templateUrl: 'pages/dashboard.html',
			controller: 'DashboardController'
		}).state('projects', {
			url: "/projects",
			templateUrl: 'pages/projects.html',
			controller: 'ProjectController'
		})
});

app.factory('Scopes', function ($rootScope) {
	var mem = {};

	return {
		store: function (key, value) {
			mem[key] = value;
		},
		get: function (key) {
			return mem[key];
		}
	};
});


app.run(['$rootScope', function ($rootScope) {
	$rootScope.logout = function () {
		$http.get('/sessiondestroy').then(function (response) {
			console.log("session destroyed");
		});
	};
}]);

app.run(['$rootScope', function ($rootScope) {
	$rootScope.logout = function () {
		$http.get('/sessiondestroy').success(function (response) {
			console.log("session destroyed");
		});
	};
}]);

//Dashboard
app.controller('DashboardController', ['$scope', '$http', '$rootScope', '$window', function ($scope, $http, $rootScope, $window) {
	console.log("DashboardController");

	refreshPage = function () {
		//session checking
		$http.get('/sessioncheck').then(function (response) {
			console.log("I got the data I requested");
			console.log(response);

			if (response.data == 'not exist') {
				$rootScope.username = "";
				$window.location.href = "login.html";
			} else {
				$rootScope.username = response.data;
			}
		});
	};

	refreshPage();
}]);

//Projects
app.controller('ProjectController', ['$scope', '$http', function ($scope, $http) {
	console.log("ProjectController");
}]);