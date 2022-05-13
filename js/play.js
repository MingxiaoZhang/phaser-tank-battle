class Play {
    create ()
    {
        // Add player 1
        this.player = this.physics.add.sprite(131, 297, 'player');
        this.player.setScale(0.1);
        this.player.angle = 90;
        this.player.hp = 5;

        // Add player 2
        this.player2 = this.physics.add.sprite(547, 211, 'player2');
        this.player2.setScale(0.1);
        this.player2.angle = 180;
        this.player2.hp = 5;

        // Controls for player 1
        this.arrow = this.input.keyboard.createCursorKeys();
        this.fireKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

        // Controls for player 2
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };
        this.fireKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Create map
        this.createWorld();

        // Show score
        this.scoreText = this.add.text(650, 80, this.player.x + '\n' + this.player.y);

        this.time = 0;
        this.lastFire = 0;
        this.lastFire2 = 0;
        this.timeText = this.add.text(650, 200, this.time);
    }

    update ()
    {
        this.movePlayer(this.arrow, this.player);
        this.movePlayer(this.wasd, this.player2);

        // Set collision
        this.physics.collide(this.player, this.walls);
        this.physics.collide(this.player2, this.walls);
        this.physics.collide(this.player2, this.player);

        // Update score
        this.scoreText.setText(this.player.x + '\n' + this.player.y);

        if (this.fireKey1.isDown) {
            if (this.time - this.lastFire > 10) {
                this.fireBullet(this.player);
                this.lastFire = this.time;
            }
        }

        if (this.fireKey2.isDown) {
            if (this.time - this.lastFire2 > 10) {
                this.fireBullet(this.player2);
                this.lastFire2 = this.time;
            }
        }

        this.tick();

        if (this.player.hp === 0 || this.player2.hp === 0) {
            this.scene.start('winner');
        }
    }

    setVelocity(obj, velocity) {
        // Set velocity based on angle
        obj.body.velocity.x = Math.cos(obj.angle * Math.PI/ 180) * velocity;
        obj.body.velocity.y = Math.sin(obj.angle * Math.PI/ 180) * velocity;
    }

    movePlayer(controls, player){
        if (controls.left.isDown) {
            player.angle-=2;
        } else if (controls.right.isDown) {
            player.angle+=2;
        }

        if (controls.up.isDown) {
            this.setVelocity(player,200);
        } else if (controls.down.isDown) {
            this.setVelocity(player,-200);
        } else {
            this.setVelocity(player,0);
        }
    }

    createWorld(){
        let map = this.add.tilemap('map');
        let tileset = map.addTilesetImage('maptiles', 'tileset');
        this.walls = map.createStaticLayer('Tile Layer 1', tileset);
        this.walls.setCollision(1);
    }

    fireBullet(player){
        let fire = this.physics.add.sprite(player.x, player.y, 'bullet');
        fire.setScale(0.01);
        fire.angle = player.angle;
        this.setVelocity(fire, 200);
        fire.body.collideWorldBounds = true;
        fire.setBounce(1,1);
        fire.numBounce = 0;
        this.physics.add.collider(fire, this.walls, this.onBounce);
        this.physics.add.collider(fire, this.player, this.onHit);
        this.physics.add.collider(fire, this.player2, this.onHit);
    }

    tick() {
        this.time++;
        this.timeText.setText(this.time / 100);
    }

    onHit(obj1, obj2) {
        obj2.hp--;
        obj1.destroy();
    }

    onBounce(obj1, obj2) {
        if (obj1.numBounce > 3) {
            obj1.destroy();
        } else {
            obj1.numBounce++;
        }
    }

}





