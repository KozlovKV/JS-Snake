import * as THREE from 'three';


export default class ThirdDimField {
    constructor(canvas, engine) {
        this.parent = canvas;
        this.engine = engine;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, 1, 0.1, 10000);
        this.renderer = new THREE.WebGL1Renderer({'canvas': this.canvas});
    }

    initField() {

    }

    logic() {
        
    }

    draw() {

    }
}