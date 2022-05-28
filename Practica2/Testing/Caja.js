import * as THREE from '../libs/three.module.js'

class Caja extends THREE.Object3D {
    constructor(){
        super();
        this.caja = this.createCaja();
        /* this.collider = this.createCollider();
        this.caja.add(this.collider); */
        this.add(this.caja);
    }

    getCollider(){
        return this.collider;
    }

    createCaja(){
        var geom = new THREE.BoxGeometry(3,3,3);
        var loader = new THREE.TextureLoader();
        var materials = [
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/textures/textura-caja1_01.jpg')}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/textures/textura-caja1_02.jpg')}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/textures/textura-caja1_03.jpg')}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/textures/textura-caja1_04.jpg')}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/textures/textura-caja1_05.jpg')}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/textures/textura-caja1_06.jpg')}),
        ];

        var caja = new THREE.Mesh(geom, materials);
        return caja;
    }

    createCollider(){
        var geom = new THREE.BoxGeometry(3.5,3.5,3.5);
        var material = new THREE.MeshToonMaterial({color:0xDD0331});
        var collider = new THREE.Mesh(geom, material);
        return collider;
    }

    update(){ //dt=delta time
        
    }
}

export {Caja}