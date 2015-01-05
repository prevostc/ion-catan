angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, Settings) {
    $scope.generate = function() {
        Catan.generateMap(document.querySelector('.canvas'), Settings.getTileTrioScoreLimit());
    };

    var canvas = document.querySelector('.canvas');
    canvas.width = document.querySelector('.canvas-container').offsetWidth;
    canvas.height = document.querySelector('.scroll-content').offsetHeight;

    $scope.generate();
})

.controller('SettingsCtrl', function($scope, Settings) {
    $scope.tileTrioScoreLimitElements = [
        {value: 11, title: 'High (slower)'},
        {value: 12, title: 'Normal'},
        {value: 13, title: 'Low (faster)'}
    ];
    $scope.selectedItem = Settings.setTileTrioScoreLimit() || $scope.tileTrioScoreLimitElements[1];
    $scope.updateTileTrioScoreLimit = function() {
        Settings.setTileTrioScoreLimit(this.selectedItem.value);
    };
});
