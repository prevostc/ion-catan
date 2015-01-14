//noinspection JSHint
(function (Catan, PIXI) {
    "use strict";

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


        // create a new loader
        var loader = new PIXI.AssetLoader([ "img/spritesheet.json"]);

        //begin load
        loader.load();

        return renderer;
    };

    Catan.UI.draw = function (renderer, map, width, height) {
        renderer.resize(width, height);

        var stage = new PIXI.Stage(0xFFFFFF);

        // holder to store aliens
        var aliens = [];
        var alienFrames = ["field.png", "desert.png", "forest.png", "ocean.png", "pasture.png", "hills.png", "mountain.png"];

        var count = 0;

        var tileWidth = 50,
            tileHeight = 50;

        // create an empty container
        var tileContainer = new PIXI.DisplayObjectContainer();
        tileContainer.position.x = (width / 2) - ((7 * tileWidth) / 2);
        tileContainer.position.y = (height / 2) - ((7 * tileHeight) / 2);
        tileContainer.scale.x = 1;
        tileContainer.scale.y = 1;
        var tiles = [];

        stage.addChild(tileContainer);

        var getSpriteNameLand = function (land) {
            var spriteName;
            var items = ["ocean.png", "mountain.png"];
            return items[Math.floor(Math.random()*items.length)];
            switch (land) {
                case Catan.T.Fields: spriteName = "field.png";break;
                case Catan.T.Desert: spriteName = "desert.png";break;
                case Catan.T.Forest: spriteName = "forest.png";break;
                case Catan.T.Pasture: spriteName = "pasture.png";break;
                case Catan.T.Hills: spriteName = "hills.png";break;
                case Catan.T.Mountains: spriteName = "mountain.png";break;
                case Catan.T.Ocean: spriteName = "ocean.png";break;
                case Catan.T.Empty: spriteName = "ocean.png";break;
                default:
                    throw "Can't find color for non-coast with this land type: '" + land + "'";
            }
            return spriteName;
        };

        var drawHexagonCallback = function(i, j){
            var hexagon = map.get(i, j);
            var tile = PIXI.Sprite.fromFrame(getSpriteNameLand(hexagon.land));

            var cx = hexagon.position.column * tileWidth - ((hexagon.position.line + 1) % 2) * tileWidth / 2 + tileWidth / 2,
                cy = hexagon.position.line * (3 / 4 * tileHeight) + tileHeight / 2;// + canvasHeight / 2 - mapHeight / 2


            tile.position.x = cx;
            tile.position.y = cy;
            tile.anchor.x = 0.5;
            tile.anchor.y = 0.5;
            tile.scale.x = 0.15;
            tile.scale.y = 0.15;
            tile.rotation = Math.PI/2;
            tiles.push(tile);
            tileContainer.addChild(tile);

            var text = new PIXI.Text("[" + cx + ';' + cy + ']', {font:"11px Arial", fill:"red"});
            text.position.x = cx;
            text.position.y = cy;
            text.anchor.x = 0.5;
            text.anchor.y = 0.5;
            tileContainer.addChild(text);


            renderer.render(stage);
        };

        map.each(drawHexagonCallback);
        map.eachCoast(drawHexagonCallback);

        renderer.render(stage);
    };



})(Catan, PIXI);