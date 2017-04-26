angular
  .module('app')
  .run(run);

run.$inject = ['$rootScope', '$http', 'LoginService', 'HomeService', 'ContactService', '$ionicPlatform', '$cordovaContacts', '$cordovaSQLite', 'DBService', '$state'];

function run($rootScope, $http, LoginService, HomeService, ContactService, $ionicPlatform, $cordovaContacts, $cordovaSQLite, DBService, $state) {

    $ionicPlatform.ready(function () {
      // contacts
      $cordovaContacts.find({filter: '', multiple: true, fields: ['id', 'formatted', 'emails']})
        .then(function (allContacts) {
          ContactService.setContacts(allContacts);
        });

      // get BD
      var db = $cordovaSQLite.openDB({name: "socialNetworkApp.db"});
      // check is is Initialized
      var isInitialized = localStorage.getItem('isInitialized') || undefined;

      if (!isInitialized) {
        DBService.reset(db); // reset data
        DBService.init(db); // init data

        // populate users
        $http.get('appdata/users.json')
          .then(function(response){
            LoginService.populateUsers(response.data);
          });

        // populate friends
        $http.get('appdata/friends.json')
          .then(function(response){
            HomeService.populateFriends(response.data);
          });

        // populate publications
        $http.get('appdata/publications.json')
          .then(function(response){
            HomeService.populatePublications(response.data);
          });

        localStorage.setItem('isInitialized', JSON.stringify({isInitialized: true}));
      } else {
        // set instance db
        DBService.setDB(db);
      }

      // redirect if logged
      const localUser = localStorage.getItem('socialCookieUni');
      const userLogged = JSON.parse(localUser);
      if (userLogged) {
        $state.go('tabsController.timeline');
      }

      // check authenticate user start change route
      $rootScope.$on('$stateChangeStart', function (event,next,current) {
        var localUser = localStorage.getItem('socialCookieUni') || undefined;
        if (!localUser) {
          $state.go('login');
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
