//noinspection JSHint
(function(Catan){
    "use strict";

    Catan.Tools = {};

    Catan.Tools.shuffle = function (a) {
        return a.sort(function () {
            return 0.5 - Math.random();
        });
    };

    Catan.Tools.contains = function (a, o) {
        return (a.indexOf(o) >= 0);
    };

    Catan.Tools.removeOne = function (a, o) {
        var removed = false;
        return a.filter(function (element, index, array) {
            if (removed) {
                return true;
            }
            if (element === o) {
                removed = true;
                return false;
            }
            return true;
        });
    };

    Catan.Tools.sum = function (a) {
        var sum = 0;
        for (var i = 0; i < a.length; ++i) {
            sum += this[i];
        }
        return sum;
    };

    Catan.Tools.tdscSum = function (a) {
        var sum = 0;
        for (var i = 0; i < a.length; ++i) {
            sum += Catan.Tools.tdsc(a[i]);
        }
        return sum;
    };

    Catan.Tools.rotate = function (a, inc)
    {
        var l = a.length, i, x;
        inc = Math.abs(inc) >= l && (inc %= l) ||
            inc < 0 && (inc += l) ||
            inc;
        for (; inc; inc = (Math.ceil(l / inc) - 1) * inc - l + (l = inc)) {
            for (i = l; i > inc; x = a[--i], a[i] = a[i - inc], a[i - inc] = x) {
                // nothing
            }
        }
    };

    // the number of two dice combination with a sum equal to this number
    Catan.Tools.twoDiceSum = {2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1};
    Catan.Tools.tdsc = function (n) {
        if (n > 12 || n < 2) {
            return 0;
        }
        return Catan.Tools.twoDiceSum[n];
    };

    Catan.Tools.randInterval = function (from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    };

})(Catan);