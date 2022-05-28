import { Tornillo } from '../MisModelos/Tornillo.js'
import { Tuerca } from '../MisModelos/Tuerca.js'
import { Tronco } from '../MisModelos/Tronco.js'
import { TrampaH } from '../MisModelos/TrampaH.js'
import { TrampaV } from '../MisModelos/TrampaV.js'
import { TrampaPinchos } from '../MisModelos/TrampaPinchos.js'
import { Caja } from '../MisModelos/Caja.js'
import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'

class Objetos extends THREE.Object3D {
  constructor() {
    super();
    //Reloj
    this.clock = new THREE.Clock();

    //Vectores con los objetos
    this.cajas = [];
    this.coleccionables = [];
    this.trampas = [];

    //Crear los obstáculos del escenario
    this.createObstacles();
    this.createCollectables();

    //Colliders
   /*  this.collidersTrampas = [this.trampaH.getTronco().getColliderTronco(), this.trampaP.getCollider()];
    this.collidersParedes = [this.caja.getCollider()];
    this.collidersColecc = [this.tornillo.getCollider(), this.tuerca.getCollider()]; */
  }

  getCajas(){
    return this.cajas;
  }
  getColeccionables(){
    return this.coleccionables;
  }
  getTrampas(){
    return this.trampas;
  }

  createObstacles() {
    /* this.tronco = this.importTronco();
    this.tronco.position.z = 30;
    this.tronco.rotation.y = Math.PI/2; */

    //Cajas
    var caja = this.importCaja();
    this.cajas.push(caja);
    this.add(caja);
    caja = this.importCaja();
    caja.position.x = -5;
    this.cajas.push(caja);
    this.add(caja);
    
    //Trampas troncos
    var trampaH = this.importTrampaH();
    trampaH.position.z = 40;
    var trampaV = this.importTrampaV();
    trampaV.position.z = 60;
    this.add(trampaH);
    this.trampas.push(trampaH);
    this.add(trampaV);
    this.trampas.push(trampaV);
    //Pinchos:
    var ladoBase = 5;
    var trampaP = this.importTrampa(ladoBase);
    this.trampas.push(trampaP);
    this.add(trampaP);
    trampaP = this.importTrampa(ladoBase*2);
    trampaP.position.z = 150;
    this.trampas.push(trampaP);
    this.add(trampaP);
    trampaP = this.importTrampa(ladoBase*2.5);
    trampaP.position.x = 10;
    trampaP.position.z = 100;
    this.trampas.push(trampaP);
    this.add(trampaP);
  }

  createCollectables() {
    var tornillo = this.importTornillo();
    var tuerca = this.importTuerca();

    this.coleccionables.push(tornillo);
    this.coleccionables.push(tuerca);

    this.add(tornillo);
    this.add(tuerca);
  }

  // ******* ******* COLLIDERS ******* ******* 

  getColliders(){
    //Array de arrays
    var arrayColliders = [this.collidersTrampas, this.collidersParedes, this.collidersColecc];
    return arrayColliders;
  }

  // ******* ******* Importar y colocar objetos externos ******* ******* 
  //TORNILLO
  importTornillo() {
    var tornillo = new Tornillo();
    tornillo.scale.x = 0.2;
    tornillo.scale.y = 0.2;
    tornillo.scale.z = 0.2;
    tornillo.position.x = 3;
    tornillo.position.y = 2.5;
    //Añade el collider del objeto importado a su array correspondiente
    
    /* this.collidersColecc.push(tornillo.getCollider()); */
    return tornillo;
  }

  //TUERCA
  importTuerca() {
    var tuerca = new Tuerca();
    tuerca.scale.x = 0.2;
    tuerca.scale.y = 0.2;
    tuerca.scale.z = 0.2;
    tuerca.position.x = 6;
    tuerca.position.y = 2.5;
    /* this.collidersColecc.push(tuerca.getCollider()); */
    return tuerca;
  }
  //TRONCO
  importTronco() {
    var tronco = new Tronco();
    tronco.scale.x = 0.6;
    tronco.scale.y = 0.6;
    tronco.scale.z = 0.6;
    tronco.position.x = -3;
    tronco.position.y = 1;
    /* this.collidersParedes.push(tronco.getCollidersApoyo());
    this.collidersTrampas.push(tronco.getColliderTronco()); */
    return tronco;
  }
  //TRAMPAS TRONCO
  importTrampaH() {
    var trampaH = new TrampaH();
    trampaH.scale.x = 0.6;
    trampaH.scale.y = 0.6;
    trampaH.scale.z = 0.6;
    trampaH.position.y = 2;
    /* this.collidersParedes.push(trampaH.getTronco().getCollidersApoyo());
    this.collidersTrampas.push(trampaH.getTronco().getColliderTronco()); */
    return trampaH;
  }
  importTrampaV() {
    var trampaV = new TrampaV();
    trampaV.scale.x = 0.6;
    trampaV.scale.y = 0.6;
    trampaV.scale.z = 0.6;
    /* this.collidersParedes.push(trampaV.getTronco().getCollidersApoyo());
    this.collidersTrampas.push(trampaV.getTronco().getColliderTronco()); */
    return trampaV;
  }
  //TRAMPA PINCHOS
  importTrampa(ladoBase) {
    var trampa = new TrampaPinchos(ladoBase);
    trampa.scale.x = 0.8;
    trampa.scale.y = 0.8;
    trampa.scale.z = 0.8;
    trampa.position.z = 4;
    //this.collidersTrampas.push(trampa.getCollider());
    return trampa;
  }

  //CAJA
  importCaja() {
    var caja = new Caja();
    caja.position.z = 20;
    caja.position.x = 5;
    caja.position.y = 1.5;
    return caja;
  }

  // ******* ******* ******* ******* ******* ******* ******* 

  update() {
    var dt = this.clock.getDelta();
        
    for(var i = 0; i<this.trampas.length; i++){
      this.trampas[i].update(dt);
    }
    for(var i = 0; i<this.cajas.length; i++){
      this.cajas[i].update(dt);
    }
    for(var i = 0; i<this.coleccionables.length; i++){
      this.coleccionables[i].update(dt);
    }
  }
}

export { Objetos }