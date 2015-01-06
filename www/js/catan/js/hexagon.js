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

    Catan.Hexagon.prototype.draw = function (ctx, size, dist) {
        var x = this.x;
        var y = this.y;

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
            cx = x * (width + dist) - ((y + 1) % 2) * (width + dist) / 2 + width/2 + size.canvasWidth/2 - mapWidth/2,
            cy = y * (3 / 4 * height + dist) + height/2 + size.canvasHeight/2 - mapHeight/2;

        ctx.fillStyle = getColorFromTerrain(this.terrain);
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

        if (this.terrain == Catan.T.Harbor) {
            fillCircle(cx, cy, 11, getColorFromTerrain(this.circle));
            ctx.stroke();
        }

        if (Catan.debug) {
            // draw coordinates
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.font = "8pt Arial";
            ctx.fillText("[" + x + "," + y + "]", cx - width / 4 + 1, cy - 5);
            if (this.number !== undefined) {
                ctx.font = "12pt Arial";
                ctx.fillText(this.number + "|" + Catan.Tools.tdsc(this.number), cx - width / 4, cy + 10);
            }
        } else {
            // draw coordinates
            if (this.number !== undefined) {
                //draw a circle
                fillCircle(cx, cy, Math.min(width, height) / 3, "rgb(255, 255, 255)");

                // write number
                var deltaY = 0;
                if (Catan.Tools.tdsc(this.number) < 3) {
                    ctx.fillStyle = "rgb(0, 0, 0)";
                    ctx.font = "8pt Arial";
                    deltaY = 5;
                } else if (Catan.Tools.tdsc(this.number) < 5) {
                    ctx.fillStyle = "rgb(0, 0, 0)";
                    ctx.font = "12pt Arial";
                    deltaY = 6;
                } else {
                    ctx.fillStyle = "rgb(245, 24, 24)";
                    ctx.font = "bold 12pt Arial";
                    deltaY = 6;
                }
                var txtMetrics = ctx.measureText(this.number);
                var txtWidth = txtMetrics.width;
                ctx.fillText(this.number, cx - txtWidth / 2, cy + deltaY);
                ctx.stroke();
            }
        }
    };

    Catan.Hexagon.prototype.isEmpty = function () {
        return this.terrain == Catan.T.Empty;
    };

})(Catan);