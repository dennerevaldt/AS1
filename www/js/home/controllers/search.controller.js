(function() {
    'use strict';

    angular
        .module('app.dpa.home')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['LoginService', 'HomeService', '$cookieStore', 'ContactService', '$scope', '$ionicModal'];

    /* @ngInject */
    function SearchController(LoginService, HomeService, $cookieStore, ContactService, $scope, $ionicModal) {
        var vm = this;
        const localUser = localStorage.getItem('socialCookieUni');
        vm.userLogged = JSON.parse(localUser);
        vm.search = search;
        vm.listFriends = [];
        vm.addFriend = addFriend;
        vm.showModalContacts = showModalContacts;
        vm.addContact = addContact;

        activate();

        ////////

        function activate() {
          ContactService.getContacts()
            .then(function(allContacts) {
              vm.listContacts = allContacts;
            });

          // modal options
          $ionicModal.fromTemplateUrl('templates/contactsModal.html', {
            scope: $scope
          }).then(function(modal) {
            vm.modal = modal;
          });
        }

        function search() {
          if (vm.emailSearch) {
            LoginService.searchUser(vm.emailSearch.toLowerCase())
              .then(function(results) {
                for (var i = 0; i < results.rows.length; i++) {
                  vm.listFriends.push({
                    user_id: results.rows.item(i).user_id,
                    name: results.rows.item(i).name,
                    email: results.rows.item(i).email
                  });
                }
              }, function(err) {
                console.log("ERROR SEARCH USER: " + JSON.stringify(err));
              });
          }
        }

        function addFriend(item) {
          HomeService.addFriend(item, vm.userLogged);
          var i = vm.listFriends.indexOf(item);
          vm.listFriends.splice(i, 1);
          vm.emailSearch = '';
        }

        function showModalContacts() {
          vm.modal.show();
        }

        function addContact(contact) {
          HomeService.addFriend(contact, vm.userLogged, true);
          var i = vm.listContacts.indexOf(contact);
          vm.listContacts.splice(i, 1);
        }
    }
})();
