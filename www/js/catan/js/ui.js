(function(Catan){
    "use strict";

    Catan.UI = {};

    Catan.UI.drawMap = function (map, canvas) {
        var ctx = canvas.getContext('2d');

        // align numbers
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var screenW = canvas.width;
        var size = {
            width: screenW / 9,
            height: screenW / 9 + screenW / 90,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height
        };
        var dist = 2;

        // reset canvas
        //noinspection SillyAssignmentJS
        canvas.width = canvas.width;

        for (var i = 0; i < map.board.length; i++) {
            for (var j = 0; j < map.board[i].length; j++) {
                if (map.get(i, j).terrain != Catan.T.Empty) {
                    Catan.UI.drawHexagon(map.get(i, j), ctx, size, dist);
                }
            }
        }
    };

    Catan.UI.drawHexagon = function (hexagon, ctx, size, dist) {

        var getColorFromTerrain = function (terrain) {
            var color;
            switch (terrain) {
                case Catan.T.Hills:
                    color = "rgb(224, 129, 27)";
                    break;
                case Catan.T.Pasture:
                    color = "rgb(43, 224, 27)";
                    break;
                case Catan.T.Mountains:
                    color = "rgb(145, 145, 145)";
                    break;
                case Catan.T.Fields:
                    color = "rgb(229, 255, 0)";
                    break;
                case Catan.T.Forest:
                    color = "rgb(8, 150, 34)";
                    break;
                case Catan.T.Desert:
                    color = "rgb(255, 255, 117)";
                    break;
                case Catan.T.Harbor:
                case Catan.T.Ocean:
                    color = "rgb(69, 91, 217)";
                    break;
                case Catan.T.Empty:
                    color = "rgb(255, 255, 255)";
                    break;
            }
            return color;
        };

        var width = size.width,
            height = size.height,
            mapWidth = width * 7,
            mapHeight = height * 7 - (1/4 * height * 6),
            cx = hexagon.position.column * (width + dist) - ((hexagon.position.line + 1) % 2) * (width + dist) / 2 + width/2 + size.canvasWidth/2 - mapWidth/2,
            cy = hexagon.position.line * (3 / 4 * height + dist) + height/2 + size.canvasHeight/2 - mapHeight/2;

        ctx.fillStyle = getColorFromTerrain(hexagon.terrain);
        ctx.beginPath();
        ctx.moveTo(cx, cy - height / 2);
        ctx.lineTo(cx + width / 2, cy - height / 4);
        ctx.lineTo(cx + width / 2, cy + height / 4);
        ctx.lineTo(cx, cy + height / 2);
        ctx.lineTo(cx - width / 2, cy + height / 4);
        ctx.lineTo(cx - width / 2, cy - height / 4);
        ctx.lineTo(cx, cy - height / 2);
        ctx.fill();

        var fillCircle = function (cx, cy, r, c) {
            ctx.lineWidth = 2;
            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        };

        if (hexagon.terrain == Catan.T.Harbor) {
            fillCircle(cx, cy, 11, getColorFromTerrain(hexagon.circle));
            ctx.stroke();
        }

        if (Catan.debug) {
            // draw coordinates
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.font = "8pt Arial";
            ctx.fillText("[" + x + "," + y + "]", cx - width / 4 + 1, cy - 5);
            if (hexagon.number !== undefined) {
                ctx.font = "12pt Arial";
                ctx.fillText(hexagon.number + "|" + Catan.Tools.tdsc(hexagon.number), cx - width / 4, cy + 10);
            }
        } else {
            // draw coordinates
            if (hexagon.number !== undefined) {
                //draw a circle
                fillCircle(cx, cy, Math.min(width, height) / 3, "rgb(255, 255, 255)");

                // write number
                var deltaY = 0;
                if (Catan.Tools.tdsc(hexagon.number) < 3) {
                    ctx.fillStyle = "rgb(0, 0, 0)";
                    ctx.font = "8pt Arial";
                    deltaY = 5;
                } else if (Catan.Tools.tdsc(hexagon.number) < 5) {
                    ctx.fillStyle = "rgb(0, 0, 0)";
                    ctx.font = "12pt Arial";
                    deltaY = 6;
                } else {
                    ctx.fillStyle = "rgb(245, 24, 24)";
                    ctx.font = "bold 12pt Arial";
                    deltaY = 6;
                }
                var txtMetrics = ctx.measureText(hexagon.number);
                var txtWidth = txtMetrics.width;
                ctx.fillText(hexagon.number, cx - txtWidth / 2, cy + deltaY);
                ctx.stroke();
            }
        }
    };

})(Catan);