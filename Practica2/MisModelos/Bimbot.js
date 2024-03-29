import * as THREE from '../libs/three.module.js'
import { GLTFLoader } from '../libs/GLTFLoader.js'
import { Tornillo } from './Tornillo.js'
import { Tuerca } from './Tuerca.js'
import { Tronco } from './Tronco.js'
import { TrampaH } from './TrampaH.js'
import { TrampaV } from './TrampaV.js'
import { TrampaPinchos } from './TrampaPinchos.js'
import { Caja } from './Caja.js'
import * as TWEEN from '../libs/tween.esm.js'

 
class Bimbot extends THREE.Object3D {
  constructor(gui,str) {
    super();
    this.clock = new THREE.Clock();
    var that = this;
    var loader = new GLTFLoader();
    loader.load( '../models/gltf/robot.glb', ( gltf ) => {
      // El modelo está en el atributo  scene
      var model = gltf.scene;
      // Y las animaciones en el atributo  animations
      var animations = gltf.animations;
      // No olvidarse de colgar el modelo del Object3D de esta instancia de la clase (this)
      model.position.z = -10;
      that.add( model );
//       console.log (animations);
      that.createActions(model,animations);
      // Se crea la interfaz de usuario que nos permite ver las animaciones que tiene el modelo y qué realizan
      that.createGUI (gui, str);
    }, undefined, ( e ) => { console.error( e ); }
    );

    this.tornillo = this.importTornillo();
    this.tuerca = this.importTuerca();
    this.tronco = this.importTronco();
    this.trampaP = this.importTrampa();
    this.caja = this.importCaja();
    this.trampaH = this.importTrampaH();
    this.trampaV = this.importTrampaV();

    this.add(this.tornillo);
    this.add(this.tuerca);
    this.add(this.trampaP);
    this.add(this.caja);
    this.add(this.trampaH);
    this.add(this.trampaV);

    var geom = new THREE.BoxGeometry(2, 4.4, 2);
    var material = new THREE.MeshNormalMaterial();
    var caja = new THREE.Mesh(geom, material);
    caja.position.y = 2.2;
    //this.add(caja);
  }
  
  // ******* ******* Importar y colocar objetos externos ******* ******* 
  //TORNILLO
  importTornillo(){
    var tornillo = new Tornillo();
    tornillo.scale.x = 0.2;
    tornillo.scale.y = 0.2;
    tornillo.scale.z = 0.2;
    tornillo.position.x = 10;
    tornillo.position.y = 2.5;
    return tornillo;
  }
  //TUERCA
  importTuerca(){
    var tuerca = new Tuerca();
    tuerca.scale.x = 0.2;
    tuerca.scale.y = 0.2;
    tuerca.scale.z = 0.2;
    tuerca.position.x = 15;
    tuerca.position.y = 2.5;
    return tuerca;
  }
  //TRONCO
  importTronco(){
    var tronco = new Tronco();
    tronco.scale.x = 0.6;
    tronco.scale.y = 0.6;
    tronco.scale.z = 0.6;
    tronco.position.y = 2;
    return tronco;
  }
  //TRAMPAS TRONCO
  importTrampaH(){
    var trampaH = new TrampaH();
    trampaH.scale.x = 0.6;
    trampaH.scale.y = 0.6;
    trampaH.scale.z = 0.6;
    trampaH.position.y = 2;
    trampaH.position.x = 0;
    return trampaH;
  }
  importTrampaV(){
    var trampaV = new TrampaV();
    trampaV.scale.x = 0.6;
    trampaV.scale.y = 0.6;
    trampaV.scale.z = 0.6;
    trampaV.position.x = 0;
    trampaV.position.z = 10;
    return trampaV;
  }
  //TRAMPA PINCHOS
  importTrampa(){
    var trampa = new TrampaPinchos(5);
    trampa.scale.x = 0.8;
    trampa.scale.y = 0.8;
    trampa.scale.z = 0.8;
    //trampa.position.z = 20;
    return trampa;
  }

  //CAJA
  importCaja(){
    var caja = new Caja();
    caja.position.z = -20;
    caja.position.x = 1;
    caja.position.y = 1.5;
    return caja;
  }

  // ******* ******* ******* ******* ******* ******* ******* 
  
  createActions (model, animations) {
    // Se crea un mixer para dicho modelo
    // El mixer es el controlador general de las animaciones del modelo, 
    //    las lanza, las puede mezclar, etc.
    // En realidad, cada animación tiene su accionador particular 
    //    y se gestiona a través de dicho accionador
    // El mixer es el controlador general de los accionadores particulares
    this.mixer = new THREE.AnimationMixer (model);
    console.log(this.mixer);

    // El siguiente diccionario contendrá referencias a los diferentes accionadores particulares 
    // El diccionario Lo usaremos para dirigirnos a ellos por los nombres de las animaciones que gestionan
    this.actions = {};
    // Los nombres de las animaciones se meten en este array, 
    // para completar el listado en la interfaz de usuario
    this.clipNames = [];
    
    for (var i = 0; i < animations.length; i++) {
      // Se toma una animación de la lista de animaciones del archivo gltf
      var clip = animations[i];
      
      // A partir de dicha animación obtenemos una referencia a su accionador particular
      var action = this.mixer.clipAction (clip);
      
      // Añadimos el accionador al diccionario con el nombre de la animación que controla
      this.actions[clip.name] = action;
            
      // Nos vamos a quedar como animación activa la última de la lista,
      //    es irrelevante cual dejemos como activa, pero el atributo debe referenciar a alguna
      this.activeAction = action;
      
      // Metemos el nombre de la animación en la lista de nombres 
      //    para formar el listado de la interfaz de usuario
      this.clipNames.push (clip.name);
    }
    
  }
  
  createGUI (gui, str) {
    // La interfaz de usuario se crea a partir de la propia información que se ha
    // cargado desde el archivo  gltf
    this.guiControls = {
      // En este campo estará la list de animaciones del archivo
      current : 'Animaciones',
      // Este campo nos permite ver cada animación una sola vez o repetidamente
      repeat : false,
      // Velocidad de la animación
      speed : 1.0
    }
    
    // Creamos y añadimos los controles de la interfaz de usuario
    var folder = gui.addFolder (str);
    var repeatCtrl = folder.add (this.guiControls, 'repeat').name('Repetitivo: ');
    var clipCtrl = folder.add (this.guiControls, 'current').options(this.clipNames).name('Animaciones: ');
    var speedCtrl = folder.add (this.guiControls, 'speed', -2.0, 2.0, 0.1).name('Speed: ');
//     var that = this;
    // Cada vez que uno de los controles de la interfaz de usuario cambie, 
    //    llamamos al método que lance la animación elegida
    clipCtrl.onChange (() => {
      this.fadeToAction (this.guiControls.current, this.guiControls.repeat, this.guiControls.speed);
    });
    repeatCtrl.onChange (() => {
      this.fadeToAction (this.guiControls.current, this.guiControls.repeat, this.guiControls.speed);
    });
    speedCtrl.onChange ((value) => {
      this.activeAction.setEffectiveTimeScale(this.guiControls.speed);
    });
  }
  
  // ******* ******* ******* ******* ******* ******* ******* 
  
  // Método para lanzar una animación
  // Recibe:
  //  - name   : el nombre de la animación
  //  - repeat : si se desea una sola ejecución de la animación (false) o repetidamente (true)
  //  - speed  : la velocidad a la que se moverá la animación (negativo hacia atrás, 0 parado)
  fadeToAction (name, repeat, speed) {
    // referenciamos la animación antigua y la nueva actual
    var previousAction = this.activeAction;
    this.activeAction = this.actions[ name ];
    
    // La nueva animación se resetea para eliminar cualquier rastro de la última vez que se ejecutara
    this.activeAction.reset();
    // Se programa una transición entre la animación actigua y la nueva, se emplea un 10% de lo que dura la animación nueva
    this.activeAction.crossFadeFrom (previousAction, this.activeAction.time/10 )
    // Hacemos que la animación se quede en su último frame cuando acabe
    this.activeAction.clampWhenFinished = true;
    // Ajustamos su factor de tiempo, modificando ese valor se puede ajustar la velocidad de esta ejecución de la animación
    this.activeAction.setEffectiveTimeScale( speed );
    // Ajustamos su peso al máximo, ya que queremos ver la animación en su plenitud
    this.activeAction.setEffectiveWeight( 1 );
    // Se establece el número de repeticiones
    if (repeat) {
      this.activeAction.setLoop (THREE.Repeat);
    } else {
      this.activeAction.setLoop (THREE.LoopOnce);
    }
    // Una vez configurado el accionador, se lanza la animación
    this.activeAction.play();    
  }
  
  // ******* ******* ******* ******* ******* ******* ******* 
  
  update () {
    // Hay que pedirle al mixer que actualice las animaciones que controla
    var dt = this.clock.getDelta();
    if (this.mixer) this.mixer.update (dt);

    this.tornillo.update(dt);
    this.tuerca.update(dt);
    this.tronco.update(dt);
    this.trampaP.update(dt);
    this.trampaH.update(dt);
    this.trampaV.update(dt);

    TWEEN.update(dt);
  }
}

export { Bimbot };
