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

        //////////////

        function submitLogin() {
          loadOn();
          if (!vm.user.email && !vm.user.pwd) {
            $ionicLoading.hide();
            vm.err = 'Preencha os campos corretamente';
            return;
          }
          LoginService.validAccount(vm.user.email.toLowerCase(), vm.user.pwd)
            .then(function(resp){
              if(resp.rows.length > 0) {
                LoginService.setCredentials({
                  user_id: resp.rows.item(0).user_id,
                  name: resp.rows.item(0).name,
                  email: resp.rows.item(0).email
                });
                $timeout(function () {
                  $ionicLoading.hide();
                  $state.go('tabsController.timeline');
                }, 1000);
              }
            }, function(err){
              $ionicLoading.hide();
              vm.err = 'Usuário não encontrado, verifique e tente novamente';
              console.log(">>> ERRO AO BUSCAR USERS: " + JSON.stringify(err));
            });
        }

        function submitCreate() {
            if (!vm.userCreate.name && !vm.userCreate.email && !vm.userCreate.pwd) {
              vm.err = 'Preencha os campos corretamente';
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
                    vm.err = 'E-mail de usuário já existe, tente outro';
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
