angular.module('go.auth', [])

.factory('go.auth.Auth', ['$http',
function($http) {
	return {
		login: function(username, password) {
			var creds = {
				username: username,
				password: password
			};

			$http({method:'POST', url:'/users/login'})
			.success(function(data, status, headers, config) {
				console.log(data);
			}).error(function(data, status, headers, config) {
				console.log(data);
			});
		}
	};
}])

.controller('go.auth.AuthCtrl', ['$scope', 'go.auth.Auth',
function($scope, Auth) {
	$.extend($scope, {
		login: function() {
			Auth.login($scope.username, $scope.password);
		}
	});
}]);
