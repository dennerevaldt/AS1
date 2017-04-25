(function() {
    'use strict';

    angular
        .module('app.dpa.db')
        .factory('DBService', DBService);

    DBService.$inject = ['$cordovaSQLite', '$q'];

    /* @ngInject */
    function DBService($cordovaSQLite, $q) {
        var dbase;

        var service = {
            init: init,
            reset: reset,
            executeQuery: executeQuery
        };

        return service;

        function init(db) {
          dbase = db;
          var query = "";

          query = "CREATE TABLE IF NOT EXISTS USERS (user_id integer primary key AUTOINCREMENT NOT NULL, "
                  + "email TEXT NOT NULL, "
                  + "name TEXT NOT NULL, "
                  + "pwd TEXT NOT NULL)";

          $cordovaSQLite.execute(db, query, [])
            .then(function (res) {
               console.log("Tabela USERS foi criada!");
            }, function (err) {
               console.error("ERRO AO CRIAR TABELA USERS: " + JSON.stringify(err));
            });

          // console.log(">>>>>>> Tabela de FRIENDS");
          // query = "CREATE TABLE IF NOT EXISTS FRIENDS (friend_id integer primary key NOT NULL, "
          //         + "accept TEXT NOT NULL, "
          //         + "email TEXT NOT NULL, "
          //         + "name TEXT NOT NULL, "
          //         + "user_name_father TEXT NOT NULL, "
          //         + "user_email_father TEXT NOT NULL)";
          //
          // $cordovaSQLite.execute(db, query, [])
          //   .then(function (res) {
          //      console.log("Tabela de FRIENDS foi criada!");
          //   }, function (err) {
          //      console.error("ERRO AO CRIAR TABELA FRIENDS: " + JSON.stringify(err));
          //   });
          //
          //   console.log(">>>>>>> Tabela de PUBLICATIONS");
          //   query = "CREATE TABLE IF NOT EXISTS PUBLICATIONS (publication_id integer primary key NOT NULL, "
          //           + "accept TEXT NOT NULL, "
          //           + "email TEXT NOT NULL, "
          //           + "name TEXT NOT NULL, "
          //           + "user_name_father TEXT NOT NULL, "
          //           + "user_email_father TEXT NOT NULL)";
          //
          //   $cordovaSQLite.execute(db, query, [])
          //     .then(function (res) {
          //        console.log("Tabela de PUBLICATIONS foi criada!");
          //     }, function (err) {
          //        console.error("ERRO AO CRIAR TABELA PUBLICATIONS: " + JSON.stringify(err));
          //     });

        }

        function reset(db) {
          var query = "DROP TABLE USERS";
          $cordovaSQLite.execute(db, query, [])
            .then(function (res) {
               console.log("Tabela USERS foi apagada!");
            }, function (err) {
               console.error("ERRO AO APAGAR TABELA USERS: " + JSON.stringify(err));
            });
        }

        function executeQuery(query, params) {
          var deferred = $q.defer();
          $cordovaSQLite.execute(dbase, query, params)
            .then(function (res) {
              deferred.resolve(res);
            }, function(err) {
              deferred.reject(err);
            });
          return deferred.promise;
        }

    }
})();
