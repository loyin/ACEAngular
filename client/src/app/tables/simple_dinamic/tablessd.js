angular.module('tablessd', ['ngSanitize'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/tables/simple_dinamic', {
    templateUrl:'tables/simple_dinamic/tablessd.tpl.html',
    controller:'TablesSDViewCtrl'
  });
}])
.controller('TablesSDViewCtrl', ['$scope','$location','$routeParams', function ($scope, $location, $routeParams) {
  
   
}]);