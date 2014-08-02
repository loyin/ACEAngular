angular.module('modals', [])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/modals', {
    templateUrl:'modals/modals.tpl.html',
    controller:'ModalsViewCtrl'
  });
}])

.controller('ModalsViewCtrl', ['$scope','$location','$routeParams', function ($scope, $location, $routeParams) {

  $scope.opcionales=[
    {"id":1,"nombre":"domicilio"},
    {"id":2,"nombre":"formaspago"}
  ];

   $scope.finalizar=function(){

    if($scope.opcionales.length>0){
      console.log("existen");
    };

   };



   $scope.showFormasPago=function(){
    console.log("formapagos");

   };

   $scope.showDomicilio=function(){
      console.log("domicilio");

   };
}]);