(function() {
    'use strict';

    angular
        .module('app.dpa.home')
        .controller('TabsController', TabsController);

    TabsController.$inject = ['$scope', 'InitNotifications'];

    /* @ngInject */
    function TabsController($scope, InitNotifications) {
      $scope.listNotifications = InitNotifications;
      $scope.not = InitNotifications.length || 0;

      /* Watch alter list associate */
      $scope.$on('handleBroadcast', function(event, args) {
        if(args.notification){
          var i = $scope.listNotifications.indexOf(args.notification);
          $scope.listNotifications.splice(i, 1);
          $scope.not = $scope.listNotifications.length;
        }
      });
    }
})();
