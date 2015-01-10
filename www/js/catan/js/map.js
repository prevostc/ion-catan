(function(Catan){
    "use strict";

    Catan.Map = function (height, width, center) {
        this.board = [];
        for (var i = 0; i < width; i++) {
            this.board[i] = [];
            for (var j = 0; j < height; j++) {
                this.board[i][j] = new Catan.Hexagon(Catan.T.Empty, new Catan.Position(i, j));
            }
        }
        this.center = center;
    };


    Catan.Map.prototype.each = function (callback) {
        var line;
        for (var col = this.center.column - 1; col <= this.center.column + 1; col++) {
            for (line = this.center.line - 2; line <= this.center.line + 2; line++) {
                callback(col, line);
            }
        }
        for (line = this.center.line - 1; line <= this.center.line + 1; line++) {
            callback(this.center.column + 2, line);
        }
        callback(this.center.column - 2, this.center.line);
    };

    Catan.Map.prototype.eachCoast = function (callback) {
        for (var col = this.center.column - 1; col <= this.center.column + 2; col++) {
            callback(col, this.center.line - 3);
        }
        var orderedCoordinates = [
            [this.center.column + 2, this.center.line - 2],
            [this.center.column + 3, this.center.line - 1],
            [this.center.column + 3, this.center.line],
            [this.center.column + 3, this.center.line + 1],
            [this.center.column + 2, this.center.line + 2]
        ];
        for (var i = 0; i < orderedCoordinates.length; i++) {
            callback(orderedCoordinates[i][0], orderedCoordinates[i][1]);
        }
        for (col = this.center.column + 2; col >= this.center.column - 1; col--) {
            callback(col, this.center.line + 3);
        }

        orderedCoordinates = [
            [this.center.column - 2, this.center.line + 2],
            [this.center.column - 2, this.center.line + 1],
            [this.center.column - 3, this.center.line],
            [this.center.column - 2, this.center.line - 1],
            [this.center.column - 2, this.center.line - 2]
        ];
        for (i = 0; i < orderedCoordinates.length; i++) {
            callback(orderedCoordinates[i][0], orderedCoordinates[i][1]);
        }
    };

    Catan.Map.prototype.get = function (column, line) {
        if (this.board[column] === undefined) {
            return undefined;
        }
        return this.board[column][line];
    };

    Catan.Map.prototype.eachNeighbour = function (col, line, callback) {
        var orderedNeighbourCoordinates =
                (0 === line % 2) ?
                    [
                        [col - 1, line - 1],
                        [col - 1, line],
                        [col - 1, line + 1],
                        [col, line + 1],
                        [col + 1, line],
                        [col, line - 1]
                    ]
                    : [
                    [col + 1, line - 1],
                    [col + 1, line],
                    [col + 1, line + 1],
                    [col, line + 1],
                    [col - 1, line],
                    [col, line - 1]
                ]
            ;
        var neighbour;
        for (var i = 0; i < orderedNeighbourCoordinates.length; i++) {
            neighbour = this.get(orderedNeighbourCoordinates[i][0], orderedNeighbourCoordinates[i][1]);
            if (neighbour !== undefined) {
                callback(neighbour.position.column, neighbour.position.line);
            }
        }
    };


    Catan.Map.prototype.eachConsecutiveNeighbour = function (col, line, coupleValid, callback) {
        var map = this;
        var elements = [];

        this.eachNeighbour(col, line, function (x, y) {
            elements.push([x, y]);
        });

        var a;
        var b;
        for (var i = 0; i + 1 < elements.length; ++i) {
            a = map.get(elements[i][0], elements[i][1]);
            b = map.get(elements[i + 1][0], elements[i + 1][1]);
            if (coupleValid(a, b)) {
                callback(elements[i][0], elements[i][1], elements[i + 1][0], elements[i + 1][1]);
            }
        }
        a = map.get(elements[elements.length - 1][0], elements[elements.length - 1][1]);
        b = map.get(elements[0][0], elements[0][1]);
        if (coupleValid(a, b)) {
            callback(elements[elements.length - 1][0], elements[elements.length - 1][1], elements[0][0], elements[0][1]);
        }
        // reset elements
        elements = [];

    };

    Catan.Map.prototype.getAllowedLands = function (i, j, allowedLands) {
        var map = this;
        this.eachNeighbour(i, j, function (x, y) {
            // remove neighbours lands from allowed lands
            allowedLands = allowedLands.filter(function (element, index, array) {
                return (map.get(x, y).land != element);
            });
        });
        return allowedLands;
    };


})(Catan);