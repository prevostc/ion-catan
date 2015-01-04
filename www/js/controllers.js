angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope) {
    $scope.generate = function() {
        Catan.generateMap(document.querySelector('.canvas'));
    };

    var canvas = document.querySelector('.canvas');
    canvas.width = document.querySelector('.canvas-container').offsetWidth;
    canvas.height = document.querySelector('.scroll-content').offsetHeight;
})

.controller('SettingsCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
