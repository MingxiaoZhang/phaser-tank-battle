class Load {
    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('player', 'assets/tank.png');
        this.load.image('player2', 'assets/tank2.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('pixel', 'assets/pixel.png');
        this.load.image('tileset', 'assets/tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');

        let loadLabel = this.add.text(250, 170, 'loading');
    }

    create() {
        this.scene.start('menu');
    }
}
