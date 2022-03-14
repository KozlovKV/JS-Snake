import GameEngine from "./modules/GameEngine";

window.addEventListener('load', e => {
    'use strict';
    
    let gameEngine = new GameEngine();
    gameEngine.loop();
});