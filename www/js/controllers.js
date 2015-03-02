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

    // use function so that css has time to apply
    var width = function(){ return document.querySelector('.canvas-container').offsetWidth; };
    var height = function(){ return document.querySelector('.canvas-container').offsetHeight; };

    angular.module('starter.controllers', [])

        .controller('MapCtrl', function ($scope, $ionicPlatform, Settings, Favorites, Image, Faker, Id) {

            $scope.generate = function () {
                // generate map tiles
                var mapData = new MapData();
                mapData.map = Catan.Generator.Map.generate(Settings.getTileTrioScoreLimit(), Settings.getHarborGenerationStrategy());

                // generate map id
                mapData.id = Id.next();

                // generate map name and catchphrase
                mapData.name = Faker.getMapName();
                mapData.catchPhrase = Faker.getMapCatchPhrase();

                $scope.mapData = mapData;
                $scope.starred = false;
            };

            $scope.starred = false;
            $scope.star = function() {
                // resize image and save
                var widthCoeff = 1/ (Math.max(width(), height()) / Image.getThumbnailWidth());
                var heightCoeff = 1/ (Math.max(width(), height()) / Image.getThumbnailHeight());
                Image.resizeBase64Uri($scope.mapData.thumbnailImageUri, function(resizedBase46Url) {
                        $scope.$apply(function(){
                            $scope.mapData.thumbnailImageUri = resizedBase46Url;
                            Favorites.save($scope.mapData);
                            $scope.starred = true;
                        });
                    },
                    widthCoeff * width(),
                    heightCoeff * height()
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
        })

        .controller('FavoritesCtrl', function ($scope, Favorites, $ionicListDelegate) {
            $scope.items = Favorites.fetchAll();

            $scope.$on('$ionicView.enter', function(event, data) {
                $scope.items = Favorites.fetchAll();
            });

            $scope.toggleDeleteButtons = function() {
                $ionicListDelegate.showDelete(! $ionicListDelegate.showDelete());
            };

            $scope.deleteItem = function(mapData) {
                Favorites.remove(mapData);
                $scope.items = Favorites.fetchAll();
            };
        })

        .directive("map", function (Settings)
        {
            return {
                restrict: 'E',
                scope: {
                    mapData: '='
                },
                template: '',
                link: function(scope, element, attrs) {
                    var uiDefinition = Settings.getUiDefinition();
                    var doDraw = false;

                    scope.canvasContainer = element[0];
                    if (uiDefinition === 'high') {
                        // @todo: only init hd UI if needed
                        var highDefUi = Catan.UI.HighDefinition.init(
                            scope.canvasContainer,
                            scope.canvasContainer.parentElement.offsetWidth,
                            scope.canvasContainer.parentElement.offsetHeight,
                            function() {
                                doDraw = true;
                            }
                        );
                    } else {
                        doDraw = true;
                    }

                    scope.$watch('mapData', function(mapData) {
                        if (! mapData || ! doDraw) {
                            return;
                        }

                        if (!scope.canvasContainer.childNodes[0]) {
                            scope.canvasContainer.appendChild(document.createElement('canvas'));
                        }
                        var canvas = scope.canvasContainer.childNodes[0];

                        if (uiDefinition === 'low') {
                            canvas.width = scope.canvasContainer.parentElement.offsetWidth;
                            canvas.height = scope.canvasContainer.parentElement.offsetHeight;
                            Catan.UI.LowDefinition.drawMap(mapData.map, canvas);
                            // @todo: find another fix.
                            // Sometimes, the canvas goes full black (on first launch mainly)
                            // prevent the canvas from remaining black by painting twice
                            Catan.UI.LowDefinition.drawMap(mapData.map, canvas);
                            mapData.thumbnailImageUri = Catan.UI.LowDefinition.getBase64String(canvas);
                        } else {
                            Catan.UI.HighDefinition.draw(
                                highDefUi,
                                mapData.map,
                                scope.canvasContainer.parentElement.offsetWidth,
                                scope.canvasContainer.parentElement.offsetHeight
                            );
                            mapData.map.thumbnailImageUri = Catan.UI.HighDefinition.getBase64String(highDefUi);
                        }
                    });
                }
            };
        })
        .controller('FavoritesViewCtrl', function ($scope, mapData) {
            $scope.mapData = mapData;
        })
    ;



})(angular, Catan);