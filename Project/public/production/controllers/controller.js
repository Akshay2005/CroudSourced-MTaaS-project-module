var app = angular.module('app', ['ui.router', 'datatables', 'datatables.bootstrap']);

app.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/dashboard");
	$stateProvider
		.state('dashboard', {
			url: "/dashboard",
			templateUrl: 'pages/dashboard.html',
			controller: 'DashboardController'
		}).state('addproject', {
			url: "/addproject",
			templateUrl: 'pages/addproject.html',
			controller: 'AddProjectController'
		}).state('viewprojects', {
			url: "/viewprojects",
			templateUrl: 'pages/viewprojects.html',
			controller: 'ViewProjectsController'
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

//Add Projects
app.controller('AddProjectController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	console.log("AddProjectController");

	//insert project details
	$scope.addProject = function () {
		console.log($scope.project);

		$http.post('/addproject', $scope.project).then(function (response) {
			console.log(response);
			$window.alert("Project Added.");
		});
	};
}]);

//View Projects
app.controller('ViewProjectsController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	console.log("ViewProjectsController");

	//insert project details
	viewprojectlist = function () {

		$http.get('/viewprojectlist').then(function (response) {
			console.log(response);
			$scope.projectlist = response.data;
		});
	};

	viewprojectlist();
}]);