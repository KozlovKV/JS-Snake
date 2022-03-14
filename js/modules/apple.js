export default class Apple {
    constructor(engine) { 
        this.engine = engine;
        this.updatePos();
    }

    updatePos() {
        this.x = getRandomInt(0, 25) * this.engine.grid;
        this.y = getRandomInt(0, 25) * this.engine.grid;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}