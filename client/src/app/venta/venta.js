angular.module('venta', [])
.config(['$routeProvider', function ($routeProvider)
  {
    $routeProvider.when('/venta', {
      templateUrl:'venta/venta.tpl.html',
      controller:'VentasViewCtrl'

    });
  }
  ])
.controller('VentasViewCtrl',function($scope, $http, $location,localStorageService, $modal, $log, menuCollapse){
	$scope.$watch(function () {
		var value=menuCollapse.getInfo();
		//console.log("actualValue:"+value);
		return value
	},
	function (newValue,oldValue) {
		//console.log('newValue: '+newValue)
		if (newValue != oldValue){
			$scope.collapseMenu = newValue;
			console.log("cambio");
			gridLayoutPlugin.updateGridLayout();
		}
	});
	
	$scope.tabs = [
		{ title:'Venta', content:'' }		
	];
	
	$scope.venta={};
	//$scope.venta.foot='/venta/ventafoot.tpl.html';
	
	//SECCION CLIENTE
	$scope.cliente=localStorageService.get('cliente');
	$scope.clienteData=localStorageService.get('clienteData');
	$scope.puntualidades={
		"A":'badge-success',
		"B":"badge-yellow",
		"C":"badge-warning",
		"D":"badge-warning",
		"N":"badge-info",
		"Z":"badge-danger"
	};		
	$scope.cliente.badge=$scope.puntualidades[$scope.clienteData.puntualidad];
	
	
	//SECCION SKU
	$scope.articulo={};
	$scope.articuloData={};
	$scope.articulo.sku="";
	
	$scope.soymuebles=false;
	
	
	$scope.showSku=function(){
		$scope.articulo.descripcionEstadoNoVende=false;
		$scope.articuloData={};
		
		var nsku=$.trim($scope.articulo.sku);
		if(nsku.length>0){
			var userData=localStorageService.get('userData');
			var parametros={
				codigoArticulo:$scope.articulo.sku,
				folioPreventa:localStorageService.get('folioPreventa'),
				usuarioSistema:userData.usuarioSistema,
				numeroTienda:userData.numeroTienda,				
				token:localStorageService.get('token')
			}
//			$parametros= array(			
//			'usuarioSistema'=>$_SESSION['SCC_nemp'],
//			'numeroTienda'=>$_SESSION['SCC_tienda'],			
//			'token'=>$_SESSION['SCC_token'],
//			'codigoArticulo'=>$_POST['sku'],
//			'folioPreventa'=>$_SESSION['SCC_foliopreventa']			
//		);
			
			$http({
				method: 'POST',			
				//url:'_models/venta/ventas.php',
				//url:'_models/venta/ventasREST.php',
				url:'http://10.44.63.167:8080/wsCoppelCanada/services/venta/consultaarticulo',
				headers:{'Content-Type': 'application/json; charset=utf-8'},
				data:parametros		
			  }).success(function(data, status) {
				
				//console.log(data);
				console.log(data.opcionEstadoNoVende);
				if(data.opcionEstadoNoVende){					
					$scope.articulo.descripcionEstadoNoVende=data.descripcionEstadoNoVende;
				}else{
					//SI ES MUEBLES
					if(data.area<2 && data.area>0){
						//habilitar cantidad y tipo entrega
						$scope.soymuebles=true;
						$scope.articuloData=data;
						
					}else{
						$scope.insertarSkus(data);
					}
				}
				
			  }).error(function(data, status) {			
			});
		}else{
			return false;
		}
	};
	
	//FUNCION AGREGAR ARTTICULO
	$scope.insertarSkus=function(data){
		console.log("agregar");
		console.log(data);
		//$scope.gridArticulos.push({"orden":0, "entrega":"T","sku":1234,"descripcion":"TV HD SONY","cantidad":1,"punitario":1000,"importe":1000,"descto":"0%","tcontado":1000,"area":"Muebles"});
		
	}
	
	
	//SECCION VENDEDOR
	$scope.vendedor={};
	$scope.vendedorData={};
	$scope.vendedor.numeroVendedor="";
	$scope.vendedor.input=true;
	
	$scope.showVendedor=function(){		
		var nvendedor=$.trim($scope.vendedor.numeroVendedor);
		if(nvendedor.length>0) {			
			var userData=localStorageService.get('userData');
			var parametros={
					empleado:{numeroVendedor:nvendedor},			
					numeroTienda:userData.numeroTienda			
				};			
			$http({
				method: 'POST',
				//url:'_models/venta/ventasREST.php',
				url:'http://10.44.63.167:8080/wsCoppelCanada/services/empleados/consultanumerovendedor',
				//headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				headers:{'Content-Type': 'application/json; charset=utf-8'},
				data:parametros
			  }).success(function(data, status) {							

				//console.log(data);
				$scope.vendedorData=data;
				$scope.vendedorData.numeroVendedor=$scope.vendedor.numeroVendedor;
				console.log(data.numeroEmpleado>0);
				
				if(data.numeroEmpleado>0){
					$scope.vendedor.input=false;
				}
				
				
			  }).error(function(data, status) {			
			});
		}else{
			
		}
		
	};
	

	//SECCION MODALES
	$scope.items = ['item1', 'item2', 'item3'];
	$scope.showAModal = function (size) {

		var modalInstance = $modal.open({
		  templateUrl: 'formasdepago/formasdepago.tpl.html',
		  controller: FormasDePagoCtrl,
		  size: size,
		  resolve: {
		    items: function () {
		      return $scope.items;
		    }
		  }
		});

		modalInstance.result.then(function (selectedItem) {
		  $scope.selected = selectedItem;
		}, function () {
		  $log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	//SECCION GRID-CONTROLLERS
	var gridLayoutPlugin = new ngGridLayoutPlugin();
	$scope.gridArticulos=[];
	var myHeaderCellTemplate = '<div ng-click="col.sort()" ng-class="{ ngSorted: !noSortVisible }">'+
                               '<span class="ngHeaderText"><i class="icon-truck"></i> {{col.displayName}}</span>'+
                               '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>'+
                               '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>'+
                             '</div>'+
                             '<div ng-show="col.allowResize" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';
	
	$scope.gridOptions = {
		plugins: [gridLayoutPlugin],
		data: 'venta.skus',
		multiSelect: false,
		groups:["area"],
		groupsCollapsedByDefault:false,
		columnDefs: [
				{field: 'entrega', displayName: 'Entrega', width:'7%',headerCellTemplate: myHeaderCellTemplate}
				,{field:'sku', displayName:'SKU', width:'7%'}
				,{field:'descripcion', displayName:'Descripción'}
				,{field:'cantidad', displayName:'Cant', width:'7%'}
				,{field:'punitario', displayName:'P. Unitario', width:'7%'}
				,{field:'importe', displayName:'Importe',width:'7%'}
				,{field:'descto', displayName:'Descto',visible:false}
				,{field:'tcontado', displayName:'Total',width:'7%'}
				,{field:'area', displayName:'Area',width:'2%', visible: false}

		],
		selectedItems: $scope.dataSelectedM,
		afterSelectionChange: function (rowItem, event) {
				$scope.indexDataSelectedM.index=rowItem.rowIndex;
		}
	};        

	$scope.$watch('displayEditForm', function() {
		//gridLayoutPlugin.updateGridLayout();
	});

});


//
////CONTROLADRO DEL NG-GRID
//var ngGridCtrl = function ($scope) {
//	$scope.welcome=function(){
//		console.log("welcome");
//   };
//	$scope.venta={};
//	$scope.venta.skus;
////	$scope.venta.skus=[
////		{"entrega":"T","sku":1234,"descripcion":"TV HD SONY","cantidad":1,"punitario":1000,"importe":1000,"descto":"0%","tcontado":1000,"area":"Muebles"},
////		{"entrega":"T","sku":5678,"descripcion":"LAVADORA DAEWOO","cantidad":1,"punitario":1000,"importe":1000,"descto":"0%","tcontado":1000,"area":"Muebles"},
////		{"entrega":"T","sku":345,"descripcion":"CHAMARRA PIEL TOMMY","cantidad":1,"punitario":1000,"importe":1000,"descto":"0%","tcontado":1000,"area":"Ropa"},
////	];
//	
//
//var myHeaderCellTemplate = '<div ng-click="col.sort()" ng-class="{ ngSorted: !noSortVisible }">'+
//                               '<span class="ngHeaderText"><i class="icon-truck"></i> {{col.displayName}}</span>'+
//                               '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>'+
//                               '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>'+
//                             '</div>'+
//                             '<div ng-show="col.allowResize" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';
//   $scope.gridOptions = { 
//		data: 'venta.skus',
//		multiSelect: false,
//		groups:["area"],
//		groupsCollapsedByDefault:false,
//		columnDefs: [
//			{field: 'entrega', displayName: 'Entrega', width:'7%',headerCellTemplate: myHeaderCellTemplate}
//			,{field:'sku', displayName:'SKU', width:'7%'}
//			,{field:'descripcion', displayName:'Descripción'}
//			,{field:'cantidad', displayName:'Cant', width:'7%'}
//			,{field:'punitario', displayName:'P. Unitario', width:'7%'}
//			,{field:'importe', displayName:'Importe',width:'7%'}
//			,{field:'descto', displayName:'Descto',width:'7%'}
//			,{field:'tcontado', displayName:'Total',width:'7%'}
//			,{field:'area', displayName:'Area',width:'2%', visible: false}
//			
//		],
//		selectedItems: $scope.dataSelectedM,
//		afterSelectionChange: function (rowItem, event) {
//			$scope.indexDataSelectedM.index=rowItem.rowIndex;
//		}
//	};	
//  
//};