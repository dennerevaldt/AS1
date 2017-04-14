angular
  .module('app')
  .run(run);

run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', 'LoginService', 'HomeService'];

function run($rootScope, $location, $cookieStore, $http, LoginService, HomeService) {
    // populate publications
    $http.get('appdata/publications.json')
      .then(function(response){
        HomeService.populatePublications(response.data);
      });

    // populate friends
    $http.get('appdata/friends.json')
      .then(function(response){
        HomeService.populateFriends(response.data);
      });

    // populate users
    $http.get('appdata/users.json')
      .then(function(response){
        LoginService.populateUsers(response.data);
      });

    // check authenticate user start change route
    $rootScope.$on('$stateChangeStart', function (event,next,current) {
      var cookieUser = $cookieStore.get('socialCookieUni') || undefined;
      if (!cookieUser) {
        $location.path('login');
      }
    });

    /*
    Receive emitted message and broadcast it.
    */
    $rootScope.$on('handleEmit', function (event, args) {
      $rootScope.$broadcast('handleBroadcast', args);
    });
}
