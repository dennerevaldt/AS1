angular
  .module('app')
  .run(run);

run.$inject = ['$rootScope', '$location', '$http', 'LoginService', 'HomeService', 'ContactService', '$ionicPlatform', '$cordovaContacts', '$cordovaSQLite', 'DBService'];

function run($rootScope, $location, $http, LoginService, HomeService, ContactService, $ionicPlatform, $cordovaContacts, $cordovaSQLite, DBService) {

    $ionicPlatform.ready(function () {
      // contacts
      $cordovaContacts.find({filter: '', multiple: true, fields: ['id', 'formatted', 'emails']})
        .then(function (allContacts) {
          ContactService.setContacts(allContacts);
        });

      // Obtém objeto do BD
      var db = $cordovaSQLite.openDB({name: "socialNetworkApp.db"});
      DBService.reset(db); // reseta dados e tabelas
      DBService.init(db); // inicializa dados e tabelas

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
          var localUser = localStorage.getItem('socialCookieUni') || undefined;
          if (!localUser) {
            $location.path('login');
          }
        });

        /*
        Receive emitted message and broadcast it.
        */
        $rootScope.$on('handleEmit', function (event, args) {
          $rootScope.$broadcast('handleBroadcast', args);
        });
    });
}
