angular.module('go', [
	'ngRoute',
	'go.core',
	'go.auth'
])
	
.config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
	//$locationProvider.html5Mode(true);
	$routeProvider
		.when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'go.auth.AuthCtrl'
		})
		.when('/', {
			templateUrl: 'partials/main.html',
			controller: 'MainCtrl'
		})
		.otherwise({
			redirectTo: '/',
			controller: 'MainCtrl'
		});
	}
]);
