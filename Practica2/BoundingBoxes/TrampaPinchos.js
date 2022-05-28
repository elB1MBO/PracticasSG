import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class TrampaPinchos extends THREE.Object3D {
    constructor(ladoBase) {
        super();

        this.reloj = new THREE.Clock();
        this.velocidad = 0.75;

        this.alturaBase = 0.3;
        //this.ladoBase = 5;
        this.ladoBase = ladoBase;

        this.trampa = this.createBase();
        this.pinchosP = this.createPinchos();

        //BOUNDING BOX
        this.bbox = new THREE.Box3();
        //this.bbox.copy(this.pinchosP.geometry.boundingBox).applyMatrix4(this.pinchosP.matrixWorld);
        /* this.boxHelper = new THREE.Box3Helper(this.bbox, 0xffff00);
        console.log(this.boxHelper);
        this.trampa.add(this.boxHelper); */

        this.trampa.add(this.pinchosP);
        console.log(this.trampa);
        this.upDown();
        this.add(this.trampa);
    }

    getBBox(){
        return this.bbox;
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
        var geomCono = new THREE.TetrahedronGeometry(0.5, 0);

        geomCono.rotateZ(Math.PI/4);
        geomCono.rotateX(-Math.PI/5);
        geomCono.rotateY(Math.PI/2);
        geomCono.scale(1, 1.5, 1);
        geomCono.translate(0, this.alturaBase, 0);

        var pinchoOriginal = new THREE.Mesh(geomCono, material);
        var csg = new CSG();
        for(let i = 1; i < this.ladoBase; i++){       //Fila
            for(let j = 1; j < this.ladoBase; j++){   //Columna
                var pinchoj = new THREE.Mesh(geomCono, material);
                pinchoj.position.z = i;
                pinchoj.position.x = j;
                csg.union([pinchoOriginal, pinchoj]);
            }
        }
        csg.subtract([pinchoOriginal]);
        var trampa = csg.toMesh();
        trampa.position.x = -this.ladoBase/2;
        trampa.position.z = -this.ladoBase/2;
        //Calculamos la bounding box de los pinchos
        trampa.geometry.computeBoundingBox();

        return trampa;
    }

    //Animacion de subir y bajar
    upDown(){
        var origen = {x: -this.ladoBase/2, y: -0.05};
        var destino = {x: -this.ladoBase/2, y: -1.5};
        var movimiento = new TWEEN.Tween(origen)
            .to(destino, 1000)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(() => {
                this.pinchosP.position.x = origen.x;
                this.pinchosP.position.y = origen.y;
                //this.bbox.copy(this.pinchosP.geometry.boundingBox).applyMatrix4(this.pinchosP.matrixWorld);
            })
            .onComplete(() => {
                //origen.y = -10;
            })
            .repeat(Infinity)
            .yoyo(true);
        
        movimiento.start();
        //TWEEN.update();
        //TWEEN.add(movimiento);
    }

    update(dt){
        this.bbox.copy(this.pinchosP.geometry.boundingBox).applyMatrix4(this.pinchosP.matrixWorld);
        TWEEN.update();
    }

}

export { TrampaPinchos }