(function(Catan) {
    "use strict";

    // 2 	3 	4 	5 	6 	7 	8 	9 	10 	11 	12
    // 1	2	3	4	5	6	5	4 	3	2	1
    Catan.Hexagon = function (pos, land) {
        this.position = pos;
        this.land = land;
    };

    Catan.Hexagon.prototype.isEmpty = function () {
        return this.land == Catan.T.Empty;
    };
    Catan.Hexagon.prototype.isCoast = function () {
        return false;
    };
    Catan.Hexagon.prototype.isHarbor = function () {
        return false;
    };
    Catan.Hexagon.prototype.isLand = function () {
        return false;
    };


    Catan.Hexagon.Land = function (pos, land) {
        Catan.Hexagon.call(this, pos, land);
        this.number = undefined;
    };
    Catan.Hexagon.Land.prototype = new Catan.Hexagon();

    Catan.Hexagon.Land.prototype.isLand = function () {
        return false;
    };


    Catan.Hexagon.Coast = function (pos, land) {
        Catan.Hexagon.call(this, pos, land);
    };
    Catan.Hexagon.Coast.prototype = new Catan.Hexagon();

    Catan.Hexagon.Coast.prototype.isCoast = function () {
        return true;
    };
    Catan.Hexagon.Coast.prototype.isHarbor = function () {
        return this.land !== Catan.T.Ocean;
    };

})(Catan);