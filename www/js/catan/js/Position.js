//noinspection JSHint
(function (Catan) {
    "use strict";

    Catan.Position = function(column, line) {
        this.column = column;
        this.line = line;

        // Make the position immutable
        Object.freeze(this);
    };

    Catan.Position.serialize = function(position) {
        return position;
    };

    Catan.Position.unserialize = function(serializedPosition) {
        return new Catan.Position(serializedPosition.column, serializedPosition.line);
    };

})(Catan);
