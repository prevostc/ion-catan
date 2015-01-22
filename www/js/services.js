//noinspection JSHint
(function (angular) {
    "use strict";

    angular.module('starter.services', ['LocalStorageModule'])

    .factory('Settings', function (localStorageService) {
        return {
            getTileTrioScoreLimit: function () {
                return localStorageService.get('tileTrioScoreLimit') || 13;
            },
            setTileTrioScoreLimit: function (tileTrioScoreLimit) {
                localStorageService.set('tileTrioScoreLimit', tileTrioScoreLimit);
            },

            getHarborGenerationStrategy: function () {
                return localStorageService.get('harborGenerationStrategy') || 'coast-bars';
            },
            setHarborGenerationStrategy: function (harborGenerationStrategy) {
                localStorageService.set('harborGenerationStrategy', harborGenerationStrategy);
            },

            getUiDefinition: function () {
                return localStorageService.get('uiDefinition') || 'high';
            },
            setUiDefinition: function (uiDefinition) {
                localStorageService.set('uiDefinition', uiDefinition);
            }
        };
    });

})(angular);