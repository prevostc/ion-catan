//noinspection JSHint
(function(Catan) {
    "use strict";

    Catan.Generator.Land = {};

    Catan.Generator.Land.generate = function (map) {
        var allowedLands;
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
        map.each(function (i, j) {
            map.get(i, j).land = lands.pop();
        });

        // unset same lands neighbours
        var emptySpots = [];
        map.each(function (i, j) {
            var a;
            var b;
            map.eachConsecutiveNeighbour(i, j, function (a, b) {
                return (a.land === b.land && a.land !== Catan.T.Empty && a.land !== undefined);
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
            allowedLands = map.getAllowedLands(emptySpots[i].column, emptySpots[i].line, lands);

            if (allowedLands.length > 0) {
                map.get(emptySpots[i].column, emptySpots[i].line).land = allowedLands[0];
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
            if (!swapped && !(i === ex && j === ey) && Catan.Tools.contains(allowedLands, map.get(i, j).land)) {
                var currentAllowedLands = map.getAllowedLands(i, j, allLands);
                for (var t = 0; t < lands.length && !swapped; t++) {
                    if (map.get(i, j).land !== lands[t] && Catan.Tools.contains(currentAllowedLands, lands[t])) {
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
            allowedLands = map.getAllowedLands(ex, ey, allLands);
            // if smth is allowed
            if (allowedLands.length > 0) {
                swapped = false;
                map.each(eachSwapFunction);
            }
        }

        return lands;
    };
})(Catan);