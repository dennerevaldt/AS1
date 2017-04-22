(function() {
    'use strict';

    angular
        .module('app.dpa.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['LoginService', '$state', '$ionicLoading', '$timeout'];

    /* @ngInject */
    function LoginController(LoginService, $state, $ionicLoading, $timeout) {
        var vm = this;
        vm.user = {};
        vm.userCreate = {};
        vm.submitLogin = submitLogin;
        vm.submitCreate = submitCreate;
        vm.userLogged = {};

        activate();

        //////////////

        function activate() {
          const localUser = localStorage.getItem('socialCookieUni');
          vm.userLogged = JSON.parse(localUser);
          if (vm.userLogged) {
            $state.go('tabsController.timeline');
          }
        }

        function submitLogin() {
          loadOn();
          if (!vm.user.email && !vm.user.pwd) {
            $ionicLoading.hide();
            vm.err = 'Preencha os campos corretamente';
            return;
          }
          var user = LoginService.validAccount(vm.user.email.toLowerCase(), vm.user.pwd);
          if (user) {
            LoginService.setCredentials(user);
            $timeout(function () {
              $ionicLoading.hide();
              $state.go('tabsController.timeline');
            }, 1000);
          } else {
            $ionicLoading.hide();
            vm.err = 'Usuário não encontrado, verifique e tente novamente';
          }
        }

        function submitCreate() {
            if (!vm.userCreate.name && !vm.userCreate.email && !vm.userCreate.pwd) {
              vm.err = 'Preencha os campos corretamente';
              return;
            } else {
              loadOn();
              $timeout(function () {
                $ionicLoading.hide();
                var user = LoginService.createAccount(vm.userCreate.name, vm.userCreate.email.toLowerCase(), vm.userCreate.pwd);
                if (user) {
                  LoginService.setCredentials(user);
                  $state.go('tabsController.timeline');
                } else {
                  $ionicLoading.hide();
                  vm.err = 'E-mail de usuário já existe, tente outro';
                }
              }, 1000);
            }
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
