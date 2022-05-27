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
        this.collider = this.createCollider();
        this.pinchosP.add(this.collider);
        
        /* this.agujeros = this.createAgujeros();
        this.trampa.add(this.agujeros);*/

        this.trampa.add(this.pinchosP);
        this.upDown();
        this.add(this.trampa);
    }

    getCollider(){
        return this.collider;
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
        return trampa;
    }
    createAgujeros(){
        var geom = new THREE.CylinderGeometry(0.5, 0.5, 0.01, 30, 30);
        var material = new THREE.MeshBasicMaterial({color:0x111111});
        geom.translate(0, this.alturaBase/2, 0);
        var agujeroOriginal = new THREE.Mesh(geom, material);
        var csg = new CSG();
        for(let i = 1; i < this.ladoBase; i++){       //Fila
            for(let j = 1; j < this.ladoBase; j++){   //Columna
                var agujeroj = new THREE.Mesh(geom, material);
                agujeroj.position.z = i;
                agujeroj.position.x = j;
                csg.union([agujeroOriginal, agujeroj]);
            }
        }
        csg.subtract([agujeroOriginal]);
        var agujeros = csg.toMesh();
        agujeros.position.x = -this.ladoBase/2;
        agujeros.position.z = -this.ladoBase/2;
        return agujeros;
    }

    createCollider(){
        var geom = new THREE.BoxGeometry(this.ladoBase, 0.2, this.ladoBase);
        var material = new THREE.MeshNormalMaterial();
        var collider = new THREE.Mesh(geom, material);
        collider.position.x = this.ladoBase/2;
        collider.position.y = this.alturaBase;
        collider.position.z = this.ladoBase/2;
        return collider;
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
        //var dt = this.reloj.getDelta(); //Segundos desde la ultima llamada
        /* this.tornillo.rotation.x += this.velocidad * dt;
        this.tornillo.rotation.x += this.velocidad * dt;
        this.tornillo.rotation.z += this.velocidad * dt;
        */
        //this.pinchosP.rotation.y += 0.1;

        //this.upDown(this.velocidad*dt);
        TWEEN.update();
    }

}

export { TrampaPinchos }