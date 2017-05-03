(function() {
    'use strict';

    angular
        .module('app.dpa.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['LoginService', '$state', '$ionicLoading', '$timeout', '$cordovaToast'];

    /* @ngInject */
    function LoginController(LoginService, $state, $ionicLoading, $timeout, $cordovaToast) {
        var vm = this;
        vm.user = {};
        vm.userCreate = {};
        vm.submitLogin = submitLogin;
        vm.submitCreate = submitCreate;
        vm.userLogged = {};

        //////////////

        function submitLogin() {
          loadOn();
          if (!vm.user.email || !vm.user.pwd) {
            $ionicLoading.hide();
            $cordovaToast
              .show('Preencha os campos corretamente', 'long', 'center');
            return;
          }
          LoginService.validAccount(vm.user.email.toLowerCase(), vm.user.pwd)
            .then(function(resp){
              if(resp.data.token) {
                LoginService.setCredentials(resp.data.token);
                LoginService.getDataUser()
                .then(function(resp) {
                  localStorage.setItem('socialCookieUni', JSON.stringify(resp.data.user))
                  $ionicLoading.hide();
                  $state.go('tabsController.timeline');
                }, function (err) {
                  $ionicLoading.hide();
                  $cordovaToast
                    .show('Problemas ao buscar dados do usuário', 'long', 'center');
                });
              }
            }, function(err){
              $ionicLoading.hide();
              $cordovaToast
                .show('Usuário não encontrado, verifique e tente novamente', 'long', 'center');
            });
        }

        function submitCreate() {
            if (!vm.userCreate.name && !vm.userCreate.email && !vm.userCreate.pwd) {
              $cordovaToast
                .show('Preencha os campos corretamente', 'long', 'center');
              return;
            } else {
              loadOn();
              $timeout(function () {
                $ionicLoading.hide();
                LoginService.createAccount(vm.userCreate.name, vm.userCreate.email.toLowerCase(), vm.userCreate.pwd)
                  .then(function(resp) {
                    LoginService.setCredentials(resp);
                    $state.go('tabsController.timeline');
                  }, function(err) {
                    $ionicLoading.hide();
                    $cordovaToast
                      .show('E-mail de usuário já existe, tente outro', 'long', 'center');
                  });
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
