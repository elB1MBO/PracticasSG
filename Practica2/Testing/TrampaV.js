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