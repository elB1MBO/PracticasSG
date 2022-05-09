import * as THREE from '../libs/three.module.js'

class Escenario extends THREE.Object3D {
    constructor(){
        super();
        this.fondo = this.createBackground();
    }

    createBackground(){
        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var loader = new THREE.TextureLoader();
        var materials = [
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_01.jpg')}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_02.jpg')}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_03.jpg')}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_04.jpg')}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_05.jpg')}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_06.jpg')}),
          /* new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_07.jpg'), side: THREE.BackSide}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_08.jpg'), side: THREE.BackSide}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_09.jpg'), side: THREE.BackSide}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_10.jpg'), side: THREE.BackSide}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_11.jpg'), side: THREE.BackSide}),
          new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes/Sky1_12.jpg'), side: THREE.BackSide}),
         */];
        var fondo = new THREE.Mesh(geometry, materials);
        return fondo;
      }
}

export {Escenario};