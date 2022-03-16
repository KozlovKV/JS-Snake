import TouchController from "./touchController";
import MultidemensionPoint from "./point";

export default class Snake {
    constructor(engine) {
        this.engine = engine;
        this.headPoint = new MultidemensionPoint(160, 160);
        this.cells = [];
        this.maxCells = 4;
        this.vector = new MultidemensionPoint(0, 0);
        this._changePatterns = {};
        this.setChangePatterns();
        this.touchController = new TouchController(this, document.getElementById('touch_controller'));
        this.setEvents();
        this.changeVelocity('right');
    }

    setChangePatterns() {
        this._changePatterns = {
            up: () => { if (this.vector.y === 0) 
                {this.vector.set(0, -this.engine.grid);} 
            },
            right: () => { if (this.vector.x === 0) 
                {this.vector.set(this.engine.grid, 0);}
            },
            down: () => { if (this.vector.y === 0) 
                {this.vector.set(0, this.engine.grid);} 
            },
            left: () => { if (this.vector.x === 0) 
                {this.vector.set(-this.engine.grid, 0);}
            },
        };
    }

    grow() { this.maxCells++; }

    move() {
        // Двигаем змейку с нужной скоростью
        this.headPoint.change(...this.vector.coordinats);

        // Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной строны
        if (this.headPoint.x < 0) {
            this.headPoint.x = this.engine.canvas.width - this.engine.grid;
        }
        else if (this.headPoint.x >= this.engine.canvas.width) {
            this.headPoint.x = 0;
        }

        // Делаем то же самое для движения по вертикали
        if (this.headPoint.y < 0) {
            this.headPoint.y = this.engine.canvas.height - this.engine.grid;
        }
        else if (this.headPoint.y >= this.engine.canvas.height) {
            this.headPoint.y = 0;
        }
    }

    processCells() {
        // Продолжаем двигаться в выбранном направлении. 
        // Голова всегда впереди, поэтому добавляем её координаты в начало массива, 
        // который отвечает за всю змейку
        this.cells.unshift(this.headPoint.copy());

        // Сразу после этого удаляем последний элемент из массива змейки, 
        // потому что она движется и постоянно освобождает клетки после себя
        if (this.cells.length > this.maxCells) {
            this.cells.pop();
        }
    }

    checkGameOver() {
        this.cells.forEach((cell, index) => {
            // Проверяем, не столкнулась ли змея сама с собой
            // Для этого перебираем весь массив и смотрим, 
            // есть ли у нас в массиве змейки две клетки с одинаковыми координатами 
            for (var i = index + 1; i < this.cells.length; i++) {
                // Если такие клетки есть — начинаем игру заново
                if (cell.compare(this.cells[i])) {
                    this.engine.restart();
                }
            }
        });
    }

    logic() {
        this.move();
        this.processCells();
        this.checkGameOver();
    }

    draw() {
        this.engine.context.fillStyle = 'green';
        this.cells.forEach(cell => {
            this.engine.context.fillRect(cell.x, cell.y, this.engine.grid-1, this.engine.grid-1);
        });
    }

    setEvents() {
        document.addEventListener('keydown', (e) => {
            this.processKeyDownEvent(e);
        });
        this.touchController.setEvents();
    }

    changeVelocity(direction) {
        this._changePatterns[direction]();
    }

    processKeyDownEvent(event) {
        let keysToDirectionDict = {
            ArrowUp: 'up',
            ArrowRight: 'right',
            ArrowDown: 'down',
            ArrowLeft: 'left',
        };
        if (Object.entries(keysToDirectionDict).some(pair => pair[0] == event.key)) {
            this.changeVelocity(keysToDirectionDict[event.key]);
        }
    }
}