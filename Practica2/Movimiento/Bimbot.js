import * as THREE from '../libs/three.module.js'
import { GLTFLoader } from '../libs/GLTFLoader.js'
import * as TWEEN from '../libs/tween.esm.js'
import { Tornillo } from '../MisModelos/Tornillo.js'
import { Tuerca } from '../MisModelos/Tuerca.js'
import { Tronco } from '../MisModelos/Tronco.js'
import { TrampaPinchos } from '../MisModelos/TrampaPinchos.js'
import { Caja } from '../MisModelos/Caja.js'

 
class Bimbot extends THREE.Object3D {
  constructor() {
    super();
    this.clock = new THREE.Clock();
    var that = this;
    var loader = new GLTFLoader();
    loader.load( '../models/gltf/robot.glb', ( gltf ) => {
      // El modelo está en el atributo  scene
      this.model = gltf.scene;
      // Y las animaciones en el atributo  animations
      this.animations = gltf.animations;
      // No olvidarse de colgar el modelo del Object3D de esta instancia de la clase (this)
      that.add( this.model );
      console.log (this.animations);
      that.createActions(this.model, this.animations);
      // Se crea la interfaz de usuario que nos permite ver las animaciones que tiene el modelo y qué realizan
      //that.createGUI (gui, str);
    }, undefined, ( e ) => { console.error( e ); }
    );

    //Establecemos los colliders del bimbot
    this.colliders = this.setColliders(); 
    this.add(this.colliders);

    //Raycaster
    this.raycaster = new THREE.Raycaster(this.position, this.position.z+1); //Mirando al eje z 
    this.add(this.raycaster);

    //El bimbot tendra X vidas:
    this.vidas = 3;
    //Y empieza con 0 coleccionables:
    this.coleccionables = 2;
    //Creamos la camara y la añadimos a this
    this.camara = this.createCamera();
    this.add(this.camara);
  }

  // ******* ******* ******* GETTERS Y SETTERS ******* ******* *******

  getRaycaster(){
    return this.raycaster;
  }

  getModelo(){
    return this.model;
  }

  setVidas(x){
    this.vidas = x;
  }
  getVidas(){
    return this.vidas;
  }

  getColeccionables(){
    return this.coleccionables;
  }
  setColeccionables(x){
    this.coleccionables = x;
  }

  getColliders(){
    return this.colliders;
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

  //*********************CAMARA******************* */

  createCamera () {
    //Indicamos el modelo que debe seguir:
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    camera.position.set(this.position.x, this.position.y+15, this.position.z-20);
    // Y hacia dónde mira
    camera.lookAt(this.position);
    return camera;

  }

  getCamera(){
    return this.camara;
  }
  
  // ******* ******* ******* COLISIONES ******* ******* ******* 

  setColliders(){
    var boxBB = this.createBB();
    return boxBB;
  }


  //Crea la Bounding Box
  createBB(){
    /* //Hay que declarar los vectores min y max del Box3
    var min = new THREE.Vector3(2, 2, 2);
    var max = new THREE.Vector3(3, 3, 3);
    //Así tenemos una caja de 1x1x1
    var box = new THREE.Box3(min, max);
    return box; */

    var geom = new THREE.BoxGeometry(2, 8, 2);
    var material = new THREE.MeshToonMaterial(0x3492);

    var boxBB = new THREE.Mesh(geom, material);
    return boxBB;
  }

  // ******* ******* ******* ******* ******* ******* ******* 

  update () {
    // Hay que pedirle al mixer que actualice las animaciones que controla
    var dt = this.clock.getDelta();
    if (this.mixer) this.mixer.update (dt);

    TWEEN.update(dt);
  }
}

export { Bimbot };
