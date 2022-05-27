import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class Tronco extends THREE.Object3D {
    constructor(){
        super();

        this.velocidadGiro = 3;  //Velocidad animacion del tronco

        this.radioTronco = 1;
        this.largoTronco = 14;

        this.largoApoyo = 35;
        this.ta = 0.3;

        //Relativo a los pinchos
        this.numFilas = 3;
        this.pinchosPorFila = 4;

        this.tronco = this.createTronco();

        this.pinchos = this.createPinchos();
        this.tronco.add(this.pinchos);

        this.colliderTronco = this.createColliderTronco();
        this.tronco.add(this.colliderTronco);

        this.apoyos = this.createApoyos();

        this.collidersApoyos = this.createCollidersApoyos();
        this.apoyos.add(this.collidersApoyos);

        this.troncoConApoyos = new THREE.Mesh();
        this.troncoConApoyos.add(this.tronco);
        this.troncoConApoyos.add(this.apoyos);
        this.add(this.troncoConApoyos);
    }

    setWorldPosition(x, y, z){
        this.colliderTronco.position.x = x;
    }

    getColliderTronco(){
        return this.colliderTronco;
    }
    getCollidersApoyo(){
        return this.collidersApoyos;
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

    createApoyos(){
        var geom = new THREE.BoxGeometry(this.ta/2, this.largoApoyo, this.ta);
        var material = new THREE.MeshToonMaterial({color:0x3E2E08});

        var apoyo1 = new THREE.Mesh(geom, material);
        var apoyo2 = new THREE.Mesh(geom, material);
        
        apoyo1.position.x = this.largoTronco/2 + this.ta/4;
        apoyo2.position.x = -this.largoTronco/2 - this.ta/4;
        
        var csg = new CSG();
        csg.union([apoyo1, apoyo2]);
        var apoyos = csg.toMesh();
        apoyos.rotation.y = Math.PI/2;
        apoyos.position.y = this.largoApoyo/2;
        return apoyos;
    }

    createColliderTronco(){
        var geom = new THREE.CylinderGeometry(this.radioTronco*1.4, this.radioTronco*1.4, this.largoTronco, 30, 30);
        var material = new THREE.MeshNormalMaterial();
        var collider = new THREE.Mesh(geom, material);
        collider.rotation.x = Math.PI/2;
        return collider;
    }

    createCollidersApoyos(){
        var geom = new THREE.BoxGeometry(this.ta*2, this.largoApoyo, this.ta);
        var material = new THREE.MeshNormalMaterial();
        var colliderApoyo1 = new THREE.Mesh(geom, material);
        var colliderApoyo2 = new THREE.Mesh(geom, material);
        colliderApoyo1.position.x = this.largoTronco/2 + this.ta/4;
        colliderApoyo2.position.x = -this.largoTronco/2 - this.ta/4;

        var csg = new CSG();
        csg.union([colliderApoyo1, colliderApoyo2]);
        var collApoyos = csg.toMesh();
        /* collApoyos.rotation.y = Math.PI/2;
        collApoyos.position.y = this.largoApoyo/2; */

        return collApoyos;
    }

    update(dt){
        this.tronco.rotation.z -= this.velocidadGiro*dt;
    }
}

export {Tronco}