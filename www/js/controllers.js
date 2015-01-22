//noinspection JSHint
(function (angular, Catan) {
    "use strict";

    angular.module('starter.controllers', [])

        .controller('MapCtrl', function ($scope, $ionicPlatform, Settings) {
            // use function so that css has time to apply
            var width = function(){ return document.querySelector('.canvas-container').offsetWidth; };
            var height = function(){ return document.querySelector('.canvas-container').offsetHeight; };

            var highDefUi;

            $scope.$on('$ionicView.enter', function(event, data) {
                $scope.uiDefinition = Settings.getUiDefinition();
                // @todo: configure pixijs to use an existing canvas
                // clean pixijs created canvas
                var canvasToRemove = document.querySelectorAll('canvas:not(.canvas)')[0];
                if (canvasToRemove) {
                    canvasToRemove.parentElement.removeChild(canvasToRemove);
                }

                // @todo: only init hd UI if needed
                highDefUi = Catan.UI.HighDefinition.init('.canvas-container', width(), height());
            });

            $scope.generate = function () {
                var map = Catan.Generator.Map.generate(Settings.getTileTrioScoreLimit(), Settings.getHarborGenerationStrategy());

                if ($scope.uiDefinition !== 'low') {
                    Catan.UI.HighDefinition.draw(highDefUi, map, width(), height());
                } else {
                    var canvas = document.querySelector('.canvas');
                    canvas.width = width();
                    canvas.height = height();
                    Catan.UI.LowDefinition.drawMap(map, canvas);
                    // @todo: find another fix.
                    // Sometimes, the canvas goes full black (on first launch mainly)
                    // prevent the canvas from remaining black by painting twice
                    Catan.UI.LowDefinition.drawMap(map, canvas);
                }
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



            $scope.uiDefinitionOptions = [
                {id: 'low', label: 'Low Def. (homemade)'},
                {id: 'high', label: 'High Def. (PIXI.js powered)'}
            ];
            var selectedUiDefinitionValue = Settings.getUiDefinition();
            $scope.selectedUiDefinition = null;
            for (i = 0; i < $scope.uiDefinitionOptions.length; i++) {
                if ($scope.uiDefinitionOptions[i].id === selectedUiDefinitionValue) {
                    $scope.selectedUiDefinition = $scope.uiDefinitionOptions[i];
                }
            }
            $scope.updateUiDefinition = function () {
                Settings.setUiDefinition(this.selectedUiDefinition.id);
            };
        });

})(angular, Catan);