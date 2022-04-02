import * as THREE from 'three';


const basicMaterial = new THREE.LineBasicMaterial({
    color: '#ffffff', opacity: 0.15, transparent: true,
});
const borderMeshMaterial = new THREE.MeshPhongMaterial({
    color: '#00ff00', opacity: 0.25, transparent: true,
});

export default class ThirdDimField {
    constructor(parent, engine) {
        this.width = 1000;
        this.grid = 100;
        this.parent = parent;
        this.engine = engine;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, 1, 0.1, 10000);
        this.camera.position.set(this.width*1.1, this.width*1.2, this.width*1.3);
        this.camera.lookAt(this.width/2, this.width/2, this.width/2);
        this.renderer = new THREE.WebGL1Renderer();
        this.renderer.setSize(500, 500);
        this.parent.append(this.renderer.domElement);
        this.initField();
    }

    initField() {
        this.setLines();
        this.setBorders();
        this.setLights();
        let appleMesh = new THREE.Mesh(
            new THREE.BoxGeometry(this.grid, this.grid, this.grid), 
            new THREE.MeshPhongMaterial({'color': '#ff0000'})
        );
        this.gameObjects = {
            'apple': [appleMesh],
            'snake': [],
        };
        for (let key in this.gameObjects) {
            this.gameObjects[key].forEach(mesh => this.scene.add(mesh));
        }
    }
    
    setLines() {
        this.lines = [];
        for (let x = this.grid; x < this.width; x += this.grid) {
            for (let y = this.grid; y < this.width; y += this.grid) {
                let vectors = [new THREE.Vector3(x, y, 0), new THREE.Vector3(x, y, this.width)];
                let geometry = new THREE.BufferGeometry().setFromPoints(vectors);
                let line = new THREE.Line(geometry, basicMaterial);
                this.scene.add(line);
                this.lines.push(line);
            }
        }
        for (let x = this.grid; x < this.width; x += this.grid) {
            for (let z = this.grid; z < this.width; z += this.grid) {
                let vectors = [new THREE.Vector3(x, 0, z), new THREE.Vector3(x, this.width, z)];
                let geometry = new THREE.BufferGeometry().setFromPoints(vectors);
                let line = new THREE.Line(geometry, basicMaterial);
                this.scene.add(line);
                this.lines.push(line);
            }
        }
        for (let y = this.grid; y < this.width; y += this.grid) {
            for (let z = this.grid; z < this.width; z += this.grid) {
                let vectors = [new THREE.Vector3(0, y, z), new THREE.Vector3(this.width, y, z)];
                let geometry = new THREE.BufferGeometry().setFromPoints(vectors);
                let line = new THREE.Line(geometry, basicMaterial);
                this.scene.add(line);
                this.lines.push(line);
            }
        }
    }

    setBorders() {
        let mesh = new THREE.Mesh(new THREE.BoxGeometry(this.width, this.width, 1), borderMeshMaterial);
        mesh.position.set(this.width/2, this.width/2, 0);
        this.scene.add(mesh);
        mesh = new THREE.Mesh(new THREE.BoxGeometry(this.width, this.width, 1), borderMeshMaterial);
        mesh.position.set(this.width/2, this.width/2, this.width);
        this.scene.add(mesh);
        mesh = new THREE.Mesh(new THREE.BoxGeometry(this.width, 1, this.width), borderMeshMaterial);
        mesh.position.set(this.width/2, 0, this.width/2);
        this.scene.add(mesh);
        mesh = new THREE.Mesh(new THREE.BoxGeometry(this.width, 1, this.width), borderMeshMaterial);
        mesh.position.set(this.width/2, this.width, this.width/2);
        this.scene.add(mesh);
        mesh = new THREE.Mesh(new THREE.BoxGeometry(1, this.width, this.width), borderMeshMaterial);
        mesh.position.set(0, this.width/2, this.width/2);
        this.scene.add(mesh);
        mesh = new THREE.Mesh(new THREE.BoxGeometry(1, this.width, this.width), borderMeshMaterial);
        mesh.position.set(this.width, this.width/2, this.width/2);
        this.scene.add(mesh);
    }

    setLights() {
        this.lights = [];
        let spotLight1 = new THREE.SpotLight('#ffffff');
        spotLight1.position.set(this.width/2, this.width/2, 0.1*this.width);
        this.scene.add(spotLight1);
        this.lights.push(spotLight1);
        let spotLight2 = new THREE.SpotLight('#ffffff');
        spotLight2.position.set(this.width/2, this.width/2, 0.9*this.width);
        this.scene.add(spotLight2);
        this.lights.push(spotLight2);
        let spotLight3 = new THREE.SpotLight('#ffffff');
        spotLight3.position.set(this.width/2, 0.1*this.width, this.width/2);
        this.scene.add(spotLight3);
        this.lights.push(spotLight3);
        let spotLight4 = new THREE.SpotLight('#ffffff');
        spotLight4.position.set(this.width/2, 0.9*this.width, this.width/2);
        this.scene.add(spotLight4);
        this.lights.push(spotLight4);
        let spotLight5 = new THREE.SpotLight('#ffffff');
        spotLight5.position.set(0.1*this.width, this.width/2, this.width/2);
        this.scene.add(spotLight5);
        this.lights.push(spotLight5);
        let spotLight6 = new THREE.SpotLight('#ffffff');
        spotLight6.position.set(0.9*this.width, this.width/2, this.width/2);
        this.scene.add(spotLight6);
        this.lights.push(spotLight6);
    }

    addGameObject(objectName, ...data) {
        data.forEach(value => this.gameObjects[objectName].push(value));
    }

    changeGameObjectPosition(objectName, ...points) {
        points.forEach((point, i) => this.gameObjects[objectName][i].position.set(point.x, point.y, point.z));
    }

    removeGameObject(objectName, start=0, count=1) {
        this.gameObjects[objectName].splice(start, count);
    }

    logic() {

    }

    draw() {
        this.renderer.render(this.scene, this.camera);
    }
}