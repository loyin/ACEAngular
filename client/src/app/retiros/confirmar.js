angular.module('confirmar', [])
.config(['$routeProvider', function ($routeProvider)
  {
    $routeProvider.when('/retiros/confirmar', {
      templateUrl:'retiros/confirmar.tpl.html',
      controller:'ConfirmarViewCtrl'

    });
  }
  ])
.controller('ConfirmarViewCtrl',function($scope, $http, $location, localStorageService){
		
	$scope.obtenerRetiros=function(){
		console.log("entrefuncion");
		var postData = {
	        opc:'OBTENERRETIROSPARCIALES',
	        SCC_tienda :"800",
	        SCC_caja: "2",
	        SCC_nemp: "91680727",
	        SCC_token : localStorageService.get('token')
		};

		// $http({
		//     url: 'http://10.44.63.167:8080/wsCoppelCanada/services/retiroscortes/retiros/obtenerretirosparciales?',
		//     method: "POST",
		//     data: postData,
		//     headers: {
		//     	'Content-Type': 'application/json; charset=utf-8'
  //      		}
		// })
		// .then(function(response) {
		//         // success
		//         console.log(response);
		//     }, 
		//     function(response) { // optional
		//         // failed
		//         console.log(response);
		//     }
		// );


		$http({
			method:'POST',
			url:'http://localhost/webservices/modulos/_models/cortesretiros/retirosREST.php',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'},
			data:$.param(postData)
			}).success(function(data,status){
				console.log(data);
			}).error(function(data,status){
				console.log(status);

			});

		// $http({
		//     url: 'http://10.44.63.167:8080/wsCoppelCanada/services/retiroscortes/retiros/obtenerretirosparciales?',
		//     method: "POST",
		//     data: postData,
		//     headers: {
		//     	'Content-Type': 'application/json; charset=utf-8'
  //      		}
		// })
		// .then(function(response) {
		//         // success
		//         console.log(response);
		//     }, 
		//     function(response) { // optional
		//         // failed
		//         console.log(response);
		//     }
		// );
	};
});