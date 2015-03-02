//noinspection JSHint
(function (Catan, PIXI) {
    "use strict";

    var textures = {};
    var renderer, stage, areAssetsLoaded = false;

    Catan.UI = {
        // if set to true, displays the coordinates system
        debug: false
    };

    Catan.UI.HighDefinition = {};
    Catan.UI.LowDefinition = {};

    Catan.UI.HighDefinition.getBase64String = function (renderer) {
        return renderer.view.toDataURL();
    };

    Catan.UI.HighDefinition.init = function(canvasContainer, width, height, loadedCallback) {
        if (renderer) {
            canvasContainer.appendChild(renderer.view);
            renderer.render(stage);
            loadedCallback();
            return renderer;
        }

        // You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer or PIXI.autoDetectRenderer
        // set a zero height at first so that the black screen is hidden
        renderer = new PIXI.CanvasRenderer(width, height);
        canvasContainer.appendChild(renderer.view);

        stage = new PIXI.Stage(0xFFFFFF);
        renderer.render(stage);

        var assets = [
            "img/field.png", "img/desert.png", "img/forest.png", "img/pasture.png",
            "img/hills.png","img/mountain.png","img/ocean.png","img/empty.png", "img/number.png"
        ];

        if (!areAssetsLoaded) {
            var loader = new PIXI.AssetLoader(assets, false);
            loader.onComplete = function(){
                textures[Catan.T.Fields] = PIXI.Texture.fromFrame("img/field.png");
                textures[Catan.T.Desert] = PIXI.Texture.fromFrame("img/desert.png");
                textures[Catan.T.Forest] = PIXI.Texture.fromFrame("img/forest.png");
                textures[Catan.T.Pasture] = PIXI.Texture.fromFrame("img/pasture.png");
                textures[Catan.T.Hills] = PIXI.Texture.fromFrame("img/hills.png");
                textures[Catan.T.Mountains] = PIXI.Texture.fromFrame("img/mountain.png");
                textures[Catan.T.Ocean] = PIXI.Texture.fromFrame("img/ocean.png");
                textures[Catan.T.Empty] = PIXI.Texture.fromFrame("img/empty.png");
                textures.token = PIXI.Texture.fromFrame("img/number.png");
                areAssetsLoaded = true;
                loadedCallback();
            };

            loader.load();
        } else {
            loadedCallback();
        }

        return renderer;
    };

    Catan.UI.HighDefinition.draw = function (renderer, map, width, height) {
        var stage = new PIXI.Stage(0xFFFFFF);

        var tileWidth = 200,
            tileHeight = 230;

        var mapScale = Math.min(width/(7*tileWidth), height/((19/3)*tileHeight));

        // create an empty container
        var tileContainer = new PIXI.DisplayObjectContainer();

        // tiles are rotated so width correspond to height
        tileContainer.position.x = (width / 2) - (((9/3) * tileWidth * mapScale) / 2);
        tileContainer.position.y = (height / 2) - ((8 * tileHeight * mapScale) / 2);
        tileContainer.pivot.x = 0.5;
        tileContainer.pivot.y = 0.5;
        tileContainer.rotation = Math.PI/6;
        tileContainer.scale.x = mapScale;
        tileContainer.scale.y = mapScale;
        var tiles = [];

        stage.addChild(tileContainer);

        var drawHexagonCallback = function(i, j){
            var hexagon = map.get(i, j);
            var cx = hexagon.position.column * tileWidth - ((hexagon.position.line + 1) % 2) * tileWidth / 2 + tileWidth / 2,
                cy = hexagon.position.line * (3 / 4 * tileHeight) + tileHeight / 2;// + canvasHeight / 2 - mapHeight / 2

            var tile;

            if (hexagon.isCoast()) {
                tile = new PIXI.Sprite(textures[Catan.T.Ocean]);
            } else {
                tile = new PIXI.Sprite(textures[hexagon.land]);
            }

            tile.position.x = cx;
            tile.position.y = cy;
            tile.scale.x = 1;
            tile.scale.y = 1;
            tile.anchor.x = 0.5;
            tile.anchor.y = 0.5;
            tile.rotation = - (Catan.Tools.randInterval(0,6) * 2 + 1) * Math.PI/6;
            tiles.push(tile);
            tileContainer.addChild(tile);

            if (hexagon.isLand() && hexagon.hasNumber()) {
                var token = new PIXI.Sprite(textures.token);
                token.position.x = cx;
                token.position.y = cy;
                token.scale.x = 1.1;
                token.scale.y = 1.1;
                token.anchor.x = 0.5;
                token.anchor.y = 0.5;
                tileContainer.addChild(token);

                var textSize = Catan.Tools.tdsc(hexagon.number) * 5 + 45;
                var textColor = Catan.Tools.tdsc(hexagon.number) >= 5 ? 'red' : 'black';
                var text = new PIXI.Text(hexagon.number, {font: textSize + "px Arial", fill:textColor});
                text.position.x = cx;
                text.position.y = cy;
                text.anchor.x = 0.5;
                text.anchor.y = 0.5;
                text.rotation = -Math.PI/6;
                tileContainer.addChild(text);
            }


            if (hexagon.isHarbor()) {
                var harbor = new PIXI.Sprite(textures[hexagon.land]);
                harbor.position.x = cx;
                harbor.position.y = cy;
                harbor.scale.x = 0.4;
                harbor.scale.y = 0.4;
                harbor.anchor.x = 0.5;
                harbor.anchor.y = 0.5;
                harbor.rotation = - (Catan.Tools.randInterval(0,6) * 2 + 1) * Math.PI/6;
                tileContainer.addChild(harbor);
            }
        };

        map.each(drawHexagonCallback);
        map.eachCoast(drawHexagonCallback);

        renderer.render(stage);
    };



    Catan.UI.LowDefinition.getBase64String = function (canvas) {
        return canvas.toDataURL();
    };

    Catan.UI.LowDefinition.drawMap = function (map, canvas) {
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
        ctx.clearRect (0, 0, canvas.width, canvas.height);

        for (var i = 0; i < map.board.length; i++) {
            for (var j = 0; j < map.board[i].length; j++) {
                Catan.UI.LowDefinition.drawHexagon(map.get(i, j), ctx, size, dist);
            }
        }
    };

    Catan.UI.LowDefinition.drawHexagon = function (hexagon, ctx, size, dist) {

        var getColorFromLand = function (land) {
            var color;
            switch (land) {
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
                case Catan.T.Empty:
                    color = "rgb(255, 255, 255)";
                    break;
                default:
                    throw "Can't find color for non-coast with this land type: '" + land + "'";
            }
            return color;
        };
        var getColorFromCoast = function (land) {
            var color;
            switch (land) {
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
                case Catan.T.Empty:
                    color = "rgb(255, 255, 255)";
                    break;
                default:
                    throw "Can't find color for coast with this land type: '" + land + "'";
            }
            return color;
        };

        var width = size.width,
            height = size.height,
            mapWidth = width * 7,
            mapHeight = height * 7 - (1/4 * height * 6),
            cx = hexagon.position.column * (width + dist) - ((hexagon.position.line + 1) % 2) * (width + dist) / 2 + width/2 + size.canvasWidth/2 - mapWidth/2,
            cy = hexagon.position.line * (3 / 4 * height + dist) + height/2 + size.canvasHeight/2 - mapHeight/2;

        ctx.fillStyle = hexagon.isCoast() ? "rgb(69, 91, 217)" : getColorFromLand(hexagon.land);
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

        if (hexagon.isHarbor()) {
            fillCircle(cx, cy, 11, getColorFromCoast(hexagon.land));
            ctx.stroke();
        }

        if (Catan.UI.debug) {
            // draw coordinates
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.font = "8pt Arial";
            ctx.fillText("[" + hexagon.position.column + "," + hexagon.position.line + "]", cx - width / 4 + 1, cy - 5);
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


})(Catan, PIXI);