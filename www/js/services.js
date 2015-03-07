//noinspection JSHint
(function (angular, faker, Catan) {
    "use strict";

    angular.module('starter.services', ['LocalStorageModule'])

        .factory('Settings', ['localStorageService', function (localStorageService) {
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
        }])

        .factory('Favorites', ['localStorageService',  function (localStorageService) {
            var saveAll = function (mapsData) {
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
        }])

        .factory('Image', function () {

            function getNonWhiteCoordinates(canvas) {
                // from http://stackoverflow.com/questions/12175991/crop-image-white-space-automatically-using-jquery
                var context = canvas.getContext('2d');
                var imgWidth = canvas.width, imgHeight = canvas.height,
                    imageData = context.getImageData(0, 0, imgWidth, imgHeight),
                    data = imageData.data,
                    getRBG = function (x, y) {
                        var offset = imgWidth * y + x;
                        return {
                            red: data[offset * 4],
                            green: data[offset * 4 + 1],
                            blue: data[offset * 4 + 2],
                            opacity: data[offset * 4 + 3]
                        };
                    },
                    isWhite = function (rgb) {
                        // many images contain noise, as the white is not a pure #fff white
                        return rgb.red > 200 && rgb.green > 200 && rgb.blue > 200;
                    },
                    scanY = function (fromTop) {
                        var offset = fromTop ? 1 : -1;

                        // loop through each row
                        for (var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

                            // loop through each column
                            for (var x = 0; x < imgWidth; x++) {
                                var rgb = getRBG(x, y);
                                if (!isWhite(rgb)) {
                                    return y;
                                }
                            }
                        }
                        return null; // all image is white
                    },
                    scanX = function (fromLeft) {
                        var offset = fromLeft ? 1 : -1;

                        // loop through each column
                        for (var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

                            // loop through each row
                            for (var y = 0; y < imgHeight; y++) {
                                var rgb = getRBG(x, y);
                                if (!isWhite(rgb)) {
                                    return x;
                                }
                            }
                        }
                        return null; // all image is white
                    };

                var res = {
                    cropTop: scanY(true),
                    cropBottom: scanY(false),
                    cropLeft: scanX(true),
                    cropRight: scanX(false)
                };
                res.cropWidth = res.cropRight - res.cropLeft;
                res.cropHeight = res.cropBottom - res.cropTop;

                return res;
            }

            var Image = {
                getThumbnailWidth: function () {
                    return 150;
                },
                getThumbnailHeight: function () {
                    return 150;
                },
                getCroppedAndResizedBase64Uri: function (canvasToCropAndResize, callback, wantedWidth, wantedHeight) {
                    wantedWidth = wantedWidth || Image.getThumbnailWidth();
                    wantedHeight = wantedHeight || Image.getThumbnailHeight();

                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    var imageObj = document.createElement('img');

                    var cropCoordinates = getNonWhiteCoordinates(canvasToCropAndResize);

                    imageObj.onload = function () {

                        // draw cropped image based on http://www.html5canvastutorials.com/tutorials/html5-canvas-image-crop/
                        var sourceX = cropCoordinates.cropLeft;
                        var sourceY = cropCoordinates.cropTop;
                        var sourceWidth = cropCoordinates.cropWidth;
                        var sourceHeight = cropCoordinates.cropHeight;
                        var destWidth = Image.getThumbnailWidth();
                        var destHeight = Image.getThumbnailHeight();
                        var destX = 0;
                        var destY = 0;

                        canvas.width = destWidth;
                        canvas.height = destHeight;
                        context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

                        callback(canvas.toDataURL());
                    };

                    imageObj.src = canvasToCropAndResize.toDataURL();
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

        .factory('Id', ['localStorageService', function (localStorageService) {
            var Id = {
                next: function () {
                    var next = Id.current() + 1;
                    localStorageService.set('uniqid', next);
                    return next;
                },
                current: function () {
                    return localStorageService.get('uniqid') || 1;
                },
                uuid: function () {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
                }
            };
            return Id;
        }])
    ;

})(angular, faker, Catan);