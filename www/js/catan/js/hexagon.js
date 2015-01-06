(function(Catan){


    // 2 	3 	4 	5 	6 	7 	8 	9 	10 	11 	12
    // 1	2	3	4	5	6	5	4 	3	2	1
    Catan.Hexagon = function (terrain, pos) {
        this.terrain = terrain;
        this.x = pos[0];
        this.y = pos[1];
        this.number = undefined;
        this.circle = undefined;
    };

    Catan.Hexagon.prototype.isEmpty = function () {
        return this.terrain == Catan.T.Empty;
    };

})(Catan);