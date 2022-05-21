import { Tornillo } from '../MisModelos/Tornillo.js'
import { Tuerca } from '../MisModelos/Tuerca.js'
import { Tronco } from '../MisModelos/Tronco.js'
import { TrampaPinchos } from '../MisModelos/TrampaPinchos.js'
import { Caja } from '../MisModelos/Caja.js'
import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'

class Objetos extends THREE.Object3D{
    constructor(){
        super();
        //Reloj
        this.clock = new THREE.Clock();
        //Crear los obstáculos del escenario
        this.createObstacles();
        this.createCollectables();
    }

    createObstacles(){
        this.tronco = this.importTronco();
        this.tronco.position.z = 30;
        this.tronco.rotation.y = Math.PI/2;
        this.trampaP = this.importTrampa();
        this.caja = this.importCaja();
        this.caja2 = this.importCaja();
        this.caja2.position.x = -5;

        this.add(this.tronco);
        this.add(this.trampaP);
        this.add(this.caja);
        this.add(this.caja2);
    }

    createCollectables(){
        this.tornillo = this.importTornillo();
        this.tuerca = this.importTuerca();

        this.add(this.tornillo);
        this.add(this.tuerca);
    }

    
  // ******* ******* Importar y colocar objetos externos ******* ******* 
  //TORNILLO
  importTornillo(){
    var tornillo = new Tornillo();
    tornillo.scale.x = 0.2;
    tornillo.scale.y = 0.2;
    tornillo.scale.z = 0.2;
    tornillo.position.x = 3;
    tornillo.position.y = 2.5;
    return tornillo;
  }
  //TUERCA
  importTuerca(){
    var tuerca = new Tuerca();
    tuerca.scale.x = 0.2;
    tuerca.scale.y = 0.2;
    tuerca.scale.z = 0.2;
    tuerca.position.x = 6;
    tuerca.position.y = 2.5;
    return tuerca;
  }
  //TRONCO
  importTronco(){
    var tronco = new Tronco();
    tronco.scale.x = 0.6;
    tronco.scale.y = 0.6;
    tronco.scale.z = 0.6;
    tronco.position.x = -3;
    tronco.position.y = 1;
    return tronco;
  }
  //TRAMPA PINCHOS
  importTrampa(){
    var trampa = new TrampaPinchos();
    trampa.scale.x = 0.8;
    trampa.scale.y = 0.8;
    trampa.scale.z = 0.8;
    trampa.position.z = 4;
    return trampa;
  }

  //CAJA
  importCaja(){
    var caja = new Caja();
    caja.position.z = 20;
    caja.position.x = 5;
    caja.position.y = 1.5;
    return caja;
  }

  // ******* ******* ******* ******* ******* ******* ******* 

    update(){
        var dt = this.clock.getDelta();
        this.tornillo.update(dt);
        this.tuerca.update(dt);
        this.tronco.update(dt);
        this.trampaP.update(dt);
    }
}

export{Objetos}