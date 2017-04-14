(function() {
    'use strict';

    angular
        .module('app.dpa.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['HomeService', '$location', '$cookieStore', 'InitPublications', 'InitFriends', '$ionicNavBarDelegate', '$cordovaCamera', '$state', '$ionicLoading', '$timeout'];

    /* @ngInject */
    function HomeController(HomeService, $location, $cookieStore, InitPublications, InitFriends, $ionicNavBarDelegate, $cordovaCamera, $state, $ionicLoading, $timeout) {
        var vm = this;
        $ionicNavBarDelegate.showBackButton(false);
        vm.userLogged = $cookieStore.get('socialCookieUni');
        vm.post = {};
        vm.submitPost = submitPost;
        vm.arrPublications = [];
        vm.arrFriends = InitFriends || [];
        vm.loading = false;
        vm.removeFriend = removeFriend;
        vm.chooseImg = chooseImg;

        activate();

        //////////////

        function activate() {
          if (vm.arrFriends.length) {
            InitPublications.map(function(pub) {
              vm.arrFriends.map(function(friend) {
                  if((pub.user.email === friend.email) && (!pub.publication.private)) {
                    vm.arrPublications.push(pub);
                  } else if (pub.user.email === vm.userLogged.email) {
                    vm.arrPublications.push(pub);
                  }
              });
            });
          } else {
            InitPublications.map(function(pub) {
                if (pub.user.email === vm.userLogged.email) {
                  vm.arrPublications.push(pub);
                }
            });
          }
        }

        function submitPost() {
          loadOn();
          var post = {
            user: {
              name: vm.userLogged.name,
              email: vm.userLogged.email
            },
            publication: {
              text: vm.post.textPublication,
              private: vm.post.private ? true : false,
              image: vm.imgURI
            }
          };
          $timeout(function () {
            $ionicLoading.hide();
            HomeService.savePost(post);
            vm.arrPublications.unshift(post);
            $state.go('tabsController.timeline');
          }, 1000);
        }

        function removeFriend(item) {
            HomeService.removeFriend(item);
            HomeService.getFriends(vm.userLogged)
              .then(function(friends) {
                vm.arrFriends = friends;
              });
        }

        function chooseImg() {
          var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
          };

          $cordovaCamera.getPicture(options).then(function (imageData) {
            vm.imgURI = "data:image/jpeg;base64," + imageData;
          }, function (err) {
            // An error occured. Show a message to the user
          });
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
