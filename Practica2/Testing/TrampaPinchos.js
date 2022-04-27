import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'

class TrampaPinchos extends THREE.Object3D {
    constructor() {
        super();

        this.alturaBase = 0.3;
        this.ladoBase = 4;

        this.radioTronco = 1;
        this.largoTronco = 14;

        //Relativo a los pinchos
        this.numFilas = 3;
        this.pinchosPorFila = 4;

        this.trampa = this.createBase();
        this.pinchos = this.createPinchos();
        
        this.trampa.add(this.pinchos);
        this.add(this.trampa);
    }

    createBase(){
        var textura = new THREE.TextureLoader().load('../imgs/textura-hierro-muescas.jpg');
        var material = new THREE.MeshPhongMaterial({map:textura});

        var geom = new THREE.BoxGeometry(this.ladoBase, this.alturaBase, this.ladoBase);
        var base = new THREE.Mesh(geom, material);

        base.position.y = this.alturaBase/2;
        return base;
    }
    createPinchos(){
        var textura = new THREE.TextureLoader().load('../imgs/textura-metal1.jpg');
        var material = new THREE.MeshPhongMaterial({map: textura});
        var geom = new THREE.ConeGeometry(0.2, 1);

        geom.translate(0, this.alturaBase*2, 0);

        var pinchoOriginal = new THREE.Mesh(geom, material);
        var csg = new CSG();
        for(let i = 0; i < this.ladoBase; i++){       //Fila
            for(let j = 0; j < this.ladoBase; j++){   //Columna
                var pinchoj = new THREE.Mesh(geom, material);
                pinchoj.position.z = i;
                pinchoj.position.x = j;
                csg.union([pinchoOriginal, pinchoj]);
            }
        }
        var trampa = csg.toMesh();
        trampa.position.x = -this.ladoBase/2;
        trampa.position.z = -this.ladoBase/2;
        return trampa;
    }

    /* createPinchos(){
        var textura = new THREE.TextureLoader().load('../imgs/textura-metal2.jpg');
        var materialPincho = new THREE.MeshPhongMaterial({map: textura});
        var geomPincho = new THREE.TetrahedronGeometry(0.6, 0);
        //Hay que orientar un poco el tetraedro
        geomPincho.rotateZ(Math.PI/4);
        geomPincho.rotateX(-Math.PI/5);
        geomPincho.rotateY(Math.PI/2);
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
    } */

    createGUI(){}

    update(){}

}

export { TrampaPinchos }