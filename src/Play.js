class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        this.shotsTaken = 0;
        this.successfulShots = 0;

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, "cup")
        this.cup.body.setCircle(this.cup.width/4)
        this.cup.body.setOffset(this.cup.width/4)

        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width/2, height - height / 10, "ball")
        this.ball.body.setCircle(this.ball.width/2)
            // keep the ball inside the frame
        this.ball.body.setCollideWorldBounds(true)
            // make the ball bouncy
        this.ball.body.setBounce(0.5)
            // makes it more accurate, and drag it a bit
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        // let wallA = this.physics.add.sprite(0, height/4, "wall")
        // wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2))
        // wallA.body.setImmovable(true)
        let wallA = this.physics.add.sprite(0, height/4, "wall").setCollideWorldBounds(true).setBounce(1, 0);
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2));
        wallA.body.setImmovable(true);
        wallA.body.setVelocityX(100);

        let wallB = this.physics.add.sprite(0, height/2, "wall")
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width/2, height/4*3, "oneway")
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false


        // add pointer input
        this.input.on("pointerdown", (pointer) => {
            // let shotDirection = pointer.y <= this.ball.y ? 1 : -1
            // this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            // this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)    
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1;
            let shotDirectionX = pointer.x >= this.ball.x ? 1 : -1;
            this.ball.body.setVelocityX(this.SHOT_VELOCITY_X * -shotDirectionX); // Changed line
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY);    
        
            this.shotsTaken++;
        
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            // ball.destroy()
            this.ballReset()
            this.successfulShots++;
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

        this.shotText = this.add.text(16, 16, '', { fontSize: '20px', fill: '#FFF' });
        this.updateStats();
    }

    update() {
        this.updateStats();
    }

    ballReset() {
        this.ball.setPosition(width / 2, height - height / 10);
        // this.ball.body.setVelocity(0, 0);
        this.ball.body.setVelocityX(0)
        this.ball.body.setVelocityY(0)
    }

    updateStats() {
        let successPercentage = (this.successfulShots / this.shotsTaken * 100) || 0;
        this.shotText.setText(`Shots: ${this.shotsTaken} - Successful: ${this.successfulShots} - Success Rate: ${successPercentage.toFixed(1)}%`);
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[1] Add ball reset logic on successful shot
[2] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[3] Make one obstacle move left/right and bounce against screen edges
[4] Create and display shot counter, score, and successful shot percentage
*/