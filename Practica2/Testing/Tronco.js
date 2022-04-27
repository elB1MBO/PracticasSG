import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'

class Tronco extends THREE.Object3D {
    constructor(){
        super();

        this.velocidad = 2;  //Velocidad animacion del tronco

        this.radioTronco = 1;
        this.largoTronco = 14;

        //Relativo a los pinchos
        this.numFilas = 3;
        this.pinchosPorFila = 4;

        this.tronco = this.createTronco();

        this.pinchos = this.createPinchos();

        this.tronco.add(this.pinchos);

        this.add(this.tronco);
    }

    createTronco(){
        var textura = new THREE.TextureLoader().load('../imgs/wood.jpg');
        var materialCilindro = new THREE.MeshPhongMaterial({map:textura});

        var geomCil = new THREE.CylinderGeometry(this.radioTronco, this.radioTronco, this.largoTronco, 30, 30);

        geomCil.rotateX(Math.PI/2);
       
        var tronco = new THREE.Mesh(geomCil, materialCilindro);

        return tronco;
    }

    createPinchos(){
        var textura = new THREE.TextureLoader().load('../imgs/textura-metal2.jpg');
        var materialPincho = new THREE.MeshPhongMaterial({map: textura});
        var geomPincho = new THREE.TetrahedronGeometry(0.6, 0);
        //Hay que orientar un poco el tetraedro
        geomPincho.rotateZ(Math.PI/4);
        geomPincho.rotateX(-Math.PI/5);
        geomPincho.rotateY(Math.PI/2);
        geomPincho.scale(1.2, 1.2, 1.2);
        geomPincho.translate(0, this.radioTronco, 0);

        var pinchoOriginal = new THREE.Mesh(geomPincho, materialPincho);
        var csg = new CSG();
        for (let i = 0; i < this.numFilas; i++) { //i filas de pinchos
            for(let j = 1; j <= this.pinchosPorFila; j++){    //De j pinchos cada una
                var pinchoj = new THREE.Mesh(geomPincho, materialPincho);
                pinchoj.position.z = this.largoTronco/this.numFilas*i;
                pinchoj.rotation.z = Math.PI/2*j;
                //Una vez colocado el nuevo pincho, lo uno al csg de pinchos
                csg.union([pinchoOriginal, pinchoj]);
            }
        }
        
        var pinchos = csg.toMesh();
        pinchos.position.z = -this.largoTronco/this.numFilas;
        return pinchos;
    }

    createGUI(gui, titleGUI){
        var folder = gui.addFolder(titleGUI);
    }

    update(dt){
        this.tronco.rotation.z -= this.velocidad*dt;
    }
}

export {Tronco}