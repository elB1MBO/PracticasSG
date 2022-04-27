import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'

class Tronco extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();

        this.velocidad = 2;  //Velocidad animacion del tronco

        this.radioTronco = 1;
        this.largoTronco = 14;

        //this.createGUI(gui, titleGUI);

        this.tronco = this.createTronco();
        this.pinchos = this.createPinchos();
        
        /* this.add(this.tronco);
        this.add(this.pinchos); */

        var csg = new CSG();

        csg.union([this.tronco, this.pinchos]);

        this.trampa = csg.toMesh();
        //Si hago la union de tronco y pinchos como unico objeto,
        //la textura del pincho cambia a la del tronco.
        this.add(this.trampa);
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
        //var materialPincho = new THREE.MeshStandardMaterial({color: 0x505452});
        var materialPincho = new THREE.MeshPhongMaterial({map: textura});
        var geomPincho = new THREE.TetrahedronGeometry(0.6, 0);
        geomPincho.rotateZ(Math.PI/4);
        geomPincho.rotateX(-Math.PI/5);
        geomPincho.rotateY(Math.PI/2);
        geomPincho.translate(0, this.radioTronco, 0);
        var pincho = new THREE.Mesh(geomPincho, materialPincho);
        var pincho2 = new THREE.Mesh(geomPincho, materialPincho);
        var pincho3 = new THREE.Mesh(geomPincho, materialPincho);
        var pincho4 = new THREE.Mesh(geomPincho, materialPincho);
        var pincho5 = new THREE.Mesh(geomPincho, materialPincho);
        
        pincho2.position.z = 4;
        pincho3.rotation.z = Math.PI/2;
        pincho3.position.z = 4;
        pincho4.rotation.z = Math.PI;
        pincho4.position.z = 4;
        pincho5.rotation.z = -Math.PI/2;
        pincho5.position.z = 4;

        var pinchoOriginal = new THREE.Mesh(geomPincho, materialPincho);
        var csg = new CSG();
       /*  for (let i = 0; i < 5; i++) {
            for(let j = 1; j <= 4; j++){
                var pincho = new THREE.Mesh(geomPincho, materialPincho);
                switch (j) {
                    case 1:
                        pincho.position.z = this.largoTronco/4;
                        break;
                    case 2:
                        pincho.rotation.z = -Math.PI/2;
                        pincho.position.z = this.largoTronco/4;
                        break;
                    default:
                        break;
                }
            }
            //csg.union([pinchoOriginal, pincho]);
        } */

        csg.union([pincho, pincho2, pincho3, pincho4, pincho5]);

        var pinchos = csg.toMesh();

        return pinchos;
    }

    createGUI(gui, titleGUI){
        var folder = gui.addFolder(titleGUI);
    }

    update(dt){
        this.trampa.rotation.z -= this.velocidad*dt;
    }
}

export {Tronco}