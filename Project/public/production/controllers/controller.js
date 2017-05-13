var app = angular.module('app', ['ui.router', 'datatables', 'datatables.bootstrap', 'angularUtils.directives.dirPagination']);

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
	}).state('profile', {
		url: "/profile",
		templateUrl: 'pages/profile.html',
		controller: 'ProfileController'
	}).state('projectmanager', {
		url: "/manager",
		templateUrl: 'pages/users.html',
		controller: 'ViewUsers'
	}).state('testers', {
		url: "/tester",
		templateUrl: 'pages/users.html',
		controller: 'ViewUsers'
	}).state('customers', {
		url: "/customer",
		templateUrl: 'pages/users.html',
		controller: 'ViewUsers'
	})
});

app.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
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
app.controller('ViewProjectsController', ['$scope', '$http', '$window', '$location','$rootScope', function ($scope, $http, $window, $location,$rootScope) {
	console.log("ViewProjectsController");

	//insert project details
	viewprojectlist = function () {

		$http.get('/viewprojectlist').then(function (response) {
			console.log(response);
			$scope.projectlist = response.data;
		});
	};

	$scope.deleteProject = function (id) {
		console.log($scope.project);
		var data = {"id" :id};
		$http.post('/deleteproject',data, $scope.project).then(function (response) {
			console.log(response);
			viewprojectlist();
		});
	};

	$scope.editProject = function (id) {
		$rootScope.projectId = id;
		$scope.projectId = id;
	// $location.path("editproject");
		$http.get('/viewproject?id='+id).then(function (response) {
			console.log(response);
			$scope.projectData = response.data[0];
			//viewprojectlist();
		});
	 };

	$scope.viewProject = function (id) {
		console.log($scope.project);
		var data = {"id" :id};
		$http.get('/viewproject?id='+id).then(function (response) {
			console.log(response);
			$scope.projectData = response.data[0];
			//viewprojectlist();
		});
	};

	viewprojectlist();

	$scope.update = function () {

		var name = $scope.projectData.name;
		var id = $scope.projectData._id;
		var startdate = $scope.projectData.startdate;
		var enddate = $scope.projectData.enddate;
		var description = $scope.projectData.description;
		var data = {"id" :id, "name":name,"startdate":startdate,"enddate":enddate,"description":description};
		$http.post('/updateproject',data, $scope.project).then(function (response) {
			console.log(response);
			viewprojectlist();
		});
		// $location.path("editproject");

	};
}]);

app.controller('EditProjectController', ['$rootScope','$scope', '$http', function ($rootScope, $scope, $http) {
	console.log("EditProjectController");
	console.log($rootScope.projectId);
	console.log($scope.projectId);
	//insert project details

}]);
app.controller('ProfileController', ['$scope', '$http','$window', function ( $scope, $http, $window) {
	console.log("ProfileController");
	var getProfile = function () {

		$http.get('/getProfile').then(function (response) {
			console.log(response);
			$scope.user = response.data[0];
		});
	};
	getProfile();

	$scope.update = function () {

		var name = $scope.user.name;
		var role = $scope.user.role;
		var last_name = $scope.user.last_name;
		var skills = $scope.user.skills;
		var organization = $scope.user.organization;
		var projects = $scope.user.projects;
		var exp = $scope.user.exp;
		var sex = $scope.user.sex;
		var country = $scope.user.country;
		var linkedin = $scope.user.linkedin;
		var portfolio = $scope.user.portfolio;
		var hours = $scope.user.hours;
		var available = $scope.user.available;
		var data = {"name":name,"role":role,"last_name":last_name,"skills":skills,"organization":organization,"projects":projects,
		"exp":exp,"sex":sex,"linkedin":linkedin,"portfolio":portfolio,"country":country,"hours":hours,"available":available};
		$http.post('/updateprofile',data, $scope.project).then(function (response) {
			console.log(response);
			$window.alert("Profile Updated.");
			viewprojectlist();

		});
		// $location.path("editproject");

	};
}]);
//viewUser and profile
app.controller('ViewUsers', ['$scope', '$http', '$window', '$location','$rootScope', function ($scope, $http, $window, $location,$rootScope) {
	console.log("ViewUsers");

	viewusers = function () {
		//console.log("Location --> " + $location.path);
		$scope.user_role = $location.$$path.substring(1);
		$http.get('/viewusers?role='+ $location.$$path.substring(1)).then(function (response) {
			console.log(response);
			$scope.users = response.data;
		});
	};

	viewusers();

	$scope.viewProfile = function (id) {
		console.log($scope.project);
		var data = {"id" :id};
		$http.get('/viewprofile?id='+id).then(function (response) {
			console.log(response);
			$scope.profileData = response.data[0];
		});
	};

}]);