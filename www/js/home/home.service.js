(function() {
    'use strict';

    angular
        .module('app.dpa.home')
        .factory('HomeService', HomeService);

    HomeService.$inject = ['$http', '$q'];

    /* @ngInject */
    function HomeService($http, $q) {
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
            setTimeout(function() {
              var frdReturn = [];
              friends.map(function(item) {
                  if (item.user_email_father === userLogged.email && item.accept === true) {
                      frdReturn.push(item);
                  }
              });
              deferred.resolve(frdReturn);
            }, 200);
            return deferred.promise;
        }

        function populatePublications(items) {
            publications = items;
        }

        function populateFriends(items) {
            friends = items;
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
            var obj = {
                accept: acc ? true : false,
                email: item.email,
                name: item.name,
                user_name_father: userLogged.name,
                user_email_father: userLogged.email
            };
            friends.push(obj);
        }

        function acceptFriend(item, userLogged) {
          var index = friends.indexOf(item);
          friends[index].accept = true;
          addFriend({email: item.user_email_father, name: item.user_name_father}, userLogged, true);
        }

        function rejectFriend(item) {
          var index = friends.indexOf(item);
          friends.splice(index, 1);
        }

        function getNotifications(userLogged) {
          var deferred = $q.defer();
          var not = friends.filter(function(item) {
            return item.email === userLogged.email && item.accept === false;
          });
          deferred.resolve(not);
          return deferred.promise;
        }
    }
})();
