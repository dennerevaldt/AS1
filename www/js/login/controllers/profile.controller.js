(function() {
    'use strict';

    angular
        .module('app.dpa.login')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$cookieStore', '$state', 'LoginService'];

    /* @ngInject */
    function ProfileController($cookieStore, $state, LoginService) {
        var vm = this;
        vm.userLogged = $cookieStore.get('socialCookieUni');
        vm.logout = logout;

        /////////

        function logout() {
          LoginService.clearCredentials();
          $state.go('login');
        }
    }
})();
