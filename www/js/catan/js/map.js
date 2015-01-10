(function(Catan){
    "use strict";

    Catan.Map = function (height, width, center) {
        this.board = [];
        for (var i = 0; i < width; i++) {
            this.board[i] = [];
            for (var j = 0; j < height; j++) {
                this.board[i][j] = new Catan.Hexagon(Catan.T.Empty, new Catan.Position(i, j));
            }
        }
        this.center = center;
    };


    Catan.Map.prototype.each = function (callback) {
        var line;
        for (var col = this.center.column - 1; col <= this.center.column + 1; col++) {
            for (line = this.center.line - 2; line <= this.center.line + 2; line++) {
                callback(col, line);
            }
        }
        for (line = this.center.line - 1; line <= this.center.line + 1; line++) {
            callback(this.center.column + 2, line);
        }
        callback(this.center.column - 2, this.center.line);
    };

    Catan.Map.prototype.eachCoast = function (callback) {
        for (var col = this.center.column - 1; col <= this.center.column + 2; col++) {
            callback(col, this.center.line - 3);
        }
        var orderedCoordinates = [
            [this.center.column + 2, this.center.line - 2],
            [this.center.column + 3, this.center.line - 1],
            [this.center.column + 3, this.center.line],
            [this.center.column + 3, this.center.line + 1],
            [this.center.column + 2, this.center.line + 2]
        ];
        for (var i = 0; i < orderedCoordinates.length; i++) {
            callback(orderedCoordinates[i][0], orderedCoordinates[i][1]);
        }
        for (col = this.center.column + 2; col >= this.center.column - 1; col--) {
            callback(col, this.center.line + 3);
        }

        orderedCoordinates = [
            [this.center.column - 2, this.center.line + 2],
            [this.center.column - 2, this.center.line + 1],
            [this.center.column - 3, this.center.line],
            [this.center.column - 2, this.center.line - 1],
            [this.center.column - 2, this.center.line - 2]
        ];
        for (i = 0; i < orderedCoordinates.length; i++) {
            callback(orderedCoordinates[i][0], orderedCoordinates[i][1]);
        }
    };

    Catan.Map.prototype.get = function (column, line) {
        if (this.board[column] === undefined) {
            return undefined;
        }
        return this.board[column][line];
    };

    Catan.Map.prototype.eachNeighbour = function (col, line, callback) {
        var orderedNeighbourCoordinates =
                (0 === line % 2) ?
                    [
                        [col - 1, line - 1],
                        [col - 1, line],
                        [col - 1, line + 1],
                        [col, line + 1],
                        [col + 1, line],
                        [col, line - 1]
                    ]
                    : [
                    [col + 1, line - 1],
                    [col + 1, line],
                    [col + 1, line + 1],
                    [col, line + 1],
                    [col - 1, line],
                    [col, line - 1]
                ]
            ;
        var neighbour;
        for (var i = 0; i < orderedNeighbourCoordinates.length; i++) {
            neighbour = this.get(orderedNeighbourCoordinates[i][0], orderedNeighbourCoordinates[i][1]);
            if (neighbour !== undefined) {
                callback(neighbour.position.column, neighbour.position.line);
            }
        }
    };


    Catan.Map.prototype.eachConsecutiveNeighbour = function (col, line, coupleValid, callback) {
        var map = this;
        var elements = [];

        this.eachNeighbour(col, line, function (x, y) {
            elements.push([x, y]);
        });

        var a;
        var b;
        for (var i = 0; i + 1 < elements.length; ++i) {
            a = map.get(elements[i][0], elements[i][1]);
            b = map.get(elements[i + 1][0], elements[i + 1][1]);
            if (coupleValid(a, b)) {
                callback(elements[i][0], elements[i][1], elements[i + 1][0], elements[i + 1][1]);
            }
        }
        a = map.get(elements[elements.length - 1][0], elements[elements.length - 1][1]);
        b = map.get(elements[0][0], elements[0][1]);
        if (coupleValid(a, b)) {
            callback(elements[elements.length - 1][0], elements[elements.length - 1][1], elements[0][0], elements[0][1]);
        }
        // reset elements
        elements = [];

    };

    Catan.Map.prototype.getAllowedLands = function (i, j, allowedLands) {
        var map = this;
        this.eachNeighbour(i, j, function (x, y) {
            // remove neighbours lands from allowed lands
            allowedLands = allowedLands.filter(function (element, index, array) {
                return (map.get(x, y).land != element);
            });
        });
        return allowedLands;
    };


    Catan.Map.prototype.generateLands = function () {
        var allowedLands;
        var map = this;
        // init map with random lands
        var lands = [
            Catan.T.Hills, Catan.T.Hills, Catan.T.Hills,
            Catan.T.Pasture, Catan.T.Pasture, Catan.T.Pasture, Catan.T.Pasture,
            Catan.T.Mountains, Catan.T.Mountains, Catan.T.Mountains,
            Catan.T.Fields, Catan.T.Fields, Catan.T.Fields, Catan.T.Fields,
            Catan.T.Forest, Catan.T.Forest, Catan.T.Forest, Catan.T.Forest,
            Catan.T.Desert
        ];

        Catan.Tools.shuffle(lands);
        this.each(function (i, j) {
            map.get(i, j).land = lands.pop();
        });

        // unset same lands neighbours
        var emptySpots = [];
        this.each(function (i, j) {
            var a;
            var b;
            map.eachConsecutiveNeighbour(i, j, function (a, b) {
                return (a.land == b.land && a.land != Catan.T.Empty && a.land !== undefined);
            }, function (ax, ay, bx, by) {
                a = map.get(ax, ay);
                b = map.get(bx, by);
                lands.push(a.land);
                a.land = undefined;
                emptySpots.push(a.position);
            });
        });

        // repush as much lands as possible
        var newEmptySpots = [];
        Catan.Tools.shuffle(emptySpots);
        Catan.Tools.shuffle(lands);

        for (var i = 0; i < emptySpots.length; ++i) {
            allowedLands = this.getAllowedLands(emptySpots[i].column, emptySpots[i].line, lands);

            if (allowedLands.length > 0) {
                this.get(emptySpots[i].column, emptySpots[i].line).land = allowedLands[0];
                lands = Catan.Tools.removeOne(lands, allowedLands[0]);
            } else {
                newEmptySpots.push(emptySpots[i]);
            }
        }
        emptySpots = newEmptySpots;

        // swap as much as possible
        var allLands;
        var swapped = false;
        var eachSwapFunction = function (i, j) {
            if (!swapped && !(i == ex && j == ey) && Catan.Tools.contains(allowedLands, map.get(i, j).land)) {
                var currentAllowedLands = map.getAllowedLands(i, j, allLands);
                for (var t = 0; t < lands.length && !swapped; t++) {
                    if (map.get(i, j).land != lands[t] && Catan.Tools.contains(currentAllowedLands, lands[t])) {
                        // set empty spot land to current.land
                        map.get(ex, ey).land = map.get(i, j).land;
                        // set current land to land[t]
                        map.get(i, j).land = lands[t];
                        // remove land[t] from land
                        lands = Catan.Tools.removeOne(lands, lands[t]);
                        // set item swapped
                        swapped = true;
                    }
                }
            }
        };

        for (var cur = 0; cur < emptySpots.length; ++cur) {
            var ex = emptySpots[cur].column;
            var ey = emptySpots[cur].line;
            allLands = [Catan.T.Hills, Catan.T.Pasture, Catan.T.Mountains, Catan.T.Fields, Catan.T.Forest, Catan.T.Desert];
            allowedLands = this.getAllowedLands(ex, ey, allLands);
            // if smth is allowed
            if (allowedLands.length > 0) {
                swapped = false;
                this.each(eachSwapFunction);
            }
        }

        return lands;
    };

    Catan.Map.prototype.generateNumbers = function (tileTrioScoreLimit) {
        var map = this, i, j;
        var numbers = [11, 12, 9, 4, 6, 5, 10, 3, 11, 4, 8, 8, 10, 9, 3, 5, 2, 6];
        // sort tdsc DESC
        Catan.Tools.shuffle(numbers);
        numbers.sort(function (a, b) {
            return Catan.Tools.tdsc(b) - Catan.Tools.tdsc(a);
        });

        // group numbers in 5 groups, 3 groups of 4 numbers, 2 groups of 3 numbers
        // the tdsc sum of each group should be as close as possible
        var groups = {};
        groups[Catan.T.Hills] = {size: 3, numbers: [], pos: []};
        groups[Catan.T.Pasture] = {size: 4, numbers: [], pos: []};
        groups[Catan.T.Mountains] = {size: 3, numbers: [], pos: []};
        groups[Catan.T.Fields] = {size: 4, numbers: [], pos: []};
        groups[Catan.T.Forest] = {size: 4, numbers: [], pos: []};
        var groupKeys = [Catan.T.Hills, Catan.T.Pasture, Catan.T.Mountains, Catan.T.Fields, Catan.T.Forest];

        // fill groups
        for (i = 0; i < numbers.length; ++i) {
            // add some rand (in case of lowest equality)
            Catan.Tools.shuffle(groupKeys);
            // look for the lowest tdsc sum
            var lowest;
            for (j = 0; j < groupKeys.length; j++) {
                // continue when size reached
                if (groups[groupKeys[j]].numbers.length == groups[groupKeys[j]].size) {
                    continue;
                }
                // init lowest
                if (lowest === undefined) {
                    lowest = groups[groupKeys[j]];
                    continue;
                }
                // update lowest
                if (Catan.Tools.tdscSum(lowest.numbers) > Catan.Tools.tdscSum(groups[groupKeys[j]].numbers)) {
                    lowest = groups[groupKeys[j]];
                }
            }
            lowest.numbers.push(numbers[i]);
        }

        // put the numbers in the map
        // and index lands groups
        this.each(function (i, j) {
            var current = map.get(i, j);
            if (current.land != Catan.T.Desert) {
                current.number = groups[current.land].numbers.pop();
                groups[current.land].pos.push({x: i, y: j});
            }
        });

        // define swap function (eye candy)
        var swapNumber = function (current, maxTdsc, maxNeighbourTdsc) {
            // swap current number with one in the same land group
            // choose the square with the lowest max(neighbour.number)
            // that make the sum goes below the limit
            var getMax = function (i, j) {
                var max = -1;
                var neighbour;
                map.eachNeighbour(i, j, function (x, y) {
                    neighbour = map.get(x, y);
                    if (neighbour.number !== undefined && Catan.Tools.tdsc(neighbour.number) > max) {
                        max = neighbour.number;
                    }
                    // can't swap with this neighbour
                    if (maxNeighbourTdsc !== undefined && Catan.Tools.tdsc(neighbour.number) > maxNeighbourTdsc) {
                        return;
                    }
                });
                return max;
            };

            // find the land to swap number with
            var min;
            var minCoord;
            var max;
            for (var c = 0; c < groups[current.land].pos.length; ++c) {
                var coord = groups[current.land].pos[c];
                if (Catan.Tools.tdsc(map.get(coord.x, coord.y).number) < maxTdsc) {
                    max = getMax(coord.x, coord.y);
                    if (max !== undefined) {
                        if (min === undefined || max < min) {
                            min = max;
                            minCoord = coord;
                        }
                    }
                }
            }

            // do the swap
            if (minCoord !== undefined) {
                var n = current.number;
                current.number = map.get(minCoord.x, minCoord.y).number;
                map.get(minCoord.x, minCoord.y).number = n;
            }
        };

        // do swap if > limit
        var coordinates = [];
        var eachPushCoordinatesFunction = function (i, j) {
            coordinates.push(new Catan.Position(i, j));
        };
        var isCoupleValidFunction = function (a, b) {
            return (a.land != Catan.T.Empty && b.land != Catan.T.Empty && a.number !== undefined && b.number !== undefined);
        };
        var doSwapFunction = function (ax, ay, bx, by) {
            a = map.get(ax, ay);
            b = map.get(bx, by);

            // when current trio sum is > trioLimit
            if (trioLimit < Catan.Tools.tdsc(a.number) + Catan.Tools.tdsc(b.number) + Catan.Tools.tdsc(current.number)) {
                overTrioLimit = true;
                swapNumber(current, trioLimit - ( Catan.Tools.tdsc(a.number) + Catan.Tools.tdsc(b.number)));
            }

            // when current and neighbour are > duoLimit
            if ((duoLimit < Catan.Tools.tdsc(a.number) + Catan.Tools.tdsc(current.number)) || (duoLimit < Catan.Tools.tdsc(b.number) + Catan.Tools.tdsc(current.number))) {
                overDuoLimit = true;
                // swap with a neighbour without a neighbour set to 5 tdsc
                swapNumber(
                    current,
                    trioLimit - (Catan.Tools.tdsc(a.number) + Catan.Tools.tdsc(b.number)),
                    duoLimit - Catan.Tools.tdsc(current.number)
                );
            }
        };
        var overTrioLimit = true;
        var overDuoLimit = true;
        for (var maxRepeat = 0; overTrioLimit && overDuoLimit && maxRepeat < 100; maxRepeat++) {
            overTrioLimit = false;
            overDuoLimit = false;

            // add some entropy
            coordinates = [];
            this.each(eachPushCoordinatesFunction);
            Catan.Tools.shuffle(coordinates);

            for (var c = 0; c < coordinates.length; ++c) {
                i = coordinates[c].column;
                j = coordinates[c].line;
                var current = map.get(i, j);
                var a, b;
                var trioLimit = tileTrioScoreLimit;
                var duoLimit = 9;
                // avoid desert
                if (current.number !== undefined) {
                    map.eachConsecutiveNeighbour(i, j, isCoupleValidFunction, doSwapFunction);
                }
            }
        }

        // test if all trio are below the limit
        return !(overTrioLimit || overDuoLimit);
    };


    Catan.Map.prototype.generateHarbors = function () {
        var map = this;
        var mod = Math.round(Math.random());
        var n = 0;

        // create harbors
        var landHarbors = [
            Catan.T.Hills, Catan.T.Forest,
            Catan.T.Fields, Catan.T.Mountains, Catan.T.Pasture
        ];
        Catan.Tools.shuffle(landHarbors);
        var empties = [Catan.T.Empty, Catan.T.Empty, Catan.T.Empty, Catan.T.Empty];
        var harbors = [];
        for (var i = empties.length; i > 0; --i) {
            harbors.push(landHarbors.pop());
            harbors.push(empties.pop());
        }
        harbors.push(landHarbors.pop());
        Catan.Tools.rotate(harbors, (Catan.Tools.randInterval(0, harbors.length - 1)));

        var harborCoords = [];

        // put harbors on map and index
        this.eachCoast(function (i, j) {
            // set oceans and harboors
            if (n++ % 2 != mod) {
                map.get(i, j).land = Catan.T.Ocean;
            } else {
                map.get(i, j).land = Catan.T.Harbor;
                map.get(i, j).circle = harbors.pop();

                if (map.get(i, j).circle != Catan.T.Empty) {
                    harborCoords.push(new Catan.Position(i, j));
                }
            }
        });

        var lands = [
            Catan.T.Hills,
            Catan.T.Pasture,
            Catan.T.Mountains,
            Catan.T.Fields,
            Catan.T.Forest,
            Catan.T.Desert
        ];

        // swap harbors
        var swapped = true;
        for (var limit = 0; swapped && limit < 30; limit++) {
            swapped = false;
            Catan.Tools.shuffle(harborCoords);
            for (var h = 0; h < harborCoords.length; h++) {
                var currentHarbor = map.get(harborCoords[h].column, harborCoords[h].line);
                var allowedLands = lands;
                allowedLands = this.getAllowedLands(harborCoords[h].column, harborCoords[h].line, allowedLands);

                if (!Catan.Tools.contains(allowedLands, currentHarbor.circle)) {
                    // find a place to go
                    for (var hh = 0; hh < harborCoords.length; hh++) {
                        allowedLands = lands;
                        allowedLands = this.getAllowedLands(harborCoords[hh].column, harborCoords[hh].line, allowedLands);
                        if (Catan.Tools.contains(allowedLands, currentHarbor.circle)) {
                            // do swap
                            var swapHarbor = map.get(harborCoords[hh].column, harborCoords[hh].line);
                            var cTmp = swapHarbor.circle;
                            swapHarbor.circle = currentHarbor.circle;
                            currentHarbor.circle = cTmp;
                            swapped = true;
                        }
                    }
                }
            }
        }
    };
})(Catan);