(function() {
    'use strict';

    angular
        .module('app.dpa.home')
        .controller('NotificationController', NotificationController);

    NotificationController.$inject = ['HomeService', 'InitNotifications', '$cookieStore', '$scope'];

    /* @ngInject */
    function NotificationController(HomeService, InitNotifications, $cookieStore, $scope) {
        var vm = this;
        vm.userLogged = $cookieStore.get('socialCookieUni');
        vm.listNotifications = InitNotifications || [];
        vm.acceptFriend = acceptFriend;
        vm.rejectFriend = rejectFriend;

        ////////////

        function acceptFriend(not) {
          HomeService.acceptFriend(not, vm.userLogged);
          vm.listNotifications.splice(not, 1);
          $scope.$emit('handleEmit', {notification: not});
        }

        function rejectFriend(not) {
          HomeService.rejectFriend(not, vm.userLogged);
          vm.listNotifications.splice(not, 1);
        }

    }
})();
