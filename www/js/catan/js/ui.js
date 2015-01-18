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
        textures[Catan.T.Empty] = PIXI.Texture.fromImage("img/ocean.png");
        textures["number"] = PIXI.Texture.fromImage("img/number.png");

        return renderer;
    };

    Catan.UI.draw = function (renderer, map, width, height) {
        renderer.resize(width, height);

        var stage = new PIXI.Stage(0xFFFFFF);

        var tileWidth = 200,
            tileHeight = 230;

        // create an empty container
        var tileContainer = new PIXI.DisplayObjectContainer();
        //tileContainer.position.x = (width / 2) - ((7 * tileWidth) / 2);
        //tileContainer.position.y = (height / 2) - ((7 * tileHeight) / 2);
        tileContainer.scale.x = 0.5;
        tileContainer.scale.y = 0.5;
        var tiles = [];

        stage.addChild(tileContainer);

        var drawHexagonCallback = function(i, j){
            var hexagon = map.get(i, j);
            var cx = hexagon.position.column * tileWidth - ((hexagon.position.line + 1) % 2) * tileWidth / 2 + tileWidth / 2,
                cy = hexagon.position.line * (3 / 4 * tileHeight) + tileHeight / 2;// + canvasHeight / 2 - mapHeight / 2

            var tile, number;

            if (hexagon.isCoast()) {
                tile = new PIXI.Sprite(textures[Catan.T.Ocean]);
                number = null;
            } else {
                tile = new PIXI.Sprite(textures[hexagon.land]);
                number = new PIXI.Sprite(textures["number"]);
            }

            tile.position.x = cx;
            tile.position.y = cy;
            tile.scale.x = 1;
            tile.scale.y = 1;
            tile.anchor.x = 0.5;
            tile.anchor.y = 0.5;
            tile.rotation = Math.PI/6;
            tiles.push(tile);
            tileContainer.addChild(tile);

            if (number !== null) {
                number.position.x = cx;
                number.position.y = cy;
                number.scale.x = 0.8;
                number.scale.y = 0.8;
                number.anchor.x = 0.5;
                number.anchor.y = 0.5;
                tileContainer.addChild(number);
            }

            var text = new PIXI.Text("Pixi.js can has text!", {font:"50px Arial", fill:"red"});
            stage.addChild(text);
            //renderer.render(stage);
        };

        map.each(drawHexagonCallback);
        map.eachCoast(drawHexagonCallback);

        renderer.render(stage);
    };



})(Catan, PIXI);