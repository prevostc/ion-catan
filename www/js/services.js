angular.module('starter.services', ['LocalStorageModule'])

    .factory('Settings', function (localStorageService) {
        return {
            getTileTrioScoreLimit: function () {
                return localStorageService.get('tileTrioScoreLimit') || 12;
            },
            setTileTrioScoreLimit: function (tileTrioScoreLimit) {
                localStorageService.set('tileTrioScoreLimit', tileTrioScoreLimit);
            }
        };
    });