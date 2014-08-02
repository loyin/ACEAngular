// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.service', [
  'security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
  'security.login'        // Contains the login form template and controller
])

.factory('security', ['$http', '$q', '$location', 'securityRetryQueue',
function($http, $q, $location, queue, $dialog, localStorageService) {



  // Redirect to the given url (defaults to '/')
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  // Login form dialog stuff
  var loginDialog = null;
  function openLoginDialog() {
    if ( loginDialog ) {
      throw new Error('Trying to open a dialog that is already open!');
    }
    loginDialog = $dialog.dialog();
    loginDialog.open('security/login/form.tpl.html', 'LoginFormController').then(onLoginDialogClose);
  }
  function closeLoginDialog(success) {
    if (loginDialog) {
      loginDialog.close(success);
    }
  }
  function onLoginDialogClose(success) {
    loginDialog = null;
    if ( success ) {
      queue.retryAll();
    } else {
      queue.cancelAll();
      redirect();
    }
  }

  // Register a handler for when an item is added to the retry queue
  queue.onItemAddedCallbacks.push(function(retryItem) {
    if ( queue.hasMore() ) {
      service.showLogin();
    }
  });

  // The public API of the service
  var service = {
    photo: '',
    // Get the first reason for needing a login
    getLoginReason: function() {
      return queue.retryReason();
    },

    // Show the modal login dialog
    showLogin: function() {
      openLoginDialog();
    },

    // Attempt to authenticate a user by the given email and password
    login: function(numeroEmpleado) {
      // var request = $http.post('/login', {email: email, password: password});
      // return request.then(function(response) {
      //   service.currentUser = response.data.user;
      //   if ( service.isAuthenticated() ) {

      //     // Start fresh
      //     localStorageService.clearAll();
      //     localStorageService.set('token',JSON.stringify(response.data));
      //     //console.log(response.data.user.numeroEmpleado);

      //     service.photo = 'http://10.44.15.147/hojaazul/fotos/'+response.data.user.numeroEmpleado+'.jpg';
      //     //console.log(service);
      //     closeLoginDialog(true);
      //   }
      // });
      
      // var request = $http.post('http://localhost/coppelcanadaajs/ws/login.php', {numeroEmpleado: numeroEmpleado});
      // return request.then(function(response) {
      //   service.currentUser = response.data.user;
      //   if ( service.isAuthenticated() ) {

      //     // Start fresh
      //     localStorageService.clearAll();
      //     localStorageService.set('token',JSON.stringify(response.data));
      //     //console.log(response.data.user.numeroEmpleado);

      //     service.photo = 'http://10.44.15.147/hojaazul/fotos/'+response.data.user.numeroEmpleado+'.jpg';
      //     //console.log(service);
      //     closeLoginDialog(true);
      //   }
      // });

      return $http.get('http://localhost/coppelcanadaajs/ws/login.php').then(function(response){
          
          //console.log(response);
          service.currentUser=response.data;
        });
    },

    // Give up trying to login and clear the retry queue
    cancelLogin: function() {
      closeLoginDialog(false);
      redirect();
    },

    // Logout the current user and redirect
    logout: function(redirectTo) {
      
      service.currentUser = null;
      redirect("/login");

      // $http.post('/logout').then(function() {
      //   service.currentUser = null;
      //   redirect(redirectTo);
      // });
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser);
      } else {


        // return $http.get('http://localhost/coppelcanadaajs/ws/login.php').then(function(response){
          
        //   console.log(response);
        //   service.currentUser=response.data;
        // });

      redirect("/login");

        // return $http.get('/current-user').then(function(response) {
        //   service.currentUser = response.data.user;
        //   return service.currentUser;
        // });

      }
    },

    // Information about the current user
    currentUser: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      //console.log(!!service.currentUser);
      return !!service.currentUser;
    },

    // Is the current user an adminstrator?
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.admin);
    }
  };

  return service;
}]);
