import TouchController from "./touchController";


export default class Snake {
    constructor(engine) {
        this.engine = engine;
        this.x = 160;
        this.y = 160;
        this.cells = [];
        this.maxCells = 4;
        this.dx = 0;
        this.dy = 0;
        this._changePatterns = {};
        this.setChangePatterns();
        this.touchController = new TouchController(this, document.getElementById('touch_controller'));
        this.setEvents();
        this.changeVelocity('right');
    }

    setChangePatterns() {
        this._changePatterns = {
            up: () => { if (this.dy === 0) 
                {this.dx = 0; this.dy = -this.engine.grid;} 
            },
            right: () => { if (this.dx === 0) 
                {this.dx = this.engine.grid; this.dy = 0;}
            },
            down: () => { if (this.dy === 0) 
                {this.dx = 0; this.dy = this.engine.grid;}
            },
            left: () => { if (this.dx === 0) 
                {this.dx = -this.engine.grid; this.dy = 0;}
            },
        };
    }

    move() {
        // Двигаем змейку с нужной скоростью
        this.x += this.dx;
        this.y += this.dy;

        // Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной строны
        if (this.x < 0) {
            this.x = this.engine.canvas.width - this.engine.grid;
        }
        else if (this.x >= this.engine.canvas.width) {
            this.x = 0;
        }

        // Делаем то же самое для движения по вертикали
        if (this.y < 0) {
            this.y = this.engine.canvas.height - this.engine.grid;
        }
        else if (this.y >= this.engine.canvas.height) {
            this.y = 0;
        }

        // Продолжаем двигаться в выбранном направлении. 
        // Голова всегда впереди, поэтому добавляем её координаты в начало массива, 
        // который отвечает за всю змейку
        this.cells.unshift({x: this.x, y: this.y});

        // Сразу после этого удаляем последний элемент из массива змейки, 
        // потому что она движется и постоянно освобождает клетки после себя
        if (this.cells.length > this.maxCells) {
            this.cells.pop();
        }

        this.cells.forEach((cell, index) => {
            // Чтобы создать эффект клеточек, делаем зелёные квадратики меньше на один пиксель, 
            // чтобы вокруг них образовалась чёрная граница
            this.engine.context.fillRect(cell.x, cell.y, this.engine.grid-1, this.engine.grid-1);  
            // Если змейка добралась до яблока...
            if (cell.x === this.engine.apple.x && cell.y === this.engine.apple.y) {
                // увеличиваем длину змейки
                this.maxCells++;
                this.engine.apple.updatePos();
            }
    
            // Проверяем, не столкнулась ли змея сама с собой
            // Для этого перебираем весь массив и смотрим, 
            // есть ли у нас в массиве змейки две клетки с одинаковыми координатами 
            for (var i = index + 1; i < this.cells.length; i++) {
                // Если такие клетки есть — начинаем игру заново
                if (cell.x === this.cells[i].x && cell.y === this.cells[i].y) {
                    this.engine.restart();
                }
            }
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