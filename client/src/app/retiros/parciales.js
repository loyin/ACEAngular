angular.module('parciales', [])
.config(['$routeProvider', function ($routeProvider)
  {
    $routeProvider.when('/retiros/parciales', {
      templateUrl:'retiros/parciales.tpl.html',
      controller:'ParcialesViewCtrl'

    });
  }
  ])
.controller('ParcialesViewCtrl',function($scope, $http, $location){


	$scope.dataDocumentos={};
	$scope.dataDenominaciones={};
	$scope.inputDenominaciones={};
	$scope.sumDocumentos={};


	$scope.data={};

	$scope.total = function(documento,denominacion,factor){
		$scope.inputDenominaciones[documento][denominacion].importe=$scope.inputDenominaciones[documento][denominacion].valor * factor;

		var sum=0;
		for(key in $scope.inputDenominaciones[documento]){
			sum+=parseFloat($scope.inputDenominaciones[documento][key].importe);
		}
		$scope.sumDocumentos[documento]=sum;
	};

	$scope.total_documentos=function(){
		var sum=0;
		for(key in $scope.sumDocumentos){
			sum+=parseFloat($scope.sumDocumentos[key]);
		}
		return sum;
	}

	$scope.grabarRetiros=function(){
		var desCortes=[];
		for(key in $scope.inputDenominaciones){
			for(key2 in $scope.inputDenominaciones[key]){
				desCortes.push({"idDenominacion":key2, "importe":$scope.inputDenominaciones[key][key2].importe});
			}
		}
		//AGREGAR EL PROMISE ($HTTP) DEL WS A CONSUMIR PARA GRABAR EL RTIRO CAPTURADO
	};

	$scope.showDemonimaciones = function(){
		//AGREGAR PROMISE ($HTTP) DEL WS PARA OBTENER LOS CATALOGOS DE LOS TIPOS DE DOCUMENTOS Y SUS DENOMINACIONES
		//SE HARA EN HARDCODED
		//console.log("ejecutado");
		$scope.dataDocumentos=[
		  {
		    "nombre": "Efectivo",
		    "denominaciones": [
		      {
		        "idDocumento": 1,
		        "descDenominacion": "Billetes de 1000",
		        "denominacion": 1000
		      },
		      {
		        "idDocumento": 2,
		        "descDenominacion": "Billetes de 500",
		        "denominacion": 500
		      },
		      {
		        "idDocumento": 3,
		        "descDenominacion": "Billetes de 200",
		        "denominacion": 200
		      },
		      {
		        "idDocumento": 4,
		        "descDenominacion": "Billetes de 100",
		        "denominacion": 100
		      },
		      {
		        "idDocumento": 5,
		        "descDenominacion": "Billetes de 50",
		        "denominacion": 50
		      },
		      {
		        "idDocumento": 6,
		        "descDenominacion": "Billetes de 20",
		        "denominacion": 20
		      },
		      {
		        "idDocumento": 7,
		        "descDenominacion": "Monedas",
		        "denominacion": 1
		      },
		      {
		        "idDocumento": 8,
		        "descDenominacion": "Vales de 100",
		        "denominacion": 100
		      }
		    ]
		  },
		  {
		    "nombre": "Vales",
		    "denominaciones": [
		      {
		        "idDocumento": 9,
		        "descDenominacion": "Vales de 200",
		        "denominacion": 200
		      },
		      {
		        "idDocumento": 10,
		        "descDenominacion": "Vales de 300",
		        "denominacion": 300
		      },
		      {
		        "idDocumento": 11,
		        "descDenominacion": "Vales de 500",
		        "denominacion": 500
		      },
		      {
		        "idDocumento": 12,
		        "descDenominacion": "Cheques",
		        "denominacion": 1
		      }
		    ]
		  },
		  {
		    "nombre": "Cheques",
		    "denominaciones": [
		      {
		        "idDocumento": 13,
		        "descDenominacion": "Cheques Bancoppel",
		        "denominacion": 1
		      },
		      {
		        "idDocumento": 14,
		        "descDenominacion": "Cheques Bancomer",
		        "denominacion": 1
		      },
		      {
		        "idDocumento": 15,
		        "descDenominacion": "Cheques Santander",
		        "denominacion": 1
		      },
		      {
		        "idDocumento": 16,
		        "descDenominacion": "Cheques Banamex",
		        "denominacion": 1
		      }
		    ]
		  }
		];

		angular.forEach($scope.dataDocumentos, function(value, key){
			$scope.inputDenominaciones[value.nombre] = {};
			$scope.sumDocumentos[value.nombre]=0;
			angular.forEach(value.denominaciones, function (denominacion,index){
				$scope.inputDenominaciones[value.nombre][denominacion.idDocumento]={};
				$scope.inputDenominaciones[value.nombre][denominacion.idDocumento].valor=0;
				$scope.inputDenominaciones[value.nombre][denominacion.idDocumento].importe=0;
			});
		});
	};
});