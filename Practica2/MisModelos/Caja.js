import * as THREE from '../libs/three.module.js'

class Caja extends THREE.Object3D {
    constructor(){
        super();
        this.caja = this.createCaja();
        this.add(this.caja);
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

        /* var ruta = "../imgs/textures/penguins-skybox-pack/penguins/arid_";
        var formato = ".jpg";
        var urls = [
            ruta + "bk" + formato, 
            ruta + "dn" + formato, 
            ruta + "ft" + formato, 
            ruta + "lf" + formato, 
            ruta + "rt" + formato, 
            ruta + "up" + formato
        ];
        var textura = new THREE.CubeTextureLoader().load(urls); */
        var caja = new THREE.Mesh(geom, materials);
        return caja;
    }


    createGUI(gui, titleGUI){
        var folder = gui.addFolder(titleGUI);
    }

    update(){ //dt=delta time
        
    }
}

export {Caja}