(function(Catan) {

    Catan.Generator.Land = {};

    Catan.Generator.Land.generate = function (canvas, tileTrioScoreLimit) {
        tileTrioScoreLimit = tileTrioScoreLimit || 12;

        var lands, res, map;

        do {
            map = new Catan.Map(7, 7, new Catan.Position(3, 3));
            do {
                lands = map.generateLands();
            } while (lands.length > 0);

            res = map.generateNumbers(tileTrioScoreLimit);
        } while (!res);

        map.generateHarbors();

        Catan.UI.drawMap(map, canvas);
        return map;
    };
})(Catan);