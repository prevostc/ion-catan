//noinspection JSHint
(function (angular, faker, Catan) {
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
        })

        .factory('Favorites', function (localStorageService) {
            var saveAll = function(mapsData) {
                var serializedMapsData = [];
                for (var i = 0; i < mapsData.length; i++) {
                    mapsData[i].map = Catan.Map.serialize(mapsData[i].map);
                    serializedMapsData.push(mapsData[i]);
                }
                localStorageService.set('mapHistory', serializedMapsData);
            };

            var service = {
                save: function (mapData) {
                    var mapsData = service.fetchAll();
                    mapsData.unshift(mapData);
                    saveAll(mapsData);
                    return mapData;
                },
                fetchAll: function () {
                    var mapsData = localStorageService.get('mapHistory') || [];
                    for (var i = 0; i < mapsData.length; i++) {
                        mapsData[i].map = Catan.Map.unserialize(mapsData[i].map);
                    }
                    return mapsData;
                },
                remove: function (mapToDelete) {
                    var maps = service.fetchAll();
                    var newMaps = [];
                    for (var i = 0; i < maps.length; i++) {
                        if (maps[i].id !== mapToDelete.id) {
                            newMaps.push(maps[i]);
                        }
                    }
                    saveAll(newMaps);
                    return newMaps;
                },
                fetchById: function (id) {
                    var maps = service.fetchAll();
                    for (var i = 0; i < maps.length; i++) {
                        if (maps[i].id === id) {
                            return maps[i];
                        }
                    }
                    return null;
                }
            };
            return service;
        })

        .factory('Image', function () {
            var Image = {
                getThumbnailWidth: function () {
                    return 80;
                },
                getThumbnailHeight: function () {
                    return 80;
                },
                resizeBase64Uri: function (base64Uri, callback, wantedWidth, wantedHeight) {
                    wantedWidth = wantedWidth || Image.getThumbnailWidth();
                    wantedHeight = wantedHeight || Image.getThumbnailHeight();

                    // We create an image to receive the Data URI
                    var img = document.createElement('img');

                    // When the event "onload" is triggered we can resize the image.
                    img.onload = function () {
                        // We create a canvas and get its context.
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');

                        // We set the dimensions at the wanted size.
                        canvas.width = wantedWidth;
                        canvas.height = wantedHeight;

                        // We resize the image with the canvas method drawImage();
                        ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

                        var resizedBase64Uri = canvas.toDataURL();

                        callback(resizedBase64Uri);
                    };

                    // We put the Data URI in the image's src attribute
                    img.src = base64Uri;
                }
            };

            return Image;
        })

        .factory('Faker', function () {
            return {
                getMapName: function () {
                    return faker.address.city() + ' ' + faker.address.streetSuffix();
                },
                getMapCatchPhrase: function () {
                    return faker.company.catchPhrase();
                }
            };
        })

        .factory('Id', function (localStorageService) {
            var Id = {
                next: function () {
                    var next = Id.current() + 1;
                    localStorageService.set('uniqid', next);
                    return next;
                },
                current: function () {
                    return localStorageService.get('uniqid') || 1;
                }
            };
            return Id;
        })
    ;

})(angular, faker, Catan);