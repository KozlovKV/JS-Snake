import MultidemensionPoint from "./point";

export default class Apple {
    constructor(engine) { 
        this.engine = engine;
        this.point = new MultidemensionPoint();
        this.updatePos();
    }

    updatePos() {
        let x = getRandomInt(0, 25) * this.engine.grid,
            y = getRandomInt(0, 25) * this.engine.grid;
        this.point.set(x, y);
    }

    logic() {
        if (this.point.compare(this.engine.snake.headPoint)) {
            this.engine.snake.grow();
            this.updatePos();
        }
    }

    draw() {
        this.engine.context.fillStyle = 'red';
        this.engine.context.fillRect(this.point.x, this.point.y, this.engine.grid-1, this.engine.grid-1);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}