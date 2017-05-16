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
		}).state('myProject', {
			url: "/myProject",
			templateUrl: 'pages/myProject.html',
			controller: 'myProjectController'
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

app.filter('capitalize', function () {
	return function (input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
});

app.filter('trimDate', function () {
	return function (input) {
		if(input != null)
			return (input.substr(0, 10));
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

//service
app.factory('sessionService', function ($rootScope, $http, $window) {
	return {
		refreshPage: function () {
			$http.get('/sessioncheck').then(function (response) {
				console.log("I got the data I requested");
				console.log(response);

				if (response.data == 'not exist') {
					$rootScope.username = "";
					$rootScope.istester = false;
					$rootScope.ismanager = true;
					$window.location.href = "login.html";
				} else {
					$rootScope.username = response.data.username;
					if (response.data.role == "tester") {
						$rootScope.istester = true;
						$rootScope.ismanager = false;
					} else {
						$rootScope.istester = false;
						$rootScope.ismanager = true;
					}
				}
			});
		}
	};
});

//Dashboard
app.controller('DashboardController', ['$scope', '$http', 'sessionService', '$window', function ($scope, $http, sessionService, $window) {
	console.log("DashboardController");
	sessionService.refreshPage();
	Morris.Bar({
		element: 'graph_bar',
		data: [{
				device: 'iPhone 4',
				geekbench: 380
			},
			{
				device: 'iPhone 4S',
				geekbench: 655
			},
			{
				device: 'iPhone 3GS',
				geekbench: 275
			},
			{
				device: 'iPhone 5',
				geekbench: 1571
			},
			{
				device: 'iPhone 5S',
				geekbench: 655
			},
			{
				device: 'iPhone 6',
				geekbench: 2154
			},
			{
				device: 'iPhone 6 Plus',
				geekbench: 1144
			},
			{
				device: 'iPhone 6S',
				geekbench: 2371
			},
			{
				device: 'iPhone 6S Plus',
				geekbench: 1471
			},
			{
				device: 'Other',
				geekbench: 1371
			}
		],
		xkey: 'device',
		ykeys: ['geekbench'],
		labels: ['Geekbench'],
		barRatio: 0.4,
		barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
		xLabelAngle: 35,
		hideHover: 'auto',
		resize: true
	});

	Morris.Area({
		element: 'graph_area',
		data: [{
				period: '2014 Q1',
				iphone: 2666,
				ipad: null,
				itouch: 2647
			},
			{
				period: '2014 Q2',
				iphone: 2778,
				ipad: 2294,
				itouch: 2441
			},
			{
				period: '2014 Q3',
				iphone: 4912,
				ipad: 1969,
				itouch: 2501
			},
			{
				period: '2014 Q4',
				iphone: 3767,
				ipad: 3597,
				itouch: 5689
			},
			{
				period: '2015 Q1',
				iphone: 6810,
				ipad: 1914,
				itouch: 2293
			},
			{
				period: '2015 Q2',
				iphone: 5670,
				ipad: 4293,
				itouch: 1881
			},
			{
				period: '2015 Q3',
				iphone: 4820,
				ipad: 3795,
				itouch: 1588
			},
			{
				period: '2015 Q4',
				iphone: 15073,
				ipad: 5967,
				itouch: 5175
			},
			{
				period: '2016 Q1',
				iphone: 10687,
				ipad: 4460,
				itouch: 2028
			},
			{
				period: '2016 Q2',
				iphone: 8432,
				ipad: 5713,
				itouch: 1791
			}
		],
		xkey: 'period',
		ykeys: ['iphone', 'ipad', 'itouch'],
		lineColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
		labels: ['iPhone', 'iPad', 'iPod Touch'],
		pointSize: 2,
		hideHover: 'auto',
		resize: true
	});

	Morris.Donut({
		element: 'graph_donut',
		data: [{
				label: 'Customer',
				value: 20
			},
			{
				label: 'Manager',
				value: 60
			},
			{
				label: 'Tester',
				value: 20
			}
		],
		colors: ['#26B99A', '#34495E', '#3498DB', '#3498DB'],
		formatter: function (y) {
			return y + "%";
		},
		resize: true
	});

	Morris.Line({
		element: 'graph_line',
		xkey: 'year',
		ykeys: ['value'],
		labels: ['Value'],
		hideHover: 'auto',
		lineColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
		data: [{
				year: '2012',
				value: 20
			},
			{
				year: '2013',
				value: 10
			},
			{
				year: '2014',
				value: 5
			},
			{
				year: '2015',
				value: 5
			},
			{
				year: '2016',
				value: 20
			}
		],
		resize: true
	});
}]);

//Add Projects
app.controller('AddProjectController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	console.log("AddProjectController");
	sessionService.refreshPage();

	//insert project details
	$scope.addProject = function () {
		console.log($scope.project);

		$http.post('/addproject', $scope.project).then(function (response) {
			console.log(response);
			$scope.project.description = "";
			$scope.project.name = "";
			$scope.project.enddate = "";
			$scope.project.startdate = "";
		});
	};
}]);

//View Projects
app.controller('ViewProjectsController', ['$scope', '$http', '$window', '$location', 'sessionService', function ($scope, $http, $window, $location, sessionService) {
	console.log("ViewProjectsController");

	//insert project details
	viewprojectlist = function () {

		$http.get('/viewprojectlist').then(function (response) {
			console.log(response);
			$scope.projectlist = response.data.docs;

		});

	};
	//session refresh
	sessionService.refreshPage();

	$scope.deleteProject = function (id) {
		console.log($scope.project);
		var data = {
			"id": id
		};
		$http.post('/deleteproject', data, $scope.project).then(function (response) {
			console.log(response);
			viewprojectlist();
		});
	};

	$scope.editProject = function (id) {
		$scope.projectId = id;
		// $location.path("editproject");
		$http.get('/viewproject?id=' + id).then(function (response) {
			console.log(response);
			$scope.projectData = response.data[0];
			//viewprojectlist();
		});
	};

	$scope.viewProject = function (id) {
		console.log($scope.project);
		var data = {
			"id": id
		};
		$http.get('/viewproject?id=' + id).then(function (response) {
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
		var data = {
			"id": id,
			"name": name,
			"startdate": startdate,
			"enddate": enddate,
			"description": description
		};
		$http.post('/updateproject', data, $scope.project).then(function (response) {
			console.log(response);
			viewprojectlist();
		});
		// $location.path("editproject");

	};
}]);

app.controller('myProjectController', ['$scope', '$http', '$window', '$location', 'sessionService', function ($scope, $http, $window, $location, sessionService) {
	console.log("myProjectController");

	//insert project details
	viewprojectlist = function () {


		var data = {} //{ "id" : "59166393c8e1566f07f062e4"}
		$http.post('/viewprojectlistForUser', data, $scope.project).then(function (response) {
			console.log(response.data.docs.length);
			$scope.projectlist = response.data.docs;
		});

	};
	//session refresh
	sessionService.refreshPage();

	$scope.deleteProject = function (id) {
		console.log($scope.project);
		var data = {
			"id": id
		};
		$http.post('/deleteproject', data, $scope.project).then(function (response) {
			console.log(response);
			viewprojectlist();
		});
	};

	$scope.editProject = function (id) {
		$scope.projectId = id;
		// $location.path("editproject");
		$http.get('/viewproject?id=' + id).then(function (response) {
			console.log(response);
			$scope.projectData = response.data[0];
			//viewprojectlist();
		});
	};

	$scope.viewProject = function (id) {
		console.log($scope.project);
		var data = {
			"id": id
		};
		$http.get('/viewproject?id=' + id).then(function (response) {
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
		var data = {
			"id": id,
			"name": name,
			"startdate": startdate,
			"enddate": enddate,
			"description": description
		};
		$http.post('/updateproject', data, $scope.project).then(function (response) {
			console.log(response);
			viewprojectlist();
		});
		// $location.path("editproject");

	};


	$scope.broadcast = function (project) {
		$scope.selectedProject = project;
	};

	$scope.BroadcastMessage = function () {
		var data = {
			"project": $scope.selectedProject,
			"tag": $scope.tag,
			"message": $scope.message
		};
		$http.post('/broadcastMessage', data, $scope.project).then(function (response) {
			console.log(response);
			viewprojectlist();
		});

	}
}]);


app.controller('EditProjectController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
	//session refresh
	sessionService.refreshPage();

	console.log("EditProjectController");
	console.log($rootScope.projectId);
	console.log($scope.projectId);
	//insert project details

}]);

app.controller('ProfileController', ['$scope', '$http', '$window', 'sessionService', function ($scope, $http, $window, sessionService) {
	console.log("ProfileController");

	//session refresh
	sessionService.refreshPage();

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
		var data = {
			"name": name,
			"role": role,
			"last_name": last_name,
			"skills": skills,
			"organization": organization,
			"projects": projects,
			"exp": exp,
			"sex": sex,
			"linkedin": linkedin,
			"portfolio": portfolio,
			"country": country,
			"hours": hours,
			"available": available
		};
		$http.post('/updateprofile', data, $scope.project).then(function (response) {
			console.log(response);
			$window.alert("Profile Updated.");
			viewprojectlist();

		});
		// $location.path("editproject");

	};
}]);

//viewUser and profile
app.controller('ViewUsers', ['$scope', '$http', '$window', '$location', 'sessionService', function ($scope, $http, $window, $location, sessionService) {
	console.log("ViewUsers");

	//session refresh
	sessionService.refreshPage();

	viewusers = function () {
		//console.log("Location --> " + $location.path);
		$scope.user_role = $location.$$path.substring(1);
		$http.get('/viewusers?role=' + $location.$$path.substring(1)).then(function (response) {
			console.log(response);
			$scope.users = response.data.docs;

		});

	};

	viewusers();

	$scope.viewProfile = function (id) {
		console.log($scope.project);
		var data = {
			"id": id
		};
		$http.get('/viewprofile?id=' + id).then(function (response) {
			console.log(response);
			$scope.profileData = response.data[0];
		});
	};

	$scope.viewAllProjectsList = function (id) {
		var data = {
			"id": id
		};
		$http.get('/viewprojectlist').then(function (response) {
			console.log("tempProjectList : " + response);
			$scope.tempProjectList = response.data.docs;
		});

		$scope.viewProfile(id)
	};

	$scope.AssignProjectToUser = function (project) {

		console.log("Gaurang :" + project);
		console.log("Gaurang :" + $scope.profileData)
		var data = {
			"project": project,
			"profileData": $scope.profileData
		};


		$http({
			method: "POST",
			url: '/assignProject',
			data: {
				"project": project,
				"profileData": $scope.profileData
			}
		}).success(function (data) {
			console.log("Response : " + response);
			$scope.status = response.data;

		}).error(function (error) {
			console.log("inside error");
			console.log(error);
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
			$window.alert("unexpected_error");
		});

	};
}]);