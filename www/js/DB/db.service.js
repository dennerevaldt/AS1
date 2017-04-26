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
            executeQuery: executeQuery,
            setDB: setDB
        };

        return service;

        function init(db) {
          dbase = db;
          var query = "";

          // TABLE USERS
          query = "CREATE TABLE IF NOT EXISTS USERS (user_id INTEGER primary key AUTOINCREMENT NOT NULL, "
                  + "email TEXT NOT NULL, "
                  + "name TEXT NOT NULL, "
                  + "pwd TEXT NOT NULL)";

          $cordovaSQLite.execute(db, query, [])
            .then(function (res) {
               console.log("Tabela USERS foi criada!");
            }, function (err) {
               console.error("ERRO AO CRIAR TABELA USERS: " + JSON.stringify(err));
            });

          // TABLE PUBLICATIONS
          query = "CREATE TABLE IF NOT EXISTS PUBLICATIONS (publication_id INTEGER primary key NOT NULL, "
                  + "description TEXT NOT NULL, "
                  + "image TEXT NOT NULL, "
                  + "private INTEGER NOT NULL, "
                  + "user_id INTEGER NOT NULL, FOREIGN KEY (user_id) REFERENCES USERS (user_id))";

          $cordovaSQLite.execute(db, query, [])
            .then(function (res) {
               console.log("Tabela de PUBLICATIONS foi criada!");
            }, function (err) {
               console.error("ERRO AO CRIAR TABELA PUBLICATIONS: " + JSON.stringify(err));
            });

            // TABLE FRIENDS
            query = "CREATE TABLE IF NOT EXISTS FRIENDS ("
                    + "accept INTEGER NOT NULL, "
                    + "id_follower integer NOT NULL, "
                    + "id_followed integer NOT NULL, "
                    + "FOREIGN KEY (id_follower) REFERENCES USERS (user_id), "
                    + "FOREIGN KEY (id_followed) REFERENCES USERS (user_id), "
                    + "PRIMARY KEY (id_follower, id_followed))";

            $cordovaSQLite.execute(db, query, [])
              .then(function (res) {
                console.log("Tabela de FRIENDS foi criada!");
              }, function (err) {
                console.error("ERRO AO CRIAR TABELA FRIENDS: " + JSON.stringify(err));
              });

        }

        function reset(db) {
          var query = "DROP TABLE USERS";
          $cordovaSQLite.execute(db, query, [])
            .then(function (res) {
               console.log("Tabela USERS foi apagada!");
            }, function (err) {
               console.error("ERRO AO APAGAR TABELA USERS: " + JSON.stringify(err));
            });

          var query = "DROP TABLE FRIENDS";
          $cordovaSQLite.execute(db, query, [])
            .then(function (res) {
               console.log("Tabela FRIENDS foi apagada!");
            }, function (err) {
               console.error("ERRO AO APAGAR TABELA FRIENDS: " + JSON.stringify(err));
            });

          var query = "DROP TABLE PUBLICATIONS";
          $cordovaSQLite.execute(db, query, [])
            .then(function (res) {
               console.log("Tabela PUBLICATIONS foi apagada!");
            }, function (err) {
               console.error("ERRO AO APAGAR TABELA PUBLICATIONS: " + JSON.stringify(err));
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

        function setDB(db) {
          dbase = db;
        }
    }
})();
