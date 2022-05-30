import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import {CilindroBarrido} from './CilindroBarrido.js'
import * as TWEEN from '../libs/tween.esm.js'

class Tuerca extends THREE.Object3D {
    constructor(){
        super();
        //Creamos y referenciamos un reloj para la animacion
        this.reloj = new THREE.Clock();

        //Atributo velocidad:
        this.velocidad = 0.75;

        this.rt = 4;

        this.bbox = new THREE.Box3();

        var cuerpo = this.createTuerca();
        var hueco = new CilindroBarrido();

        var csg = new CSG();
        csg.subtract([cuerpo, hueco]);
        this.tuerca = csg.toMesh();

        this.tuerca.traverseVisible((nodo) => {
            nodo.castShadow = true;
            nodo.receiveShadow = true;
        });

        this.tuerca.geometry.computeBoundingBox();

        this.upDown();
        this.add(this.tuerca);
    }

    getBBox(){
        return this.bbox;
    }

    createTuerca(){
        var textura = new THREE.TextureLoader().load('../imgs/textura-dorada-metalica.jpg');
        var material = new THREE.MeshPhongMaterial({map: textura});
        
        var geomTuerca = new THREE.CylinderGeometry(this.rt, this.rt, this.rt, 6);
        var cil = new THREE.Mesh(geomTuerca, material);

        var geomEsfera = new THREE.SphereGeometry(this.rt);
        var esfera = new THREE.Mesh(geomEsfera, material);

        var csg = new CSG();
        csg.intersect([cil, esfera]);

        var cuerpoTuerca = csg.toMesh();
        return cuerpoTuerca;
    }

    upDown(){
        var origen = {x: 0, y: -5};
        var destino = {x: 0, y: 5};
        var movimiento = new TWEEN.Tween(origen)
            .to(destino, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.tuerca.position.x = origen.x;
                this.tuerca.position.y = origen.y;
            })
            .repeat(Infinity)
            .yoyo(true);
        
        movimiento.start();

    }

    update(dt){ //dt=delta time
        this.tuerca.rotation.x += this.velocidad*dt;
        this.tuerca.rotation.y += this.velocidad*dt;
        this.tuerca.rotation.z += this.velocidad*dt;

        this.bbox.copy(this.tuerca.geometry.boundingBox).applyMatrix4(this.tuerca.matrixWorld);

        TWEEN.update();
    }
}

export {Tuerca}