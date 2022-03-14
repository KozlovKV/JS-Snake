/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/GameEngine.js":
/*!**********************************!*\
  !*** ./js/modules/GameEngine.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameEngine)
/* harmony export */ });
/* harmony import */ var _snake__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./snake */ "./js/modules/snake.js");
/* harmony import */ var _apple__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./apple */ "./js/modules/apple.js");
/* harmony import */ var _RecordTableDB__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RecordTableDB */ "./js/modules/RecordTableDB.js");





class GameEngine {
    constructor(fps=24) {
        this.fps = fps;
        this.timerId = 0;
        this.score = 0;
        this.canvas = document.getElementById('game');
        this.context = this.canvas.getContext('2d');
        this.grid = 16;

        

        this.snake = new _snake__WEBPACK_IMPORTED_MODULE_0__["default"](this);
        this.apple = new _apple__WEBPACK_IMPORTED_MODULE_1__["default"](this);
        this.recordsDB = new _RecordTableDB__WEBPACK_IMPORTED_MODULE_2__["default"]('http://localhost:3000/records');
        this.reloadDB();
        this.highscores = [];
    }

    async reloadDB() {
        await this.recordsDB.loadRecordsObject();
        this.highscores = this.recordsDB.getRecords();
        this.updateHighscoresTable();
    }

    loop() {
        // Очищаем игровое поле
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Рисуем еду — красное яблоко
        this.context.fillStyle = 'red';
        this.context.fillRect(this.apple.x, this.apple.y, this.grid-1, this.grid-1);

        // Одно движение змейки — один новый нарисованный квадратик 
        this.context.fillStyle = 'green';

        // Обрабатываем каждый элемент змейки
        this.snake.move();

        this.score = this.snake.cells.length;
        document.getElementById('score').innerText = this.score;
        document.getElementById('fps').innerText = this.fps;
        
        this.timerId = setTimeout(() => this.loop(), 1000/this.fps);
    }

    updateHighscoresTable() {
        let highscoreListElement = document.querySelector('#highscores ol');
        highscoreListElement.innerHTML = '';
        this.highscores.forEach(recordObject => {
            let recordElement = document.createElement('li');
            recordElement.textContent = `${recordObject.username}: ${recordObject.score}`;
            highscoreListElement.append(recordElement);
        });
    }

    restart() {
        let username = document.querySelector('#username').value;
        username = username.length ? username : 'NONAME';
        let recordObject = {
            username: username,
            score: this.score,
        };
        this.recordsDB.addRecord(recordObject);
        this.reloadDB();
        this.score = 0;
        this.snake = new _snake__WEBPACK_IMPORTED_MODULE_0__["default"](this);
        this.apple = new _apple__WEBPACK_IMPORTED_MODULE_1__["default"](this);
    }
}

/***/ }),

/***/ "./js/modules/RecordTableDB.js":
/*!*************************************!*\
  !*** ./js/modules/RecordTableDB.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RecordTableDB)
/* harmony export */ });
class RecordTableDB {
    constructor(url) {
        this.url = url + '?_sort=score&_order=desc';
        this.recordsArray = [];
        this.loadRecordsObject();
    }

    async loadRecordsObject(debug=false) {
        this.recordsArray = await fetch(this.url)
        .then(response => response.json());
        if (debug) { console.log(this.recordsArray); }
    }
    
    getNewId() {
        return this.recordsArray.sort((a, b) => b.id - a.id)[0].id + 1;
    }

    async addRecord(newRecordObject, debug=false) {
        newRecordObject.id = this.getNewId();
        this.recordsArray = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecordObject)
        })
        .then(response => response.json());
        if (debug) { console.log(this.recordsArray); }
    }

    getRecords(count=10) {
        this.loadRecordsObject();
        return this.recordsArray.slice(0, count);
    }
}

/***/ }),

/***/ "./js/modules/apple.js":
/*!*****************************!*\
  !*** ./js/modules/apple.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Apple)
/* harmony export */ });
class Apple {
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

/***/ }),

/***/ "./js/modules/snake.js":
/*!*****************************!*\
  !*** ./js/modules/snake.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Snake)
/* harmony export */ });
/* harmony import */ var _touchController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./touchController */ "./js/modules/touchController.js");



class Snake {
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
        this.touchController = new _touchController__WEBPACK_IMPORTED_MODULE_0__["default"](this, document.getElementById('touch_controller'));
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

/***/ }),

/***/ "./js/modules/touchController.js":
/*!***************************************!*\
  !*** ./js/modules/touchController.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TouchController)
/* harmony export */ });
class TouchController {
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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_GameEngine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/GameEngine */ "./js/modules/GameEngine.js");


window.addEventListener('load', e => {
    'use strict';
    
    let gameEngine = new _modules_GameEngine__WEBPACK_IMPORTED_MODULE_0__["default"]();
    gameEngine.loop();
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map