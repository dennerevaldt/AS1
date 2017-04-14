(function() {
    'use strict';

    angular
        .module('app.dpa')
        .directive("filesInput", function() {
            return {
                require: "ngModel",
                link: function postLink(scope,elem,attrs,ngModel) {
                    elem.on("change", function(e) {
                        var files = elem[0].files;
                        ngModel.$setViewValue(files);
                    });
              }
            };
        });
})();
