(function(Catan) {

    Catan.Generator = {};

    Catan.Generator.Map = {};

    Catan.Generator.Map.generate = function (tileTrioScoreLimit) {
        tileTrioScoreLimit = tileTrioScoreLimit || 12;

        var lands, res, map;

        do {
            map = new Catan.Map(7, 7, new Catan.Position(3, 3));
            do {
                lands = Catan.Generator.Land.generate(map);
            } while (lands.length > 0);

            res = Catan.Generator.Number.generate(map, tileTrioScoreLimit);
        } while (!res);

        Catan.Generator.Harbor.generateCoastBars(map);

        return map;
    };

})(Catan);