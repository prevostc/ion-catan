//noinspection JSHint
(function(Catan) {
    "use strict";

    Catan.Generator = {};

    Catan.Generator.Map = {};

    Catan.Generator.Map.generate = function (tileTrioScoreLimit, harborGenerationStrategyName) {
        tileTrioScoreLimit = tileTrioScoreLimit || 12;

        var lands, res, map;

        do {
            map = new Catan.Map(7, 7, new Catan.Position(3, 3));
            do {
                lands = Catan.Generator.Land.generate(map);
            } while (lands.length > 0);

            res = Catan.Generator.Number.generate(map, tileTrioScoreLimit);
        } while (!res);

        if (harborGenerationStrategyName === 'coast-bars') {
            Catan.Generator.Harbor.generateCoastBars(map);
        } else {
            Catan.Generator.Harbor.generate(map);
        }
        return map;
    };

})(Catan);