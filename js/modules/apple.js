export default class Apple {
    constructor(engine) { 
        this.engine = engine;
        this.updatePos();
    }

    updatePos() {
        this.x = getRandomInt(0, 25) * this.engine.grid;
        this.y = getRandomInt(0, 25) * this.engine.grid;
    }

    logic() {
        if (this.engine.snake.x === this.x && this.engine.snake.y === this.y) {
            this.engine.snake.grow();
            this.updatePos();
        }
    }

    draw() {
        this.engine.context.fillStyle = 'red';
        this.engine.context.fillRect(this.x, this.y, this.engine.grid-1, this.engine.grid-1);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}