angular.module('home', []).config(['$routeProvider', function($routeProvider, security){

  $routeProvider.when('/home', {
    templateUrl:'home/home.tpl.html',
    controller:'HomeCtrl'
    // resolve:
    //   projects:['Projects', function(Projects){
    //     return Projects.all();
    //   }]
    // }
  });
}]);

angular.module('home').controller('HomeCtrl', ['$scope', 'security', function($scope, security){
  $scope.isAuthenticated = security.isAuthenticated;
  //security.showLogin();
  //$scope.projects = projects;
}]);

function DropdownCtrl($scope) {
  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    console.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };
}
