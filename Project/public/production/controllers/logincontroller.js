var loginapp = angular.module('loginapp', []);


loginapp.controller('LoginController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    console.log("Hello from LoginController");
	
	//destroy session
	$http.get('/sessiondestroy').then(function(response){
		console.log("session destroyed");
	});
	
	//insert user details
	$scope.addUser = function() {
	console.log($scope.user);
	
	$http.post('/usersignup', $scope.user).then(function(response) {
		console.log(response);
		$window.alert("Registration Successful..!!");
		$scope.user="";
	  });
	};
	
	// //authenticate user
	// $scope.checkUser = function(name,password) {
	// 	console.log($scope.login);
	//   $http.get('/schoollist/'+ name +'/'+password, $scope.login).success(function(response) {
	// 	console.log("I got the data I requested");
	// 	console.log(response);

	// 	$scope.login.status="Wrong username or Password. Try Again!!";
		
	// 	if(response.toString() == "successful"){
	// 		$scope.login.status="";
				
	// 				$window.location.href = "schoolindex.html";
			
	// 	}
		
	// });
	// };
}]);