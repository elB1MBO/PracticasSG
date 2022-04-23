import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import {CilindroBarrido} from './CilindroBarrido.js'

class Tuerca extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();
        //Creamos y referenciamos un reloj para la animacion
        this.reloj = new THREE.Clock();

        //Atributo velocidad:
        this.velocidad = 0.5;

        this.rt = 4;

        this.createGUI(gui, titleGUI);

        var cuerpo = this.createTuerca();
        var hueco = new CilindroBarrido();

        var csg = new CSG();
        csg.subtract([cuerpo, hueco]);
        this.tuerca = csg.toMesh();

        this.add(this.tuerca);
    }

    createTuerca(){
        var textura = new THREE.TextureLoader().load('../imgs/textura-dorada-metalica.jpg');
        var material = new THREE.MeshPhongMaterial({map: textura});

        var geomTuerca = new THREE.CylinderGeometry(this.rt, this.rt, this.rt, 6);

        var cuerpoTuerca = new THREE.Mesh(geomTuerca, material);

        return cuerpoTuerca;
    }

    createGUI(gui, titleGUI){
        var folder = gui.addFolder(titleGUI);
    }

    update(){
        var segs = this.reloj.getDelta();
        this.tuerca.rotation.x += this.velocidad*segs;
        this.tuerca.rotation.y += this.velocidad*segs;
        this.tuerca.rotation.z += this.velocidad*segs;
    }
}

export {Tuerca}