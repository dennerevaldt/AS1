(function() {
    'use strict';

    angular
        .module('app.dpa.contact')
        .factory('ContactService', ContactService);

    ContactService.$inject = ['$http', '$q'];

    /* @ngInject */
    function ContactService($http, $q) {
        var contacts = [];

        var service = {
            setContacts: setContacts,
            getContacts: getContacts
        };

        return service;

        function setContacts(allContacts) {
          allContacts.map(function(item) {
            contacts.push({
              name: item.name.formatted,
              email: item.emails[0].value || ''
            });
          });
        }

        function getContacts() {
          var deferred = $q.defer();
          deferred.resolve(contacts);
          return deferred.promise;
        }
    }
})();
