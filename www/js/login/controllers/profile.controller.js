(function() {
    'use strict';

    angular
        .module('app.dpa.login')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$state', 'LoginService'];

    /* @ngInject */
    function ProfileController($state, LoginService) {
        var vm = this;
        const localUser = localStorage.getItem('socialCookieUni');
        vm.userLogged = JSON.parse(localUser);
        vm.logout = logout;

        /////////

        function logout() {
          LoginService.clearCredentials();
          $state.go('login');
        }
    }
})();
