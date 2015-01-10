angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicPlatform, Settings) {
    $scope.generate = function() {
        var canvas = document.querySelector('.canvas');
        canvas.width = document.querySelector('.canvas-container').offsetWidth;
        canvas.height = document.querySelector('.canvas-container').offsetHeight;
        var map = Catan.Generator.Map.generate(Settings.getTileTrioScoreLimit());
        Catan.UI.drawMap(map, canvas);
    };
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
