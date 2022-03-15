export default class TouchController {
    constructor(snake, controllerElement) {
        this.snake = snake;
        this.field = this.snake.engine.canvas;
        this.controller = controllerElement;
        this.startPoint = this.endPoint = 0;
    }

    startTouchCallBack(e) {
        e.preventDefault();
        let touch = e.changedTouches[0];
        this.controller.classList.remove('hide');
        this.controller.style.left = touch.clientX + 'px';
        this.controller.style.top = touch.clientY + 'px';
        this.startPoint = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    }

    countVectorParams() {
        this.vec = {
            x: this.endPoint[0] - this.startPoint[0],
            y: -(this.endPoint[1] - this.startPoint[1]),
        };
        this.vec.len = Math.sqrt(this.vec.x ** 2 + this.vec.y ** 2);
        this.vec.sin = this.vec.y / this.vec.len;
        this.vec.cos = this.vec.x / this.vec.len;
    }

    endTouchCallBack(e) {
        e.preventDefault();
        this.endPoint = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        this.countVectorParams();
        if (Math.abs(this.vec.sin) > Math.abs(this.vec.cos)) {
            if (this.vec.sin > 0) { this.snake.changeVelocity('up'); }
            else { this.snake.changeVelocity('down'); }
        } else {
            if (this.vec.cos > 0) { this.snake.changeVelocity('right'); }
            else { this.snake.changeVelocity('left'); }
        }
        this.controller.classList.add('hide');
    }

    setEvents() {
        this.field.addEventListener('touchstart', e => this.startTouchCallBack(e));
        this.field.addEventListener('touchend', e => this.endTouchCallBack(e));
        this.controller.addEventListener('touchend', e => this.endTouchCallBack(e));
    }
}