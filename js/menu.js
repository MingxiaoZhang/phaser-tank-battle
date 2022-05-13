class Menu {
    create(data) {
        let score = data.score ? data.score : 0;
        let bg = this.add.image(0, 0, 'background').setOrigin(0);
        bg.setScale(2);
        let menuText = this.add.text(400, 170, 'TANK BATTLE', {font: '100px', fontWeight: '900'});
        menuText.setOrigin(0.5,0.5);
        let playerText = this.add.text(400, 320, 'Press \'space\' to start', {font: '40px'});
        playerText.setOrigin(0.5,0.5);
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (this.upKey.isDown) {
            this.scene.start('play');
        }
    }
}
