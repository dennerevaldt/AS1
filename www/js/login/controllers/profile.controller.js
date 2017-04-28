(function() {
    'use strict';

    angular
        .module('app.dpa.login')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$state', 'LoginService', '$ionicLoading', '$timeout'];

    /* @ngInject */
    function ProfileController($state, LoginService, $ionicLoading, $timeout) {
        var vm = this;
        const localUser = localStorage.getItem('socialCookieUni');
        vm.userLogged = JSON.parse(localUser);
        vm.logout = logout;

        /////////

        function logout() {
          loadOn();
          LoginService.clearCredentials();
          $timeout(function(){
            $state.go('login');
            $ionicLoading.hide();
          }, 500);
        }

        function loadOn() {
          // Setup the loader
          $ionicLoading.show({
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200
          });
        }
    }
})();
