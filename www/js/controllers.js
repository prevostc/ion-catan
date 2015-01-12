//noinspection JSHint
(function (angular, Catan) {
    "use strict";

    angular.module('starter.controllers', [])

        .controller('MapCtrl', function ($scope, $ionicPlatform, Settings) {
            var ui = Catan.UI.init(
                '.canvas-container',
                document.querySelector('.canvas-container').offsetWidth,
                document.querySelector('.canvas-container').offsetHeight
            );
            $scope.generate = function () {
                var map = Catan.Generator.Map.generate(Settings.getTileTrioScoreLimit(), Settings.getHarborGenerationStrategy());
                Catan.UI.draw(
                    ui, map,
                    document.querySelector('.canvas-container').offsetWidth,
                    document.querySelector('.canvas-container').offsetHeight
                );
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
                {id: 'separate-tiles', label: 'Separate Tiles (18 tiles)'},
                {id: 'coast-bars', label: 'Enclosing edges bars (6 long pieces)'}
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