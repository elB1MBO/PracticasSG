import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import {Tronco} from './Tronco.js'

class TrampaH extends THREE.Object3D {
    constructor(){
        super();

        this.trampaH = new Tronco();
        this.trampaH.rotation.z = Math.PI/2;
        this.trampaH.position.x = -6;

        //Animacion de la trampa horizontal
        this.inOut();
        this.add(this.trampaH);
    }

    getBBox(){
        return this.trampaH.getBBox();
    }
    //Animacion Horizontal
    inOut(){
        var origen = {x: -this.trampaH.largoApoyo/3, y: 0};
        var destino = {x: this.trampaH.largoApoyo/3, y: 0};
        var movimiento = new TWEEN.Tween(origen)
            .to(destino, 1400)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(() => {
                this.trampaH.position.x = origen.x;
                this.trampaH.position.y = origen.y;
            })
            .repeat(Infinity)
            .yoyo(true);
        
        movimiento.start();

    }

    update(dt){
        this.trampaH.update(dt); //hay que actualizar tambien el tronco
        TWEEN.update();
    }
}

export {TrampaH}