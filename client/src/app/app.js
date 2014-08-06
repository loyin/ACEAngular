angular.module('app', [
  'ngRoute','ngResource',
  'ngGrid',
  'home',
  'services.breadcrumbs',
  'services.i18nNotifications',
  'services.httpRequestTracker',
  'security',
  'directives.crud',
  'templates.app','LocalStorageModule',
  'templates.common','ngSanitize',
  'ui.bootstrap','ui.utils','treeControl','treeview',
  'dashboard','tablessd'
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
        name: "Dashboard", 
        uri:"dashboard" , 
        icon:'icon-dashboard',
        nodes: [],
        show:false,
        active:false
      },
      {
        name:"Tables",
        uri:"",
        icon:'icon-list',
        nodes:[
          {
            name:"Simple & Dynamic",
            uri:"tables/simple_dinamic",
            nodes:[],
            show:false,
            active:false
          },
          {
            name:"jqGrid Plugin",
            uri:"tables/jqgrid",
            nodes:[],
            show:false,
            active:false
          }
        ],
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