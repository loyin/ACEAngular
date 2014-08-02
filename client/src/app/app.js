angular.module('app', [
  'ngRoute',
  'ngResource',
  'ngGrid',
  'home',
  'services.breadcrumbs',
  'services.i18nNotifications',
  'services.httpRequestTracker',
  'security',
  'directives.crud','recuperarPreventa',
  'templates.app','LocalStorageModule',
  'templates.common',
  'ui.bootstrap','ui.utils','treeControl','treeview','buscar','parciales','confirmar','venta','formasdepago',
  'modals'
  ]);

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/home'});
}]);

//TODO: move those messages to a separate module
angular.module('app').constant('I18N.MESSAGES', {
  'errors.route.changeError':'Error en cambio de ruta',
  'crud.user.save.success':"Se guardo el usuario con el id '{{id}}'.",
  'crud.user.remove.success':"Se borro el usuario con el id '{{id}}'.",
  'crud.user.remove.error':"Imposible borrar el usuario con el id '{{id}}'.",
  'crud.user.save.error':"Error al guardar el usuario...",
  'crud.project.save.success':"Proyecto guardado con el id '{{id}}'.",
  'crud.project.remove.success':"Proyecto borrado con el id: '{{id}}'.",
  'crud.project.save.error':"Error al guardar el proyecto...",
  'login.reason.notAuthorized':"Sin permisos para ejecutar esta tarea",
  'login.reason.notAuthenticated':"Debes estar logeado para ver esta seccion.",
  'login.error.invalidCredentials': "Error, favor de verificar tus credenciales.",
  'login.error.serverError': "Problemas al autenticarse: {{exception}}."
});

//SECURITY - LOGIN
angular.module('app').run(['security', function(security) {
  // Get the current user when the application starts
  // (in case they are still logged in from a previous session)
  security.requestCurrentUser();
}]);

angular.module('app').controller('AppCtrl', ['$scope','$http', 'localStorageService', 'i18nNotifications','localizedMessages' ,function($scope,$http, localStorageService, i18nNotifications) {
  //console.log($scope);

$scope.notifications = i18nNotifications;

  $scope.removeNotification = function (notification) {
    i18nNotifications.remove(notification);
  };

  $scope.$on('$routeChangeError', function(event, current, previous, rejection){
    i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: rejection});
  });


// var postData = {
//         numeroTienda:800,
//         numeroCaja:2,
// 		usuarioSistema:91680727
//     };

//   $http({
//     method:'POST',
//     //url:'http://localhost/webservices/models/login.php',
// 	//url:'http://10.44.41.185/coppelcanadaajs/apps/canada/models/logmein.php',
// 	url:'http://10.44.63.167:8080/wsCoppelCanada/services/acceso/iniciarsesion',
//     //headers:{'Content-Type': 'application/x-www-form-urlencoded'},
// 	headers:{'Content-Type': 'application/json; charset=utf-8'},
//     data:postData
//     }).success(function(data,status){
      
//       // Start fresh
//           localStorageService.clearAll();
//           localStorageService.set('token',data.token);
// 	  //localStorageService.set('cliente',JSON.stringify(response.data));
	    
// 	  	localStorageService.set('userData',JSON.stringify(postData));

//           console.log(localStorageService.get('token'));

//     }).error(function(data,status){
      

//   });



}]);

angular.module('app').controller('HeaderCtrl',['$scope','$location', '$route', 'security', 'breadcrumbs', 'notifications', 'httpRequestTracker',
  function ($scope, $location, $route, security, breadcrumbs, notifications, httpRequestTracker) {


  $scope.location = $location;
  $scope.breadcrumbs = breadcrumbs;

  $scope.isAuthenticated = security.isAuthenticated;
  $scope.isAdmin = security.isAdmin;

  $scope.home = function () {
    if (security.isAuthenticated()) {
      $location.path('/dashboard');
    } else {
      $location.path('/home');
    }

  };

$scope.clickme=function(){
  //console.log("hola");
};

  $scope.isNavbarActive = function (navBarPath) {
    return navBarPath === breadcrumbs.getFirst().name;
  };

  $scope.hasPendingRequests = function () {
    return httpRequestTracker.hasPendingRequests();
  };

}]);


/**
 * @ngdoc service
 * @name menuCollapse
 * @id service
 * @description Servicio para ocultar y mostrar menu lateral.
 *
 * 
 *
 * ###Additional information
 * You can write something else if you want.
 */
angular.module('app').factory('menuCollapse',function(){
	var data={
		collapseMenu: true
	};
	return {
		getInfo:function(){
			return data.collapseMenu;
		},
		setInfo:function(value){
      console.log("setter:"+value);
			data.collapseMenu=value;
		}
	};
});



angular.module('app').controller('MenuCtrl',['$scope','menuCollapse','security',function($scope, menuCollapse, security){
   //$scope.collapseMenu = true;
	
// $scope.$watch('collapseMenu', function(newValue, oldValue){
//   console.log("escuchando...Nuevo:"+newValue+" Viejo:"+oldValue);
// 	if(newValue != oldValue) menuCollapse.setInfo(newValue);
// });


$scope.$watch(function () {
    var value=menuCollapse.getInfo();
    //console.log("actualValue:"+value);
    $scope.collapseMenu=menuCollapse.getInfo();
    return value
  },
  function (newValue,oldValue) {
    console.log('newValue: '+newValue)
    if(newValue != oldValue) menuCollapse.setInfo(newValue);
  });
	
	
  // $scope.collapseIcons ={
  //   open:'icon-double-angle-left',
  //   closed:'icon-double-angle-right'
  // };

  // $scope.collapseItem=true;

  // $scope.toggleItem=function(){
  //   $scope.collapseItem=!$scope.collapseItem;
  // };

  $scope.isAuthenticated = security.isAuthenticated;

  $scope.toggleMenu=function(){
    //console.log($scope.collapseMenu);
    //$scope.collapseMenu=!$scope.collapseMenu;
    menuCollapse.setInfo(!menuCollapse.getInfo());
    console.log(menuCollapse.getInfo());
    //if($scope.collapseMenu)
  };

}]);

angular.module('app').controller('MenuItemCtrl',['$scope','$http', function($scope, $http) {
    
    $scope.itemActivo=false;

    //ESTRUCTURA DE EJEMPLO PARA GENERAR EL MENU
    $scope.tree = [
      {
        name: "TreeView", 
        uri:"treeview" , 
        nodes: [],
        show:false,
        active:false
      },
      {
        name: "Modals", 
        uri:"modals" , 
        nodes: [],
        show:false,
        active:false
      },
      {
        name: "Ventas",
        uri:"clientes/buscar",
        nodes:[],
        show:false,
        active:false

      },
      {
        name:"Retiros",
        uri:"",
        nodes:[
          {
            name:"Retiros Parciales",
            uri:"retiros/parciales",
            nodes:[],
            show:false,
            active:false
          },
          {
            name:"Confirmar Retiros",
            uri:"retiros/confirmar",
            nodes:[],
            show:false,
            active:false
          }
        ],
        show:false,
        active:false
      },
      {
        name:"Cortes",
        uri:"",
        nodes:[
          {
            name:"Corte I",
            uri:"cortes/parciales",
            nodes:[],
            show:false,
            active:false
          },
          {
            name:"Cortes F",
            uri:"cortes/confirmar",
            nodes:[],
            show:false,
            active:false
          }
        ],
        show:false,
        active:false
      }
    ];
    //AGREGAR PARENT A LOS NODOS RAIZ
    for(key in $scope.tree){
      
      $scope.tree[key].padre=true;
    }
    

    $scope.expandItem=false;


    $scope.expand = function(data) {
      //console.log(data);


      if(data.padre){
        if(data.nodes.length>0){
          $scope.expandItem=!$scope.expandItem;
          data.show=!data.show;
        }else{
          data.active=true;
        }
      }else{
        data.active=true;

      }

      
    };

   //CREAR EL $HTTP HACIA EL SERVICIO PARA QUE REGRESE EL JSON DEL MENU

   //
    
}]);




// angular.module('app').controller('TreeController',['$scope', function($scope) {
//     $scope.delete = function(data) {
//         data.nodes = [];
//     };
//     $scope.add = function(data) {
//         var post = data.nodes.length + 1;
//         var newName = data.name + '-' + post;
//         data.nodes.push({name: newName,nodes: []});
//     };
//     $scope.hasNodes = function(data) {
//         return (data.nodes.length > 0)
//     };
//     $scope.tree = [{name: "Node", nodes: []}];
// }]);


// var ModalDemoCtrl = function ($scope, $modal, $log) {

//   $scope.items = ['item1', 'item2', 'item3'];

//   $scope.open = function (size) {


//     var modalInstance = $modal.open({
//       templateUrl: 'myModalContent.html',
//       controller: ModalInstanceCtrl,
//       size: size,
//       resolve: {
//         items: function () {
//           return $scope.items;
//         }
//       }
//     });

//     modalInstance.result.then(function (selectedItem) {
//       $scope.selected = selectedItem;
//     }, function () {
//       $log.info('Modal dismissed at: ' + new Date());
//     });
//   };
// };

// // Please note that $modalInstance represents a modal window (instance) dependency.
// // It is not the same as the $modal service used above.

// var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

//   $scope.items = items;
//   $scope.selected = {
//     item: $scope.items[0]
//   };

//   $scope.ok = function () {
//     $modalInstance.close($scope.selected.item);
//   };

//   $scope.cancel = function () {
//     $modalInstance.dismiss('cancel');
//   };
// };

