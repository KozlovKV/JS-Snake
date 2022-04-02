import MultidemensionPoint from "./point";

export default class Apple {
    constructor(engine) { 
        this.engine = engine;
        this.point = new MultidemensionPoint();
        this.updatePos();
    }

    updatePos() {
        let x = getRandomInt(0, 10) * this.engine.field.grid,
            y = getRandomInt(0, 10) * this.engine.field.grid,
            z = getRandomInt(0, 10) * this.engine.field.grid;
        this.point.set(x, y, z);
    }

    logic() {
        if (this.point.compare(this.engine.snake.headPoint)) {
            this.engine.snake.grow();
            this.updatePos();
        }
    }

    draw() {
        this.engine.field.changeGameObjectPosition('apple', this.point);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}