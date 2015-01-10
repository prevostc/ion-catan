(function(Catan) {

    Catan.Generator.Number = {};

    Catan.Generator.Number.generate = function (map, tileTrioScoreLimit) {
        var i, j;
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
        map.each(function (i, j) {
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
            map.each(eachPushCoordinatesFunction);
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
})(Catan);