import Snake from "./snake";
import Apple from "./apple";
import RecordTableDB from "./RecordTableDB";


export default class GameEngine {
    constructor(fps=24) {
        this.fps = fps;
        this.timerId = 0;
        this.score = 0;
        this.canvas = document.getElementById('game');
        this.context = this.canvas.getContext('2d');
        this.grid = 16;

        

        this.snake = new Snake(this);
        this.apple = new Apple(this);
        this.recordsDB = new RecordTableDB('http://localhost:3000/records');
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
        let highscoreListElement = document.querySelector('#highscores ul');
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
        this.snake = new Snake(this);
        this.apple = new Apple(this);
    }
}