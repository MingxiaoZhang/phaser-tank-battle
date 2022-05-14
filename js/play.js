class Play {
    create ()
    {
        this.spawningPoints = [[220, 55], [330, 55], [220, 260]];
        let num = Phaser.Math.RND.between(0, 2);
        this.coin = this.physics.add.sprite(this.spawningPoints[num][0], this.spawningPoints[num][1], 'coin');

        // Add player 1
        this.player = this.physics.add.sprite(131, 297, 'player');
        this.player.setScale(0.1);
        this.player.angle = 90;
        this.player.hp = 5;
        this.player.fireFreq = 10;

        // Add player 2
        this.player2 = this.physics.add.sprite(547, 211, 'player2');
        this.player2.setScale(0.1);
        this.player2.angle = 180;
        this.player2.hp = 5;
        this.player2.fireFreq = 10;

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
        this.createHp();

        // Initialize time control
        this.timer = 0;
        this.lastFire = 0;
        this.lastFire2 = 0;

        // Create particles
        let particles = this.add.particles('pixel');
        this.player.emitter = particles.createEmitter({
            quantity: 10,
            speed: {min: -150, max: 150},
            scale: {start: 2, end: 0.1},
            lifespan: 400,
            on: false,
        });
        this.player2.emitter = particles.createEmitter({
            quantity: 10,
            speed: {min: -150, max: 150},
            scale: {start: 2, end: 0.1},
            lifespan: 400,
            on: false,
        });
    }

    update ()
    {
        this.movePlayer(this.arrow, this.player);
        this.movePlayer(this.wasd, this.player2);

        // Collision control
        this.physics.collide(this.player, this.walls);
        this.physics.collide(this.player2, this.walls);
        this.physics.collide(this.player2, this.player);

        // Fire control
        if (this.fireKey1.isDown) {
            if (this.time - this.lastFire > this.player.fireFreq) {
                this.fireBullet(this.player);
                this.lastFire = this.timer;
            }
        }
        if (this.fireKey2.isDown) {
            if (this.timer - this.lastFire2 > this.player2.fireFreq) {
                this.fireBullet(this.player2);
                this.lastFire2 = this.timer;
            }
        }

        // Take coin
        if (this.physics.overlap(this.player, this.coin)) {
            this.takeCoin(this.player);
        } else if (this.physics.overlap(this.player2, this.coin)) {
            this.takeCoin(this.player2);
        }

        // Powerplay reset
        if (this.timer - this.takeTime > 400 && this.powerPlayer !== 0) {
            let num = Phaser.Math.RND.between(0, this.spawningPoints.length - 1);
            this.coin = this.physics.add.sprite(this.spawningPoints[num][0], this.spawningPoints[num][1], 'coin');
            this.powerPlayer.fireFreq = 10;
            this.powerPlayer = 0;
        }

        // Timer
        this.tick();

        // Death scene
        if (this.player.hp === 0) {
            this.time.addEvent({
                delay: 1000,
                callback: () => this.scene.start('winner', {winner: 'Player 2'}),
            })
        } else if (this.player2.hp === 0) {
            this.time.addEvent({
                delay: 1000,
                callback: () => this.scene.start('winner', {winner: 'Player 1'}),
            })
        }
    }

    setVelocity(obj, velocity) {
        // Set velocity based on angle
        obj.body.velocity.x = Math.cos(obj.angle * Math.PI/ 180) * velocity;
        obj.body.velocity.y = Math.sin(obj.angle * Math.PI/ 180) * velocity;
    }

    movePlayer(controls, player){
        if (controls.left.isDown) {
            player.angle-=3;
        } else if (controls.right.isDown) {
            player.angle+=3;
        }

        if (controls.up.isDown) {
            this.setVelocity(player,150);
        } else if (controls.down.isDown) {
            this.setVelocity(player,-150);
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

    // Set hearts for each player
    createHp() {
        this.playerText = this.add.text(650, 70, 'Player 1');
        this.player.hearts = new Array(5);
        for (let i = 0; i < 5; i++) {
            this.player.hearts[i] = this.add.image(25 * i + 620, 100, 'heart');
            this.player.hearts[i].setScale(0.05);
        }
        this.playerText = this.add.text(650, 130, 'Player 2');
        this.player2.hearts = new Array(5);
        for (let i = 0; i < 5; i++) {
            this.player2.hearts[i] = this.add.image(25 * i + 620, 160, 'heart');
            this.player2.hearts[i].setScale(0.05);
        }
    }

    fireBullet(player){
        let adjCoords = this.getOffset(player);
        let fire = this.physics.add.sprite(adjCoords[0], adjCoords[1], 'bullet');
        fire.setScale(0.01);
        fire.angle = player.angle;
        this.setVelocity(fire, 300);
        fire.body.collideWorldBounds = true;
        fire.setBounce(1,1);
        fire.numBounce = 0;
        this.physics.add.collider(fire, this.walls, this.onBounce);
        this.physics.add.collider(fire, this.player, this.onHit);
        this.physics.add.collider(fire, this.player2, this.onHit);
    }

    takeCoin(player) {
        this.coin.destroy();
        this.takeTime = this.timer;
        this.powerPlayer = player;
        player.fireFreq = 3;
    }

    tick() {
        this.timer++;
    }

    onHit(obj1, obj2) {
        obj2.hp--;
        obj2.hearts[4 - obj2.hp].destroy();
        obj1.destroy();
        obj2.emitter.setPosition(obj2.x, obj2.y);
        obj2.emitter.explode();
    }

    onBounce(obj1, obj2) {
        if (obj1.numBounce > 5) {
            obj1.destroy();
        } else {
            obj1.numBounce++;
        }
    }

    getOffset(player) {
        let x = player.x + (player.displayWidth / 2) * Math.cos(player.angle * Math.PI/ 180);
        let y = player.y + (player.displayHeight / 2) * Math.sin(player.angle * Math.PI/ 180);
        return [x, y];
    }

}





