import * as THREE from '../libs/three.module.js'

class Caja extends THREE.Object3D {
    constructor(){
        super();
        this.caja = this.createCaja();
        
        this.bbox = new THREE.Box3();
        this.caja.geometry.computeBoundingBox();
        this.add(this.caja);
    }

    getBBox(){
        return this.bbox;
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
        caja.castShadow = true;
        return caja;
    }

    update(){ //dt=delta time
        this.bbox.copy(this.caja.geometry.boundingBox).applyMatrix4(this.caja.matrixWorld);
    }
}

export {Caja}