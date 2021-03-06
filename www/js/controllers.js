//noinspection JSHint
(function (angular, Catan) {
    "use strict";

    function MapData() {
        this.map = null;
        this.id = null;
        this.thumbnailImageUri = null;
        this.name = null;
        this.catchPhrase = null;
    }

    angular.module('starter.controllers', [])

        .controller('MapCtrl', ['$scope', '$ionicPlatform', '$timeout', 'Settings', 'Favorites', 'Image', 'Faker', 'Id', '$ionicAnalytics',
            function ($scope, $ionicPlatform, $timeout, Settings, Favorites, Image, Faker, Id, $ionicAnalytics) {

                $scope.generate = function () {
                    // generate map tiles
                    var mapData = new MapData();
                    mapData.map = Catan.Generator.Map.generate(Settings.getTileTrioScoreLimit(), Settings.getHarborGenerationStrategy());

                    // generate map id
                    mapData.id = Id.uuid();

                    // generate map name and catchphrase
                    mapData.name = Faker.getMapName();
                    mapData.catchPhrase = Faker.getMapCatchPhrase();

                    // store generation metadata
                    mapData.harborGenerationPhrase = {
                        'separate-tiles': 'Separate Tiles (18 tiles)',
                        'coast-bars': 'Enclosing edges bars (6 long pieces)'
                    }[Settings.getHarborGenerationStrategy()];
                    mapData.fairnessPhrase = {
                        11: 'Fair',
                        12: 'Normal',
                        13: 'Unfair'
                    }[Settings.getTileTrioScoreLimit()];

                    $scope.mapData = mapData;
                    $scope.starred = false;
                };

                $scope.starred = false;
                $scope.starToggle = function () {
                    $timeout(function(){
                        $scope.starred = !$scope.starred;
                        if ($scope.starred) {
                            Favorites.save($scope.mapData);
                            $ionicAnalytics.track('star');
                        } else {
                            Favorites.remove($scope.mapData);
                            $ionicAnalytics.track('unstar');
                        }
                    });
                };
            }])

        .controller('SettingsCtrl', ['$scope', 'Settings', '$ionicAnalytics', function ($scope, Settings, $ionicAnalytics) {
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
                var selectedId = this.selectedTileTrioScoreLimit.id;
                Settings.setTileTrioScoreLimit(selectedId);
                $ionicAnalytics.track('settings', {
                    type: 'tile-trio-limit',
                    value: $scope
                        .tileTrioScoreLimitOptions
                        .reduce(function(prev, curr){
                            return curr.id === selectedId ? curr : prev;
                        }, {})
                        .label
                });
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
                var selectedId = this.selectedHarborGenerationStrategy.id;
                Settings.setHarborGenerationStrategy(selectedId);

                $ionicAnalytics.track('settings', {
                    type: 'harbor-generation-strategy',
                    value: $scope
                        .harborGenerationStrategyOptions
                        .reduce(function(prev, curr){
                            return curr.id === selectedId ? curr : prev;
                        }, {})
                        .label
                });
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
                var selectedId = this.selectedUiDefinition.id;
                Settings.setUiDefinition(selectedId);

                $ionicAnalytics.track('settings', {
                    type: 'harbor-generation-strategy',
                    value: $scope
                        .uiDefinitionOptions
                        .reduce(function(prev, curr){
                            return curr.id === selectedId ? curr : prev;
                        }, {})
                        .label
                });
            };
        }])

        .controller('FavoritesCtrl', ['$scope', 'Favorites', '$ionicListDelegate', '$timeout',
            function ($scope, Favorites, $ionicListDelegate, $timeout) {
                $timeout(function () {
                    $scope.items = Favorites.fetchAll();
                });

                $scope.$on('$ionicView.enter', function (event, data) {
                    $timeout(function () {
                        $ionicListDelegate.showDelete(false);
                        $scope.items = Favorites.fetchAll();
                    });
                });
                $scope.$on('$ionicView.beforeLeave', function (event, data) {
                    $ionicListDelegate.showDelete(false);
                });

                $scope.toggleDeleteButtons = function () {
                    $ionicListDelegate.showDelete(!$ionicListDelegate.showDelete());
                };

                $scope.deleteItem = function (mapData) {
                    $timeout(function () {
                        Favorites.remove(mapData);
                        $scope.items = Favorites.fetchAll();
                    });
                };
            }])

        .directive("map", ['Settings', 'Image', function (Settings, Image) {
            return {
                restrict: 'E',
                scope: {
                    mapData: '=mapData',
                    generateThumbnail: '@generateThumbnail'
                },
                template: '<canvas></canvas>',
                link: function (scope, element, attrs) {
                    var assetLoaded = false;

                    scope.canvasContainer = element[0];

                    var renderer = Catan.UI.HighDefinition.init(
                        scope.canvasContainer,
                        scope.canvasContainer.parentElement.offsetWidth,
                        scope.canvasContainer.parentElement.offsetHeight,
                        function (renderer) {
                            assetLoaded = true;
                        }
                    );

                    scope.$watch('mapData', function (mapData) {
                        if (!mapData) {
                            return;
                        }
                        var uiDefinition = Settings.getUiDefinition();
                        var canvas = scope.canvasContainer.childNodes[0];

                        if (uiDefinition === 'low') {
                            canvas.width = scope.canvasContainer.parentElement.offsetWidth;
                            canvas.height = scope.canvasContainer.parentElement.offsetHeight;
                            Catan.UI.LowDefinition.drawMap(mapData.map, canvas);
                        } else if (assetLoaded) {
                            Catan.UI.HighDefinition.draw(
                                renderer,
                                mapData.map,
                                scope.canvasContainer.parentElement.offsetWidth,
                                scope.canvasContainer.parentElement.offsetHeight
                            );
                        }

                        if (scope.generateThumbnail) {
                            Image.getCroppedAndResizedBase64Uri(canvas, function (thumbnailImageUri) {
                                scope.$apply(function () {
                                    scope.mapData.thumbnailImageUri = thumbnailImageUri;
                                });
                            });
                        }
                    });
                }
            };
        }])
        .controller('FavoritesViewCtrl', ['$scope', 'mapData', function ($scope, mapData) {
            $scope.mapData = mapData;
        }])
    ;


})(angular, Catan);