(function() {
    'use strict';

    angular
        .module('app.dpa.login')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$http', '$q', '$cordovaSQLite', 'DBService'];

    /* @ngInject */
    function LoginService($http, $q, $cordovaSQLite, DBService) {
        var accounts = [];

        var service = {
            createAccount: createAccount,
            validAccount: validAccount,
            validSQLite: validSQLite,
            setCredentials: setCredentials,
            clearCredentials: clearCredentials,
            populateUsers: populateUsers,
            searchUser: searchUser
        };

        return service;

        function createAccount(name, email, pwd) {
          var deferred = $q.defer();
          searchUser(email)
            .then(function (result) {

              if (result.rows.length > 0) {
                //reject
                return deferred.reject(undefined);
              }

              // insert
              var query = "INSERT INTO USERS (email, name, pwd) VALUES (?, ?, ?)";
              var params = [email, name, pwd];
              DBService.executeQuery(query, params)
                .then(function(resp) {
                  //resolve
                  return deferred.resolve({
                    user_id: resp.insertId,
                    name: name,
                    email: email
                  });
                });
            }, function(err) {
              console.log("ERROR CREATE USER: " + JSON.stringify(err));
              // reject
              return deferred.reject(undefined);
            });

          return deferred.promise;
        }

        function validAccount(email, pwd) {
          var deferred = $q.defer();
          $http({
            url: 'https://as1-api.herokuapp.com/token',
            method: 'POST',
            data: {username: email, password: pwd}
          }).then(function(resp) {
            //resolve
            deferred.resolve(resp);
          }, function (err) {
            // reject
            deferred.reject(err);
          });
          return deferred.promise;
        }

        function validSQLite(email, pwd) {
          var query = "SELECT * FROM USERS WHERE email = ? AND pwd = ?";
          var params = [email, pwd];

          return DBService.executeQuery(query, params);
        }

        function setCredentials (user) {
          localStorage.setItem('socialCookieUni', JSON.stringify(user));
        }

        function clearCredentials () {
          localStorage.removeItem('socialCookieUni');
        }

        function populateUsers(items) {
          items.map(function(user) {
            var query = "INSERT INTO USERS (email, name, pwd) VALUES (?, ?, ?)";
            var params = [user.email, user.name, user.pwd];

            DBService.executeQuery(query, params)
              .then(function(resp) {
                console.log("INSERT USERS: " + JSON.stringify(resp));
              }, function err(err) {
                console.log("ERROR INSERT USERS: " + JSON.stringify(err));
              });
          });
        }

        function searchUser(email) {
          var query = "SELECT * FROM USERS WHERE email = ?";
          var params = [email];

          return DBService.executeQuery(query, params);
        }
    }
})();
