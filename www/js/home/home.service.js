(function() {
    'use strict';

    angular
        .module('app.dpa.home')
        .factory('HomeService', HomeService);

    HomeService.$inject = ['$http', '$q', 'DBService', 'LoginService'];

    /* @ngInject */
    function HomeService($http, $q, DBService, LoginService) {
        var publications = [];

        var service = {
            getBase64: getBase64,
            getPublications: getPublications,
            getFriends: getFriends,
            populatePublications: populatePublications,
            populateFriends: populateFriends,
            removeFriend: removeFriend,
            addFriend: addFriend,
            addContact: addContact,
            acceptFriend: acceptFriend,
            savePost: savePost,
            getNotifications: getNotifications
        };

        return service;

        function getBase64(file) {
          var deferred = $q.defer();
          var reader = new FileReader();
          var promise = reader.readAsDataURL(file);
          reader.onload = function () {
              deferred.resolve(reader.result);
          };
          reader.onerror = function (error) {
              deferred.reject(error);
          };
          return deferred.promise;
        }

        function getPublications() {
          var deferred = $q.defer();
          var pubReturn = [];
          var query = "SELECT * FROM PUBLICATIONS p INNER JOIN USERS u ON u.user_id = p.user_id ORDER BY publication_id DESC";
          var params = [];

          DBService.executeQuery(query, params)
            .then(function (results) {
              for (var i = 0; i < results.rows.length; i++) {
                pubReturn.push({
                  user: {
                    id: results.rows.item(i).user_id,
                    name: results.rows.item(i).name,
                    email: results.rows.item(i).email
                  },
                  publication: {
                    image: results.rows.item(i).image,
                    private: results.rows.item(i).private === 1 ? true : false,
                    text: results.rows.item(i).description
                  }
                });
              }
              deferred.resolve(pubReturn);
            }, function (err) {
              console.log('ERROR GET PUBLICATIONS >>', JSON.stringify(err));
            });

          return deferred.promise;
        }

        function getFriends(userLogged) {
          var deferred = $q.defer();
          var frdReturn = [];
          var query = "SELECT * FROM FRIENDS f INNER JOIN USERS u ON u.user_id = f.id_followed WHERE f.id_follower = ? AND f.accept = ?";
          var params = [userLogged.user_id, 1];

          DBService.executeQuery(query, params)
            .then(function (results) {
              for (var i = 0; i < results.rows.length; i++) {
                frdReturn.push({
                  accept: results.rows.item(i).accept === 1 ? true : false,
                  email: results.rows.item(i).email,
                  name: results.rows.item(i).name,
                  user_id: results.rows.item(i).user_id
                });
              }
              deferred.resolve(frdReturn);
            }, function (err) {
              console.log('ERROR GET FRIENDS >>', JSON.stringify(err));
            });

          return deferred.promise;
        }

        function populatePublications(publications) {
          publications.map(function(item) {
            var query = "INSERT INTO PUBLICATIONS (description, image, private, user_id) VALUES (?, ?, ?, ?)";
            var params = [item.publication.text, item.publication.image, item.publication.private ? 1 : 0, item.user.id];

            DBService.executeQuery(query, params)
              .then(function(resp) {
                console.log("INSERT PUBLICATIONS: " + JSON.stringify(resp));
              }, function err(err) {
                console.log("ERROR INSERT PUBLICATIONS: " + JSON.stringify(err));
              });
          });
        }

        function populateFriends(items) {
          items.map(function(user) {
            var query = "INSERT INTO FRIENDS (accept, id_follower, id_followed) VALUES (?, ?, ?)";
            var params = [user.accept, user.user_id, user.user_id_followed];

            DBService.executeQuery(query, params)
              .then(function(resp) {
                console.log("INSERT FRIENDS: " + JSON.stringify(resp));
              }, function err(err) {
                console.log("ERROR INSERT FRIENDS: " + JSON.stringify(err));
              });
          });
        }

        function savePost(post) {
          var query = "INSERT INTO PUBLICATIONS (description, image, private, user_id) VALUES (?, ?, ?, ?)";
          var params = [post.publication.text, post.publication.image, post.publication.private ? 1 : 0, post.user.user_id];

          DBService.executeQuery(query, params)
            .then(function(resp) {
              console.log("INSERT PUBLICATION: " + JSON.stringify(resp));
            }, function err(err) {
              console.log("ERROR INSERT PUBLICATION: " + JSON.stringify(err));
            });
        }

        function removeFriend(item, userLogged) {
          var query = "DELETE FROM FRIENDS WHERE id_followed = ? AND id_follower = ?";
          var params = [item.user_id, userLogged.user_id];

          DBService.executeQuery(query, params)
            .then(function(resp) {
              console.log("REMOVE FRIEND: " + JSON.stringify(resp));
            }, function err(err) {
              console.log("ERROR REMOVE FRIEND: " + JSON.stringify(err));
            });

          var query = "DELETE FROM FRIENDS WHERE id_followed = ? AND id_follower = ?";
          var params = [userLogged.user_id, item.user_id];

          DBService.executeQuery(query, params)
            .then(function(resp) {
              console.log("REMOVE FRIEND: " + JSON.stringify(resp));
            }, function err(err) {
              console.log("ERROR REMOVE FRIEND: " + JSON.stringify(err));
            });
        }

        function addFriend(item, userLogged, acc) {
          var query = "INSERT INTO FRIENDS (accept, id_follower, id_followed) VALUES (?, ?, ?)";
          var params = [acc ? 1 : 0, userLogged.user_id, item.user_id];

          DBService.executeQuery(query, params)
            .then(function(resp) {
              console.log("INSERT FRIENDS: " + JSON.stringify(resp));
            }, function err(err) {
              console.log("ERROR INSERT FRIENDS: " + JSON.stringify(err));
            });
        }

        function addContact(item, userLogged) {
          LoginService.createAccount(item.name, item.email.toLowerCase(), '123456')
            .then(function(user) {
              var query = "INSERT INTO FRIENDS (accept, id_follower, id_followed) VALUES (?, ?, ?)";
              var params = [1, userLogged.user_id, user.user_id];

              DBService.executeQuery(query, params)
                .then(function(resp) {
                  console.log("INSERT FRIENDS: " + JSON.stringify(resp));
                }, function err(err) {
                  console.log("ERROR INSERT FRIENDS: " + JSON.stringify(err));
                });
            }, function(err) {
              console.log("ERROR INSERT USER: " + JSON.stringify(err));
            });
        }

        function acceptFriend(item, userLogged) {
          var query = "UPDATE FRIENDS SET accept = ? WHERE id_follower = ?";
          var params = [1, item.user_id];

          DBService.executeQuery(query, params)
            .then(function(resp) {
              addFriend(item, userLogged, true);
            }, function err(err) {
              console.log("ERROR ACCEPT FRIENDS: " + JSON.stringify(err));
            });
        }

        function getNotifications(userLogged) {
          var deferred = $q.defer();
          var arrNot = [];
          var query = "SELECT * FROM FRIENDS f INNER JOIN USERS u ON u.user_id = f.id_follower WHERE f.id_followed = ? AND f.accept = ?";
          var params = [userLogged.user_id, 0];

          DBService.executeQuery(query, params)
            .then(function (results) {
              for (var i = 0; i < results.rows.length; i++) {
                arrNot.push({
                  user_id: results.rows.item(i).user_id,
                  accept: results.rows.item(i).accept === 1 ? true : false,
                  email: results.rows.item(i).email,
                  name: results.rows.item(i).name
                });
              }
              deferred.resolve(arrNot);
            }, function (err) {
              console.log('ERROR GET NOTIFICATIONS: ', JSON.stringify(err));
            });

          return deferred.promise;
        }
    }
})();
