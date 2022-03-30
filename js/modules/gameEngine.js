import Snake from "./snake";
import Apple from "./apple";
import RecordTableDB from "./RecordTableDB";
import ThirdDimField from './thirdDimField';


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
        this._3DField = new ThirdDimField(document.getElementById('3d_game_window'), this);
        this.recordsDB = new RecordTableDB('http://localhost:3000/records');
        this.reloadDB();
        this.highscores = [];
    }

    async reloadDB() {
        await this.recordsDB.loadRecordsObject();
        this.highscores = this.recordsDB.getRecords();
        this.updateHighscoresTable();
    }

    logic() {
        this.snake.logic();
        this.apple.logic();
        this.score = this.snake.cells.length;
    }

    draw() {
        // Очищаем игровое поле
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this._3DField.draw();
        // this.snake.draw();
        // this.apple.draw();

        document.getElementById('score').innerText = this.score;
        document.getElementById('fps').innerText = this.fps;
    }

    loop() {
        this.logic();
        this.draw();
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