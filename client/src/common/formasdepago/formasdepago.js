angular.module('formasdepago',[]).controller('FormasDePagoCtrl',['$scope', function($scope){
	
}]);

var FormasDePagoCtrl = function ($scope, $modalInstance, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.update=function(){
    console.log("mlp");
  }
};