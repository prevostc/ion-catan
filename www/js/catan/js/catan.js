var Catan;
Catan = (function () {
    "use strict";

    var Catan = {
        debug: false,

        T: {
            Hills: 1,
            Pasture: 2,
            Mountains: 3,
            Fields: 4,
            Forest: 5,
            Desert: 6,
            Ocean: 7,
            Harbor: 8,
            Empty: 9
        }
    };


    Catan.generateMap = function (canvas, tileTrioScoreLimit) {
        tileTrioScoreLimit = tileTrioScoreLimit || 12;

        var terrains;
        var res;
        var map;

        do {

            map = new Catan.Map(7, 7, [3, 3]);
            do {
                terrains = map.generateTerrains();
            } while (terrains.length > 0);

            res = map.generateNumbers(tileTrioScoreLimit);
        } while (!res);

        map.generateHarbors();

        Catan.UI.drawMap(map, canvas);
        return map;
    };

    return Catan;
})();
