import { Tornillo } from './Tornillo.js'
import { Tuerca } from './Tuerca.js'
import { Tronco } from './Tronco.js'
import { TrampaH } from './TrampaH.js'
import { TrampaV } from './TrampaV.js'
import { TrampaPinchos } from './TrampaPinchos.js'
import { Caja } from './Caja.js'
import * as THREE from '../libs/three.module.js'


class Objetos extends THREE.Object3D{
    constructor(){
        super();
        //Reloj
        this.clock = new THREE.Clock();

        this.cajas = [];
        this.coleccionables = [];
        this.trampas = [];
        //Crear los obstáculos del escenario
        this.createObstacles();
        this.createCollectables();
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
      
      var boxHelper;

      /* var tronco = this.importTronco();
      tronco.position.z = 30;
      tronco.rotation.y = Math.PI/2;
      boxHelper = new THREE.Box3Helper(tronco.getBBox(), 0xffff00);
      this.add(boxHelper);
      this.trampas.push(tronco);
      this.add(tronco); */

      //Cajas
      var caja = this.importCaja();
      boxHelper = new THREE.Box3Helper(caja.getBBox(), 0xB72592);
      this.add(boxHelper);
      this.cajas.push(caja);
      this.add(caja);
      caja = this.importCaja();
      caja.position.x = -5;
      boxHelper = new THREE.Box3Helper(caja.getBBox(), 0xB72592);
      this.add(boxHelper);
      this.cajas.push(caja);
      this.add(caja);
      
      //Trampas troncos
      var trampaH = this.importTrampaH();
      trampaH.position.z = 40;
      boxHelper = new THREE.Box3Helper(trampaH.getBBox(), 0xffff00);
      this.add(boxHelper);
      this.trampas.push(trampaH);
      this.add(trampaH);
      
      var trampaV = this.importTrampaV();
      trampaV.position.z = 60;
      boxHelper = new THREE.Box3Helper(trampaV.getBBox(), 0xffff00);
      this.add(boxHelper);
      this.trampas.push(trampaV);
      this.add(trampaV);
      //Pinchos:
      var ladoBase = 5;
      var trampaP = this.importTrampa(ladoBase*2);
      trampaP.position.z = 10;
      var boxHelper = new THREE.Box3Helper(trampaP.getBBox(), 0xffff00);
      this.add(boxHelper);
      this.trampas.push(trampaP);
      this.add(trampaP);

      trampaP = this.importTrampa(ladoBase*2);
      trampaP.position.z = 150;
      boxHelper = new THREE.Box3Helper(trampaP.getBBox(), 0xffff00);
      this.add(boxHelper);
      this.trampas.push(trampaP);
      this.add(trampaP);
      trampaP = this.importTrampa(ladoBase*2.5);
      trampaP.position.x = 10;
      trampaP.position.z = 100;
      boxHelper = new THREE.Box3Helper(trampaP.getBBox(), 0xffff00);
      this.add(boxHelper);
      this.trampas.push(trampaP);
      this.add(trampaP);
    }
  
    createCollectables() {
      var boxHelper;
      
      var tornillo = this.importTornillo();
      boxHelper = new THREE.Box3Helper(tornillo.getBBox(), 0x40A0E4);
      this.add(boxHelper);
      this.coleccionables.push(tornillo);
      
      var tuerca = this.importTuerca();
      boxHelper = new THREE.Box3Helper(tuerca.getBBox(), 0x40A0E4);
      this.add(boxHelper);
      this.coleccionables.push(tuerca);
  
      this.add(tornillo);
      this.add(tuerca);
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
  importTrampa(ladoBase){
    var trampa = new TrampaPinchos(ladoBase);
    trampa.scale.x = 0.8;
    trampa.scale.y = 0.8;
    trampa.scale.z = 0.8;
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

    update(dt){
        //var dt = this.clock.getDelta();

        //Para hacer update de varios objetos seria:
        for(var i = 0; i<this.cajas.length; i++){
          this.cajas[i].update(dt);
        }
        for(var i = 0; i<this.coleccionables.length; i++){
          this.coleccionables[i].update(dt);
        }
        for(var i = 0; i<this.trampas.length; i++){
          this.trampas[i].update(dt);
        }
    }
}

export{Objetos}