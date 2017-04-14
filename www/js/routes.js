angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('tabsController.timeline', {
    url: '/timeline',
    views: {
      'tab1': {
        templateUrl: 'templates/timeline.html',
        controller: 'HomeController',
        controllerAs: 'vm',
        resolve: {
          InitPublications: function(HomeService) {
            return HomeService.getPublications()
              .then(function(resp) {
                  return resp;
              });
          },
          InitFriends: function(HomeService, $cookieStore) {
            var userLogged = $cookieStore.get('socialCookieUni');
            return HomeService.getFriends(userLogged)
              .then(function(resp) {
                  return resp;
              });
          }
        }
      }
    }
  })

  .state('tabsController.amigos', {
    url: '/friends',
    views: {
      'tab2': {
        templateUrl: 'templates/amigos.html',
        controller: 'HomeController',
        controllerAs: 'vm',
        resolve: {
          InitPublications: function(HomeService) {
            return HomeService.getPublications()
              .then(function(resp) {
                  return resp;
              });
          },
          InitFriends: function(HomeService, $cookieStore) {
            var userLogged = $cookieStore.get('socialCookieUni');
            return HomeService.getFriends(userLogged)
              .then(function(resp) {
                  return resp;
              });
          }
        }
      }
    }
  })

  .state('tabsController.notificacoes', {
    url: '/notifications',
    views: {
      'tab3': {
        templateUrl: 'templates/notificacoes.html',
        controller: 'NotificationController',
        controllerAs: 'vm',
        resolve: {
          InitPublications: function(HomeService) {
            return HomeService.getPublications()
              .then(function(resp) {
                  return resp;
              });
          },
          InitFriends: function(HomeService, $cookieStore) {
            var userLogged = $cookieStore.get('socialCookieUni');
            return HomeService.getFriends(userLogged)
              .then(function(resp) {
                  return resp;
              });
          }
        }
      }
    }
  })

  .state('tabsController', {
    url: '/dashboard',
    templateUrl: 'templates/tabsController.html',
    controller: 'TabsController',
    controllerAs: 'vm',
    abstract:true,
    resolve: {
      InitNotifications: function(HomeService, $cookieStore) {
        var userLogged = $cookieStore.get('socialCookieUni');
        return HomeService.getNotifications(userLogged)
          .then(function(resp) {
              return resp;
          });
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  })

  .state('tabsController.profile', {
    url: '/profile',
    views: {
      'tab4': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      }
    }
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/cadastrarSe.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  })

  .state('tabsController.pesquisarAmigo', {
    url: '/searchFriend',
    views: {
      'tab5': {
        templateUrl: 'templates/pesquisarAmigo.html',
        controller: 'SearchController',
        controllerAs: 'vm'
      }
    }
  })

$urlRouterProvider.otherwise('/login')

});
