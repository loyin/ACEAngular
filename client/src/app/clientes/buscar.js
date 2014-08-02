String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
angular.module('buscar', [])
.config(['$routeProvider', function ($routeProvider)
  {
    $routeProvider.when('/clientes/buscar', {
      templateUrl:'clientes/buscar.tpl.html',
      controller:'BuscarClientesViewCtrl'

    });
  }
  ])
.controller('BuscarClientesViewCtrl',function($scope, $http, $location, localStorageService, menuCollapse, $timeout){

	menuCollapse.setInfo(false);
//	 $scope.selected = undefined;
//	 $scope.selectedCliente = undefined;
//
//	 $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
//	 // Any function returning a promise object can be used to load values asynchronously
//	 $scope.getLocation = function(val) {
//	 return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
//	   params: {
//	     address: val,
//	     sensor: false
//	   }
//	 }).then(function(res){
//	   var addresses = [];
//	   angular.forEach(res.data.results, function(item){
//	     addresses.push(item.formatted_address);
//	   });
//	   return addresses;
//	 });
//	 };
//	 $scope.statesWithFlags = [{'name':'Alabama','flag':'5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},{'name':'Alaska','flag':'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},{'name':'Arizona','flag':'9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},{'name':'Arkansas','flag':'9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},{'name':'California','flag':'0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},{'name':'Colorado','flag':'4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},{'name':'Connecticut','flag':'9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},{'name':'Delaware','flag':'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},{'name':'Florida','flag':'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},{'name':'Georgia','flag':'5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'},{'name':'Hawaii','flag':'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},{'name':'Idaho','flag':'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},{'name':'Illinois','flag':'0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},{'name':'Indiana','flag':'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},{'name':'Iowa','flag':'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},{'name':'Kansas','flag':'d/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},{'name':'Kentucky','flag':'8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},{'name':'Louisiana','flag':'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},{'name':'Maine','flag':'3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},{'name':'Maryland','flag':'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},{'name':'Massachusetts','flag':'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},{'name':'Michigan','flag':'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},{'name':'Minnesota','flag':'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},{'name':'Mississippi','flag':'4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},{'name':'Missouri','flag':'5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},{'name':'Montana','flag':'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},{'name':'Nebraska','flag':'4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},{'name':'Nevada','flag':'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},{'name':'New Hampshire','flag':'2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},{'name':'New Jersey','flag':'9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},{'name':'New Mexico','flag':'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},{'name':'New York','flag':'1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},{'name':'North Carolina','flag':'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},{'name':'North Dakota','flag':'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},{'name':'Ohio','flag':'4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},{'name':'Oklahoma','flag':'6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},{'name':'Oregon','flag':'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},{'name':'Pennsylvania','flag':'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},{'name':'Rhode Island','flag':'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},{'name':'South Carolina','flag':'6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},{'name':'South Dakota','flag':'1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},{'name':'Tennessee','flag':'9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},{'name':'Texas','flag':'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},{'name':'Utah','flag':'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},{'name':'Vermont','flag':'4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},{'name':'Virginia','flag':'4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},{'name':'Washington','flag':'5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},{'name':'West Virginia','flag':'2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},{'name':'Wisconsin','flag':'2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},{'name':'Wyoming','flag':'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}];

	// Any function returning a promise object can be used to load values asynchronously
	$scope.getLocation = function(val) {
	//return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
	return $http.get('http://10.44.41.185/coppelcanadaajs/apps/canada/modulos/_models/buscacliente/buscacliente.php?opcion=CURL', {
	  params: {
		search: val,
		//address: val,
		
		sensor: false
	  }
	}).then(function(res){

	  var titles = [];
	  //angular.forEach(res.data.results, function(item){
	  angular.forEach(res.data, function(item){
		
		var nombre=item.value.toProperCase();		
		nombre=nombre.replace("#","ñ");
		nombre=nombre.replace("#","ñ");
		titles.push({"title":nombre,"type":item.cliente[0],"nombre":nombre});
	  });
	  return titles;
	});
}

//	$scope.clientes=[
//		{ 
//			nombre:"Adan Carrasco", 
//			numeroCliente:12345, 
//			domicilio:
//				{
//					calle:"Miguel Hidalgo",
//					colonia:" Obrero",
//					numero:"31245"
//				}
//			,
//			telefono:"667-1023456",
//			puntualidad:"N"
//		},
//		{ 
//			nombre:"Esteban Ocampo", 
//			numeroCliente:98765, 
//			domicilio:
//				{
//					calle:"Laureles",
//					colonia:" Viveros",
//					numero:"23455"
//				}
//			,
//			telefono:"667-1987090",
//			puntualidad:"Z"
//		},
//		{ 
//			nombre:"Jesus S Felix Felix", 
//			numeroCliente:544663, 
//			domicilio:
//				{
//					calle:"Conocido",
//					colonia:" Mexicana",
//					numero:"11111"
//				}
//			,
//			telefono:"667-1987090",
//			puntualidad:"A"
//		}
//	];

	$scope.enviarCliente=function(cliente){
		//ESTA PENDIENTE REVISAR DE DONDE SE INVOCA BUSCAR CLIENTE (VENTA O ABONO)

		//DESPUES DEL SUCCESS DE RESPUESTA DEL WS REDIRECCIONAR
		
		var response={};
		response.data=cliente;
		//console.log(cliente);
		if(!cliente){
			//console.log("mlp");
			response.data={title:"CONTADO", type:"90001", nombre:"Contado"};
		}
		
			

		localStorageService.set('cliente',JSON.stringify(response.data));

		$http({
			method: 'POST',			
			url:'http://10.44.63.167:8080/wsCoppelCanada/services/venta/obtenerfoliopreventa',
			//headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			headers:{'Content-Type': 'application/json; charset=utf-8'},
			//data:$.param({opcion:'BUSCAFORMAPAGOS'}),		
			data:{
					numeroTienda:800,
					numeroCaja:2,
					usuarioSistema:91680727,
					token:localStorageService.get('token')

				},		
		}).success(function(data, status) {

			//console.log(data);
			localStorageService.set('token',data.token);
			localStorageService.set('folioPreventa',data.folioPreventa);
			
			$scope.abrirVenta(response.data);			
			
		}).error(function(data, status) {			
		});
		
			
	};
	
	$scope.abrirVenta=function(cliente){
		
		//console.log(cliente);
		
		var numeroCliente={numero:cliente.type};
		var userData=localStorageService.get('userData');
		var parametros={
			cliente:numeroCliente,
			folioPreventa:localStorageService.get('folioPreventa'),
			usuarioSistema:userData.usuarioSistema,
			numeroTienda:userData.numeroTienda,
			numeroCaja:userData.numeroCaja,
			token:localStorageService.get('token')
		}
		$http({
			method: 'POST',			
			url:'http://10.44.63.167:8080/wsCoppelCanada/services/venta/consultargeneralclienteVenta',
			//headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			headers:{'Content-Type': 'application/json; charset=utf-8'},
			//data:$.param({opcion:'BUSCAFORMAPAGOS'}),		
			data:parametros,		
		}).success(function(data, status) {

			//console.log(data);
			localStorageService.set('token',data.token);
			localStorageService.set('clienteData',JSON.stringify(data));
			$location.path('/venta');
			
		}).error(function(data, status) {			
		});
	};
		
});