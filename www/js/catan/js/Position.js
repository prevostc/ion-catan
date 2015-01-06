(function (Catan) {
    "use strict";

    Catan.Position = function(column, line) {
        this.column = column;
        this.line = line;

        // Make the position immutable
        Object.freeze(this);
    };

})(Catan);
