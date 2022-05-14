window.onload = function() {
    let config = {
        width: 800,
        height: 600,
        backgroundColor: '#25cebd',
        physics: {default: 'arcade'},
        parent: 'game',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            min: {
                width: 800,
                height: 600,
            },
            max: {
                width: 2000,
                height: 1500,
            },
        },
    };
    let game = new Phaser.Game(config);
    game.scene.add('load', Load);
    game.scene.add('menu', Menu);
    game.scene.add('play', Play);
    game.scene.add('winner', Winner);
    game.scene.start('load');
};
