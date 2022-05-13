class Winner {
    create(data) {
        let winner = data.winner;
        let bg = this.add.image(0, 0, 'background').setOrigin(0);
        bg.setScale(2);
        let menuText = this.add.text(400, 170, 'Winner is ' + winner, {font: '80px', fontWeight: '900'});
        menuText.setOrigin(0.5,0.5);
        let playerText = this.add.text(400, 320, 'Press \'space\' to return to Menu', {font: '40px'});
        playerText.setOrigin(0.5,0.5);
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (this.upKey.isDown) {
            this.scene.start('menu');
        }
    }
}
