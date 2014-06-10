angular.module('go.core', ['go.auth'])

.controller('MainCtrl', ['$scope', 'go.auth.Auth', '$location',
function($scope, AuthService, $location) {
	//if(!AuthService.authorized) {
		$location.path('/login');
	//}
}])

.controller('LoginCtrl', ['$scope', '$location',
function($scope, $location) {

}]);
