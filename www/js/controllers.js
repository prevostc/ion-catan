//noinspection JSHint
(function (angular, Catan) {
    "use strict";

    angular.module('starter.controllers', [])

        .controller('MapCtrl', function ($scope, $ionicPlatform, Settings) {
            $scope.generate = function () {
                var canvas = document.querySelector('.canvas');
                canvas.width = document.querySelector('.canvas-container').offsetWidth;
                canvas.height = document.querySelector('.canvas-container').offsetHeight;
                var map = Catan.Generator.Map.generate(Settings.getTileTrioScoreLimit(), Settings.getHarborGenerationStrategy());
                Catan.UI.drawMap(map, canvas);
            };
        })

        .controller('SettingsCtrl', function ($scope, Settings) {
            $scope.tileTrioScoreLimitOptions = [
                {id: 11, label: 'High (slower)'},
                {id: 12, label: 'Normal'},
                {id: 13, label: 'Low (faster)'}
            ];
            var selectedTileTrioScoreLimitValue = Settings.getTileTrioScoreLimit();
            $scope.selectedTileTrioScoreLimit = null;
            for (var i = 0; i < $scope.tileTrioScoreLimitOptions.length; i++) {
                if ($scope.tileTrioScoreLimitOptions[i].id === selectedTileTrioScoreLimitValue) {
                    $scope.selectedTileTrioScoreLimit = $scope.tileTrioScoreLimitOptions[i];
                }
            }
            $scope.updateTileTrioScoreLimit = function () {
                Settings.setTileTrioScoreLimit(this.selectedTileTrioScoreLimit.id);
            };


            $scope.harborGenerationStrategyOptions = [
                {id: 'separate-tiles', label: 'Separate Tiles'},
                {id: 'coast-bars', label: 'Coast Bars'}
            ];
            var selectedHarborGenerationStrategyValue = Settings.getHarborGenerationStrategy();
            $scope.selectedHarborGenerationStrategy = null;
            for (i = 0; i < $scope.harborGenerationStrategyOptions.length; i++) {
                if ($scope.harborGenerationStrategyOptions[i].id === selectedHarborGenerationStrategyValue) {
                    $scope.selectedHarborGenerationStrategy = $scope.harborGenerationStrategyOptions[i];
                }
            }
            $scope.updateHarborGenerationStrategy = function () {
                Settings.setHarborGenerationStrategy(this.selectedHarborGenerationStrategy.id);
            };
        });

})(angular, Catan);