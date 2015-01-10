(function(Catan) {

    Catan.Generator.Harbor = {};

    Catan.Generator.Harbor.generate = function (map) {
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
        map.eachCoast(function (i, j) {
            // set oceans and harboors
            if (n++ % 2 != mod) {
                map.get(i, j).land = Catan.T.Ocean;
            } else {
                map.get(i, j).land = harbors.pop();

                if (map.get(i, j).land != Catan.T.Empty) {
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
                allowedLands = map.getAllowedLands(harborCoords[h].column, harborCoords[h].line, allowedLands);

                if (!Catan.Tools.contains(allowedLands, currentHarbor.land)) {
                    // find a place to go
                    for (var hh = 0; hh < harborCoords.length; hh++) {
                        allowedLands = lands;
                        allowedLands = map.getAllowedLands(harborCoords[hh].column, harborCoords[hh].line, allowedLands);
                        if (Catan.Tools.contains(allowedLands, currentHarbor.land)) {
                            // do swap
                            var swapHarbor = map.get(harborCoords[hh].column, harborCoords[hh].line);
                            var cTmp = swapHarbor.land;
                            swapHarbor.land = currentHarbor.land;
                            currentHarbor.land = cTmp;
                            swapped = true;
                        }
                    }
                }
            }
        }
    };


    Catan.Generator.Harbor.generateCoastBars = function (map) {
        var coastBarsOrderedClockwiseType1 = [
            [Catan.T.Empty, Catan.T.Ocean, Catan.T.Hills],
            [Catan.T.Empty, Catan.T.Ocean, Catan.T.Pasture],
            [Catan.T.Empty, Catan.T.Ocean, Catan.T.Fields]
        ];
        var coastBarsOrderedClockwiseType2 = [
            [Catan.T.Ocean, Catan.T.Empty, Catan.T.Ocean],
            [Catan.T.Ocean, Catan.T.Forest, Catan.T.Ocean],
            [Catan.T.Ocean, Catan.T.Mountains, Catan.T.Ocean]
        ];

        Catan.Tools.shuffle(coastBarsOrderedClockwiseType1);
        Catan.Tools.shuffle(coastBarsOrderedClockwiseType2);

        var coastLandTypesOrderedClockwise = [];
        for (var i = 0 ; i < 6 ; i++) {
            var harborBars = i % 2 ? coastBarsOrderedClockwiseType1 : coastBarsOrderedClockwiseType2;
            var harborBar = harborBars.pop();
            coastLandTypesOrderedClockwise.push(harborBar.pop());
            coastLandTypesOrderedClockwise.push(harborBar.pop());
            coastLandTypesOrderedClockwise.push(harborBar.pop());
        }

        map.eachCoast(function (column, line) {
            var harbor = map.get(column, line);
            harbor.land = coastLandTypesOrderedClockwise.pop();
        });
    };
})(Catan);