import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { Tronco } from './Tronco.js';

class TrampaV extends THREE.Object3D {
    constructor(){
        super();

        this.trampaV = new Tronco();

        this.trampaV.traverseVisible((nodo) => {
            nodo.castShadow = true;
            nodo.receiveShadow = true;
        });

        this.balanceo();
        this.add(this.trampaV);
    }

    getBBox(){
        return this.trampaV.getBBox();
    }

    balanceo(){
        var origen = {x: -this.trampaV.largoApoyo/3, y: 3};
        var destino = {x: this.trampaV.largoApoyo/3, y: 3};
        var movimiento = new TWEEN.Tween(origen)
            .to(destino, 1400)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate (() => {  
                this.trampaV.position.x = origen.x;
                this.trampaV.position.y = origen.y;
            })
            .repeat(Infinity)
            .yoyo(true);
        
        movimiento.start();
    }

    update(dt){
        this.trampaV.update(dt);
        TWEEN.update();
    }
}

export {TrampaV}