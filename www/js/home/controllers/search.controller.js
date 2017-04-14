(function() {
    'use strict';

    angular
        .module('app.dpa.home')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['LoginService', 'HomeService', '$cookieStore'];

    /* @ngInject */
    function SearchController(LoginService, HomeService, $cookieStore) {
        var vm = this;
        vm.search = search;
        vm.listFriends = [];
        vm.addFriend = addFriend;
        vm.userLogged = $cookieStore.get('socialCookieUni');

        ////////

        function search() {
          if (vm.emailSearch) {
            vm.listFriends = LoginService.searchUser(vm.emailSearch);
          }
        }

        function addFriend(item) {
          HomeService.addFriend(item, vm.userLogged);
          var i = vm.listFriends.indexOf(item);
          vm.listFriends.splice(i, 1);
          vm.emailSearch = '';
        }
    }
})();
