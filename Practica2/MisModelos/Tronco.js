import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class Tronco extends THREE.Object3D {
    constructor(){
        super();

        this.velocidadGiro = 3;  //Velocidad animacion del tronco

        this.radioTronco = 1;
        this.largoTronco = 14;

        //Relativo a los pinchos
        this.numFilas = 3;
        this.pinchosPorFila = 4;

        this.tronco = this.createTronco();

        this.pinchos = this.createPinchos();

        this.apoyos = this.createApoyos();

        this.tronco.add(this.pinchos);
        //this.add(this.tronco);

        //A partir del tronco, crearé 2 trampas: una horizontal y otra vertical
        this.trampaV = new THREE.Mesh();
        this.tronco.position.y = -this.largoApoyo;
        this.apoyos.position.y = -this.largoApoyo/2;
        this.trampaV.add(this.tronco);
        this.trampaV.add(this.apoyos);
        this.trampaV.position.y = this.largoApoyo;
        this.balanceo();
        this.add(this.trampaV);

        /* this.trampaH = new THREE.Mesh();
        //Hay que hacer copias del tronco y los apoyos:
        var troncoH = this.tronco;
        var apoyosH = this.apoyos;

        this.trampaH.add(troncoH);
        this.trampaH.add(apoyosH);
        this.trampaH.rotation.z = Math.PI/2;
        this.trampaH.position.x = -6;
        //Animacion de la trampa horizontal
        this.inOut(); */

        //this.add(this.trampaH);
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
        this.largoApoyo = 15;
        var ta = 0.3;
        var geom = new THREE.BoxGeometry(ta/2, this.largoApoyo, ta);
        var material = new THREE.MeshToonMaterial({color:0x3E2E08});

        var apoyo1 = new THREE.Mesh(geom, material);
        var apoyo2 = new THREE.Mesh(geom, material);

        apoyo1.position.x = this.largoTronco/2 + ta/4;
        apoyo2.position.x = -this.largoTronco/2 - ta/4;
        
        var csg = new CSG();
        csg.union([apoyo1, apoyo2]);
        var apoyos = csg.toMesh();
        apoyos.rotation.y = Math.PI/2;
        apoyos.position.y = this.largoApoyo/2;
        return apoyos;
    }

    createGUI(gui, titleGUI){
        var folder = gui.addFolder(titleGUI);
    }

    //Animacion Horizontal
    inOut(){
        var origen = {x: -this.largoApoyo/2, y: 0};
        var destino = {x: this.largoApoyo/2, y: 0};
        var movimiento = new TWEEN.Tween(origen)
            .to(destino, 1500)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(() => {
                this.trampaH.position.x = origen.x;
                this.trampaH.position.y = origen.y;
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

    balanceo(){
        //Definimos el spline
        this.spline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-this.largoApoyo, this.largoApoyo, 0),
            //new THREE.Vector3(-this.largoApoyo/2, this.largoApoyo/2, 0),
            new THREE.Vector3(0, 0, 0),
            //new THREE.Vector3(this.largoApoyo/2, this.largoApoyo/2, 0),
            new THREE.Vector3(this.largoApoyo, this.largoApoyo, 0),
        ]);

        var curva = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-this.largoApoyo, this.largoApoyo, 0),
            new THREE.Vector3(0, -this.largoApoyo, 0),
            new THREE.Vector3(this.largoApoyo, this.largoApoyo, 0),
        );
        
        var geom = new THREE.BufferGeometry();
        geom.setFromPoints(curva.getPoints(100));
        var material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 2});
        var visibleSpline = new THREE.Line(geom, material);
        this.add(visibleSpline);

        var cp = new THREE.CurvePath();
        cp.add(curva);

        var origen = {x: -this.largoApoyo/2, y: this.largoApoyo};
        var destino = {x: this.largoApoyo/2, y: this.largoApoyo};
        /* var origen = {p: cp.getPoint(0)};
        var destino = {p: cp.getPoint(2)}; */
        var movimiento = new TWEEN.Tween(origen)
            .to(destino, 2300) //2 seg
            .easing(TWEEN.Easing.Quadratic.InOut)
            //Qué hacer con esos parámetros
            .onUpdate (() => {  
                this.trampaV.position.x = origen.x;
                this.trampaV.position.y = origen.y;
                /* //Se coloca y orienta el objeto a animar
                var posicion = this.spline.getPointAt (origen.p);
                this.trampaV.position.copy (posicion);
                var tangente = this.spline.getTangentAt (origen.p);
                posicion.add(tangente); //Se mira a un punto en esa dirección
                this.trampaV.lookAt (posicion);
                //Lo que se alinea con la tangente es la Z positiva del objeto */
            })
            .repeat(Infinity)
            .yoyo(true);
        
        movimiento.start();
        //TWEEN.update();
        //TWEEN.add(movimiento);
    }

    update(dt){
        this.tronco.rotation.z -= this.velocidadGiro*dt;

        TWEEN.update();
    }
}

export {Tronco}