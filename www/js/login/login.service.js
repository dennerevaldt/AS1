(function() {
    'use strict';

    angular
        .module('app.dpa.login')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$http', '$q', '$cookieStore'];

    /* @ngInject */
    function LoginService($http, $q, $cookieStore) {
        var accounts = [];

        var service = {
            createAccount: createAccount,
            validAccount: validAccount,
            setCredentials: setCredentials,
            clearCredentials: clearCredentials,
            populateUsers: populateUsers,
            searchUser: searchUser
        };

        return service;

        function createAccount(name, email, pwd) {
            var user = accounts.filter( function(item) {
                return item.email === email;
            });
            if (user.length > 0) {
                return undefined;
            } else {
                accounts.push({name: name, email: email, pwd: pwd});
                return {name: name, email: email, pwd: pwd};
            }
        }

        function validAccount(email, pwd) {
            var user = accounts.filter( function(item) {
                return item.email === email && item.pwd === pwd;
            });
            return user.length ? user[0] : undefined;
        }

        function setCredentials (user) {
            $cookieStore.put('socialCookieUni', user);
        }

        function clearCredentials () {
            $cookieStore.remove('socialCookieUni');
        }

        function populateUsers(items) {
          accounts = items;
        }

        function searchUser(email) {
          return accounts.filter( function(item) {
              return item.email === email;
          });
        }
    }
})();
