import { Tornillo } from '../MisModelos/Tornillo.js'
import { Tuerca } from '../MisModelos/Tuerca.js'
import { Tronco } from '../MisModelos/Tronco.js'
import { TrampaH } from '../MisModelos/TrampaH.js'
import { TrampaV } from '../MisModelos/TrampaV.js'
import { TrampaPinchos } from '../MisModelos/TrampaPinchos.js'
import { Caja } from '../MisModelos/Caja.js'
import * as THREE from '../libs/three.module.js'

//Todos los modelos que usa la clase Objetos están en la carpeta MisModelos

class Objetos extends THREE.Object3D{
    constructor(){
        super();
        //Reloj
        this.clock = new THREE.Clock();

        //Array que contiene todos los box helpers
        this.boxHelpers = [];

        this.cajas = [];
        this.coleccionables = [];
        this.trampas = [];
        //Crear los obstáculos del escenario
        this.createObstacles();
        this.createCollectables();
        this.createCajas();
        //Linea de meta, solo visual, para que el jugador sepa exactemente donde empezó
        this.createMeta();

        //Una vez se han creado todos los objetos, se añaden todos los que estan en el array
        for(var i=0; i<this.boxHelpers.length; i++){
          this.add(this.boxHelpers[i]);
        }
        
    }

    //Funcion que cambia la visibilidad de los boxHelpers
    setBoxHelpers(value){
      for(var i=0; i<this.boxHelpers.length; i++){
        this.boxHelpers[i].visible = value;
      }
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
      //Trampas troncos
      this.createTrampasTroncos();
      //Pinchos:
      this.createTrampasPinchos();
    }
    
    //En cada trampa/coleccionable/caja que se cree, se añade el boxHelper al array

    createTrampasTroncos(){
      var boxHelper;

      var trampaH = this.importTrampaH();
      trampaH.position.z = 45;
      boxHelper = new THREE.Box3Helper(trampaH.getBBox(), 0xffff00);
      this.boxHelpers.push(boxHelper);
      this.trampas.push(trampaH);
      this.add(trampaH);
      
      var trampaV = this.importTrampaV();
      trampaV.position.z = 65;
      boxHelper = new THREE.Box3Helper(trampaV.getBBox(), 0xffff00);
      this.boxHelpers.push(boxHelper);
      this.trampas.push(trampaV);
      this.add(trampaV);

      trampaH = this.importTrampaH();
      trampaH.rotation.y = Math.PI;
      trampaH.position.z = 95;
      boxHelper = new THREE.Box3Helper(trampaH.getBBox(), 0xffff00);
      this.boxHelpers.push(boxHelper);
      this.trampas.push(trampaH);
      this.add(trampaH);

      trampaH = this.importTrampaH();
      trampaH.position.z = 110;
      boxHelper = new THREE.Box3Helper(trampaH.getBBox(), 0xffff00);
      this.boxHelpers.push(boxHelper);
      this.trampas.push(trampaH);
      this.add(trampaH);

      trampaV = this.importTrampaV();
      trampaV.position.z = 130;
      boxHelper = new THREE.Box3Helper(trampaV.getBBox(), 0xffff00);
      this.boxHelpers.push(boxHelper);
      this.trampas.push(trampaV);
      this.add(trampaV);
    }

    createTrampasPinchos(){
      var boxHelper;

      var ladoBase = 7;
      var trampaP = this.importTrampa(ladoBase);
      trampaP.position.z = 30;
      var boxHelper = new THREE.Box3Helper(trampaP.getBBox(), 0xffff00);
      this.boxHelpers.push(boxHelper);
      this.trampas.push(trampaP);
      this.add(trampaP);

      trampaP = this.importTrampa(ladoBase);
      trampaP.position.z = 30;
      trampaP.position.x = -6;
      var boxHelper = new THREE.Box3Helper(trampaP.getBBox(), 0xffff00);
      this.boxHelpers.push(boxHelper);
      this.trampas.push(trampaP);
      this.add(trampaP);

      trampaP = this.importTrampa(ladoBase);
      trampaP.position.z = 30;
      trampaP.position.x = 6;
      var boxHelper = new THREE.Box3Helper(trampaP.getBBox(), 0xffff00);
      this.boxHelpers.push(boxHelper);
      this.trampas.push(trampaP);
      this.add(trampaP);

      trampaP = this.importTrampa(ladoBase*1.1);
      trampaP.position.z = 80;
      trampaP.position.x = 6;
      var boxHelper = new THREE.Box3Helper(trampaP.getBBox(), 0xffff00);
      this.boxHelpers.push(boxHelper);
      this.trampas.push(trampaP);
      this.add(trampaP);

      trampaP = this.importTrampa(ladoBase*1.1);
      trampaP.position.z = 130;
      var boxHelper = new THREE.Box3Helper(trampaP.getBBox(), 0xffff00);
      this.boxHelpers.push(boxHelper);
      this.trampas.push(trampaP);
      this.add(trampaP);

      trampaP = this.importTrampa(ladoBase*1.1);
      trampaP.position.z = 130;
      trampaP.position.x = -6.5;
      var boxHelper = new THREE.Box3Helper(trampaP.getBBox(), 0xffff00);
      this.boxHelpers.push(boxHelper);
      this.trampas.push(trampaP);
      this.add(trampaP);

    }

    createCajas(){
      var boxHelper;

      var caja = this.importCaja();
      caja.position.z = 80;
      boxHelper = new THREE.Box3Helper(caja.getBBox(), 0xB72592);
      this.boxHelpers.push(boxHelper);
      this.cajas.push(caja);
      this.add(caja);
      caja = this.importCaja();
      caja.position.z = 80;
      caja.position.x = -5;
      boxHelper = new THREE.Box3Helper(caja.getBBox(), 0xB72592);
      this.boxHelpers.push(boxHelper);
      this.cajas.push(caja);
      this.add(caja);
    }

    createCollectables() {
      var boxHelper;
      //console.log("Crea coleccionables");
      
      var tornillo = this.importTornillo();
      tornillo.position.z = 10;
      boxHelper = new THREE.Box3Helper(tornillo.getBBox(), 0x40A0E4);
      this.boxHelpers.push(boxHelper);
      this.coleccionables.push(tornillo);
      this.add(tornillo);
      
      var tuerca = this.importTuerca();
      tuerca.position.z = 20;
      boxHelper = new THREE.Box3Helper(tuerca.getBBox(), 0x40A0E4);
      this.boxHelpers.push(boxHelper);
      this.coleccionables.push(tuerca);
      this.add(tuerca);

      tornillo = this.importTornillo();
      tornillo.position.z = 65;
      tornillo.position.x = -7;
      boxHelper = new THREE.Box3Helper(tornillo.getBBox(), 0x40A0E4);
      this.boxHelpers.push(boxHelper);
      this.coleccionables.push(tornillo);
      this.add(tornillo);
      
      tuerca = this.importTuerca();
      tuerca.position.z = 95;
      tuerca.position.x = -7;
      boxHelper = new THREE.Box3Helper(tuerca.getBBox(), 0x40A0E4);
      this.boxHelpers.push(boxHelper);
      this.coleccionables.push(tuerca);
      this.add(tuerca);

      tornillo = this.importTornillo();
      tornillo.position.z = 95;
      tornillo.position.x = 7;
      boxHelper = new THREE.Box3Helper(tornillo.getBBox(), 0x40A0E4);
      this.boxHelpers.push(boxHelper);
      this.coleccionables.push(tornillo);
      this.add(tornillo);
      
      //Esta última tuerca señala el punto de checkpoint
      tuerca = this.importTuerca();
      tuerca.scale.x = 0.4;
      tuerca.scale.y = 0.4;
      tuerca.scale.z = 0.4;
      tuerca.position.y = 3.6;
      tuerca.position.z = 160;
      boxHelper = new THREE.Box3Helper(tuerca.getBBox(), 0x40A0E4);
      this.boxHelpers.push(boxHelper);
      this.coleccionables.push(tuerca);
      this.add(tuerca);
    }

    //Para señalar la salida y final del nivel
    createMeta(){
      var geom = new THREE.BoxGeometry(20, 0.01, 5);
      var textura = new THREE.TextureLoader().load('../imgs/textura-ajedrezada.jpg');
      textura.wrapS = THREE.RepeatWrapping;
      textura.wrapT = THREE.RepeatWrapping;
      textura.repeat.set(3, 1);
      var material = new THREE.MeshPhongMaterial({map:textura});

      var meta = new THREE.Mesh(geom, material);
      this.add(meta);
    }

    
  // ******* ******* Importar y ajustar objetos externos ******* ******* 
  //TORNILLO
  importTornillo(){
    var tornillo = new Tornillo();
    tornillo.scale.x = 0.2;
    tornillo.scale.y = 0.2;
    tornillo.scale.z = 0.2;
    tornillo.position.y = 2.5;
    return tornillo;
  }
  //TUERCA
  importTuerca(){
    var tuerca = new Tuerca();
    tuerca.scale.x = 0.2;
    tuerca.scale.y = 0.2;
    tuerca.scale.z = 0.2;
    tuerca.position.y = 2.5;
    return tuerca;
  }
  //TRONCO
  importTronco(){
    var tronco = new Tronco();
    tronco.scale.x = 0.6;
    tronco.scale.y = 0.6;
    tronco.scale.z = 0.6;
    return tronco;
  }
  //TRAMPAS TRONCO
  importTrampaH() {
    var trampaH = new TrampaH();
    trampaH.scale.x = 0.6;
    trampaH.scale.y = 0.6;
    trampaH.scale.z = 0.6;
    trampaH.position.y = 2;
    return trampaH;
  }
  importTrampaV() {
    var trampaV = new TrampaV();
    trampaV.scale.x = 0.6;
    trampaV.scale.y = 0.6;
    trampaV.scale.z = 0.6;
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
    caja.position.y = 1.5;
    return caja;
  }

  // ******* ******* ******* UPDATE ******* ******* ******* 

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