//noinspection JSHint
(function (Catan, PIXI) {
    "use strict";

    var textures = {};

    Catan.UI = {
        // if set to true, displays the coordinates system
        debug: false
    };

    Catan.UI.init = function(canvasContainerSelector, width, height) {
        var canvasContainer = document.querySelector(canvasContainerSelector);

        // You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer or PIXI.autoDetectRenderer
        var renderer = new PIXI.CanvasRenderer(width, height);
        canvasContainer.appendChild(renderer.view);
        var stage = new PIXI.Stage(0xFFFFFF);
        renderer.render(stage);

        textures[Catan.T.Fields] = PIXI.Texture.fromImage("img/field.png");
        textures[Catan.T.Desert] = PIXI.Texture.fromImage("img/desert.png");
        textures[Catan.T.Forest] = PIXI.Texture.fromImage("img/forest.png");
        textures[Catan.T.Pasture] = PIXI.Texture.fromImage("img/pasture.png");
        textures[Catan.T.Hills] = PIXI.Texture.fromImage("img/hills.png");
        textures[Catan.T.Mountains] = PIXI.Texture.fromImage("img/mountain.png");
        textures[Catan.T.Ocean] = PIXI.Texture.fromImage("img/ocean.png");
        textures[Catan.T.Empty] = PIXI.Texture.fromImage("img/empty.png");
        textures.token = PIXI.Texture.fromImage("img/number.png");

        return renderer;
    };

    Catan.UI.draw = function (renderer, map, width, height) {
        renderer.resize(width, height);

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

})(Catan, PIXI);