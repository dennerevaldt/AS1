(function() {
    'use strict';

    angular
        .module('app.dpa.home')
        .factory('HomeService', HomeService);

    HomeService.$inject = ['$http', '$q', 'DBService'];

    /* @ngInject */
    function HomeService($http, $q, DBService) {
        var publications = [];
        var friends = [];

        var service = {
            getBase64: getBase64,
            getPublications: getPublications,
            getFriends: getFriends,
            populatePublications: populatePublications,
            populateFriends: populateFriends,
            removeFriend: removeFriend,
            addFriend: addFriend,
            acceptFriend: acceptFriend,
            rejectFriend: rejectFriend,
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
            setTimeout(function() {
              deferred.resolve(publications);
            }, 200);
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
                  name: results.rows.item(i).name
                });
              }
              deferred.resolve(frdReturn);
            }, function (err) {
              console.log('ERROR GET FRIENDS >>', JSON.stringify(err));
            });

          return deferred.promise;
        }

        function populatePublications(items) {
            publications = items;
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
            publications.unshift(post);
        }

        function removeFriend(item, userLogged) {
            var index = friends.indexOf(item);
            friends.splice(index, 1);
            friends.map(function(friend) {
                if(friend.user_email_father === item.email) {
                  var i = friends.indexOf(friend);
                  friends.splice(i, 1);
                }
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

        function acceptFriend(item, userLogged) {
          var query = "UPDATE FRIENDS SET accept = ? WHERE id_followed = ?";
          var params = [1, item.user_id];

          DBService.executeQuery(query, params)
            .then(function(resp) {
              addFriend(item, userLogged, true);
            }, function err(err) {
              console.log("ERROR ACCEPT FRIENDS: " + JSON.stringify(err));
            });
        }

        function rejectFriend(item) {
          var index = friends.indexOf(item);
          friends.splice(index, 1);
        }

        function getNotifications(userLogged) {
          var deferred = $q.defer();
          var arrNot = [];
          var query = "SELECT * FROM FRIENDS f INNER JOIN USERS u ON u.user_id = f.id_followed WHERE f.id_followed = ? AND f.accept = ?";
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
              console.log('ERROR GET NOTIFICATIONS >>', JSON.stringify(err));
            });

          return deferred.promise;
        }
    }
})();
