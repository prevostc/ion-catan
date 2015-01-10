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
                allowedLands = map.getAllowedLands(harborCoords[h].column, harborCoords[h].line, allowedLands);

                if (!Catan.Tools.contains(allowedLands, currentHarbor.circle)) {
                    // find a place to go
                    for (var hh = 0; hh < harborCoords.length; hh++) {
                        allowedLands = lands;
                        allowedLands = map.getAllowedLands(harborCoords[hh].column, harborCoords[hh].line, allowedLands);
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