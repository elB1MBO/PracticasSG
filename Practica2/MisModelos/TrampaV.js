import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
import { Tronco } from './Tronco.js';

class TrampaV extends THREE.Object3D {
    constructor(){
        super();

        this.trampaV = new Tronco();
        this.balanceo();
        this.add(this.trampaV);
    }

    balanceo(){
        //Definimos el spline
        /* this.spline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-this.trampaV.largoApoyo, this.trampaV.largoApoyo, 0),
            //new THREE.Vector3(-this.largoApoyo/2, this.largoApoyo/2, 0),
            new THREE.Vector3(0, 0, 0),
            //new THREE.Vector3(this.largoApoyo/2, this.largoApoyo/2, 0),
            new THREE.Vector3(this.trampaV.largoApoyo, this.trampaV.largoApoyo, 0),
        ]);

        var curva = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-this.trampaV.largoApoyo, this.trampaV.largoApoyo, 0),
            new THREE.Vector3(0, -this.trampaV.largoApoyo, 0),
            new THREE.Vector3(this.trampaV.largoApoyo, this.trampaV.largoApoyo, 0),
        );
        
        var geom = new THREE.BufferGeometry();
        geom.setFromPoints(curva.getPoints(100));
        var material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 2});
        var visibleSpline = new THREE.Line(geom, material);
        this.add(visibleSpline);

        var cp = new THREE.CurvePath();
        cp.add(curva); */

        var origen = {x: -this.trampaV.largoApoyo/3, y: 3};
        var destino = {x: this.trampaV.largoApoyo/3, y: 3};
        /* var origen = {p: cp.getPoint(0)};
        var destino = {p: cp.getPoint(2)}; */
        var movimiento = new TWEEN.Tween(origen)
            .to(destino, 1800) //2 seg
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
        this.trampaV.update(dt);
        TWEEN.update();
    }
}

export {TrampaV}