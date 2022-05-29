import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import {CilindroBarrido} from './CilindroBarrido.js'
import * as TWEEN from '../libs/tween.esm.js'

class Tornillo extends THREE.Object3D {
    constructor(){
        super();
        //Creamos y referenciamos un reloj para la animacion
        this.reloj = new THREE.Clock();

        //Atributo velocidad:
        this.velocidad = 0.75;
        //Radio de la cabeza del tornillo
        this.radioCabeza = 3;

        this.bbox = new THREE.Box3();

        var cuerpo = new CilindroBarrido();
        cuerpo.position.y = -2.5;
        var cabeza = this.createCabeza();

        var csg = new CSG();
        csg.union([cabeza, cuerpo]);
        this.tornillo = csg.toMesh();

        this.tornillo.traverseVisible((nodo) => {
            nodo.castShadow = true;
            nodo.receiveShadow = true;
        });

        this.tornillo.geometry.computeBoundingBox();

        this.upDown();
        this.add(this.tornillo);
    }

    getBBox(){
        return this.bbox;
    }

    createCabeza(){
        var textura = new THREE.TextureLoader().load('../imgs/textura-dorada-metalica.jpg');
        var material = new THREE.MeshPhongMaterial({map: textura});

        var geometria = new THREE.SphereGeometry(this.radioCabeza);
        var geomCubo = new THREE.BoxGeometry(this.radioCabeza*2, this.radioCabeza*2, this.radioCabeza*2);
        var esfera = new THREE.Mesh(geometria, material);
        var cubo = new THREE.Mesh(geomCubo, new THREE.MeshBasicMaterial());

        cubo.position.y = -this.radioCabeza;

        var cruz = this.createCruz();
        cruz.position.y = this.radioCabeza;

        var csg = new CSG();
        csg.subtract([esfera, cubo]);
        csg.subtract([cruz]);
        var cabeza = csg.toMesh();

        return cabeza;
    }

    createCruz(){
        var material = new THREE.MeshNormalMaterial();
        var geometria = new THREE.BoxGeometry(3, 1.5, 0.5);

        var cuboX = new THREE.Mesh(geometria, material);
        var cuboZ = new THREE.Mesh(geometria, material);

        cuboZ.rotation.y = Math.PI/2;

        var csg = new CSG();
        csg.union([cuboX, cuboZ]);

        var cruz = csg.toMesh();
        return cruz;
    }

    //Animacion de subir y bajar
    upDown(){
        var origen = {x: 0, y: -5};
        var destino = {x: 0, y: 5};
        var movimiento = new TWEEN.Tween(origen)
            .to(destino, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.tornillo.position.x = origen.x;
                this.tornillo.position.y = origen.y;
            })
            .repeat(Infinity)
            .yoyo(true);
        
        movimiento.start();
    }

    update(dt){ //dt=delta time
        this.tornillo.rotation.x += this.velocidad * dt;
        this.tornillo.rotation.x += this.velocidad * dt;
        this.tornillo.rotation.z += this.velocidad * dt;

        this.bbox.copy(this.tornillo.geometry.boundingBox).applyMatrix4(this.tornillo.matrixWorld);
        TWEEN.update();
    }
}

export {Tornillo}