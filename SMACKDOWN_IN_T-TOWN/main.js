var ASSET_MANAGER = new AssetManager();

//Add assets for download.
ASSET_MANAGER.queueDownload("./img/alex_sprite_new.png");
ASSET_MANAGER.queueDownload("./img/alex_sprite_new2.png");

ASSET_MANAGER.queueDownload("./img/John_Sprites_Right.png");
ASSET_MANAGER.queueDownload("./img/John_Sprites_Left.png");

ASSET_MANAGER.queueDownload("./img/Vlad_Sprite.png");
ASSET_MANAGER.queueDownload("./img/Vlad_Sprite_reverse.png");

ASSET_MANAGER.queueDownload("./img/syrym1.png");
ASSET_MANAGER.queueDownload("./img/syrym1reversed.png");

ASSET_MANAGER.queueDownload("./img/boss.png");
ASSET_MANAGER.queueDownload("./img/boss_left.png");

ASSET_MANAGER.queueDownload("./img/startup.png");
ASSET_MANAGER.queueDownload("./img/char_select.png");
ASSET_MANAGER.queueDownload("./img/staircase.png");
ASSET_MANAGER.queueDownload("./img/union_station.png");
ASSET_MANAGER.queueDownload("./img/ghettoalley.png");
ASSET_MANAGER.queueDownload("./img/narrows.png");
ASSET_MANAGER.queueDownload("./img/boss_background.jpg")

ASSET_MANAGER.queueDownload("./img/youwin.png")
ASSET_MANAGER.queueDownload("./img/youlose.png")

ASSET_MANAGER.queueDownload("./img/lifebarRIGHT.png");
ASSET_MANAGER.queueDownload("./img/lifebarLEFT.png");
ASSET_MANAGER.queueDownload("./img/green1.png");
ASSET_MANAGER.queueDownload("./img/numbers.png");
ASSET_MANAGER.queueDownload("./img/x.png");

//Load assets
ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    var gameEngine = new GameEngine();

    gameEngine.init(ctx);
    gameEngine.start();
});
