var express = require('express');
var passport = require('passport');
var MongoStrategy = require('./mongo-strategy');
var assert = require('assert');
var restify = require('restify');
var requestIp = require('request-ip');




var app = express();


var filterUser = function(user, req, res, next) {
  if ( user ) {

    console.log("current user when login");


    return user;
  } else {
    var ip = requestIp.getClientIp(req);
    //var ip = "10.44.41.185";
    //var address = "http://10.44.63.167:8080"
    var address = "http://127.0.0.1/coppelcanadaajs/ws";

    var client = restify.createJsonClient({
      url: address,
      version: '~1.0'
    });

    client.post('/login.php',{ipAddress:ip}, function (err, req, res, obj) {
      assert.ifError(err);
      consooe.log(address+'/login.php');
      console.log('Server returned: %j', obj);
    });
    return {
      user : null
    };
  }
};

var security = {
  initialize: function(url, apiKey, dbName, authCollection) {
    passport.use(new MongoStrategy(url, apiKey, dbName, authCollection));
  },
  authenticationRequired: function(req, res, next) {
    console.log('authRequired');
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json(401, filterUser(req.user));
    }
  },
  adminRequired: function(req, res, next) {
    console.log('adminRequired');
    if (req.user && req.user.admin ) {
      next();
    } else {
      res.json(401, filterUser(req.user));
    }
  },
  sendCurrentUser: function(req, res, next) {
    res.json(200, filterUser(req.user,req,res,next));
    res.end();
  },
  login: function(req, res, next) {
    // function authenticationFailed(err, user, info){
    //   if (err) { return next(err); }
    //   if (!user) { return res.json(filterUser(user)); }
    //   req.logIn(user, function(err) {
    //     if ( err ) { return next(err); }
    //     console.log("filterUer:");
    //     return res.json(filterUser(user));
    //   });
    // }

    //MODIFICAR ESTE JSON DE ACUERDO A LA RESPUESTA RESTFUL QUE SE VALLA A NECESITAR
    return res.json(filterUser({
      user:{
        id: 384756,
        email: "adan@coppel.com",
        firstName: "Adan",
        lastName: "Carrasco",
        admin: true,
        numeroCaja:4,
        numeroTienda:800,
        numeroEmpleado:91680727
      }

    }));
    var retLogin = passport.authenticate(MongoStrategy.name, authenticationFailed)(req, res, next);
    //console.log("Return del Login:"+retLogin);
    return retLogin;
  },
  logout: function(req, res, next) {
    req.logout();
    res.send(204);
  }
};

module.exports = security;
