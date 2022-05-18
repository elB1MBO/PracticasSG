//Ahora, la escena es física y deriva de Physijs.Scene

class MyPhysiScene extends Physijs.Scene {
  constructor(myCanvas){
    //Gestor de hebras:
    Physijs.scripts.worker = './physijs/physijs_worker.js';
    //El motor de físicas de bajo nivel, en el cual se apoya Physijs
    Physijs.scripts.ammo = './ammo.js';

    //IMPORTANTE el gestor y el motor deben declararse antes de inicializar Physijs.Scene
    super();

    //Ahora, lo primero es crear el visualizador, dandole el lienzo (canvas) sobre el que renderizar
    this.createRenderer(myCanvas);

    //Establecemos un valor de la gravedad. Si es negativo, caen hacia abajo.
    this.setGravity(new THREE.Vector3(0, -9.8, 0));

    //Figuras...
    // Para almacenar las figuras que caen
    this.boxes = [];
    this.spheres = [];
    this.todos = [];
    //Raycaster...

    //Gui
    this.createGUI();

    //Construimos los elementos que tendremos en la escena:
    /**
     * IMPORTANTE: Los elementos que se desee sean tenidos en cuenta en la 
     * FISICA deben colgar DIRECTAMENTE de la escena. NO deben colgar de otros
     * nodos.
    */
    //Luces
    this.createLights();
    //Camara
    this.createCamera();
    //Suelo
    this.createGround();
    //Fondo
    this.createBackground();
    //Nuestros objetos
    this.createBoxes(MyPhysiScene.MAXBOXES);

    //Nuestro modelo
    //this.createBimbot();
    this.createCaja(); //Mi caja
    //Tiempo
    this.clock = new THREE.Clock();
  }

  createCaja(){
    var geom = new THREE.BoxGeometry(3,3,3);
    var ruta = "../imgs/textures/";
    var formato = ".jpg";
    var urls = [
      ruta + "textura-caja1_01" + formato, ruta + "textura-caja1_02" + formato, ruta + "textura-caja1_03" + formato, 
      ruta + "textura-caja1_04" + formato, ruta + "textura-caja1_05" + formato, ruta + "textura-caja1_06" + formato, 
    ];
    var textura = new THREE.CubeTextureLoader().load(urls);
    var material = new Physijs.createMaterial(textura);

    var caja = new Physijs.BoxMesh(geom, material);
    caja.position.set(5,2,2);
    this.add(caja);
  }

  createBimbot(){
    //Tenemos nuestro modelo
    this.bimbot = new Bimbot();
    var modelo = bimbot.getModelo();
    //Y obtenemos una caja englobante de nuestro modelo
    var bounding = new THREE.BoxHelper(modelo);

    //Calculamos sus dimensiones y las usamos para hacer la geometría del collider
    bounding.geometry.computeBoundingBox();
    var bb = bounding.geometry.boundingBox;
    var geomCollider = new THREE.BoxGeometry(bb.max.x-bb.min.x, bb.max.y-bb.min.y, bb.max.z-bb.min.z);

    //Creamos el material
    var material = new THREE.MeshBasicMaterial({color: 0xF1263C, opacity: 0.3});

    //Creamos el material físico
    var physiMaterial = Physijs.createMaterial(material, 0.5, 1);
    //Creamos el collider físico
    var collider = new Physijs.BoxMesh(geomCollider, physiMaterial, 1);
    
    //Con el modelo ya cargado, lo añadimos al collider
    collider.add(modelo);

    //Y colgamos el collider de la raiz
    this.add(collider)
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    this.renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    this.renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(this.renderer.domElement);
  }

  /// Método que actualiza la razón de aspecto de la cámara y el tamaño de la imagen que genera el renderer en función del tamaño que tenga la ventana
  onWindowResize () {
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  // Se procesa, o el movimiento de cámara, con Ctrl; o los impulsos a las figuras.
  onMouseDown (event) {
    if (!event.ctrlKey) {
      this.pushBox (event);
    }
  }

  onKeyDown (event) {
    var x = event.which || event.key;
    switch (x) {
      case KeyCode.KEY_CONTROL : 
        this.cameraControl.enabled = true;
    }
  }
  
  onKeyUp (event) {
    var x = event.which || event.keyCode;
    switch (x) {
      case KeyCode.KEY_CONTROL : 
        this.cameraControl.enabled = false;
    }
  }

  createBoxes(n){
    var element = null;
    for (var i = 0; i < n; i++) {
      // Una figura física se crea a partir de una geometría de THREE y un material físico. También hay que ponerle una masa a la caja.
      // Si la masa es 0, a la caja NO le afecta la gravedad.
      // Cuanto más ligera sea más se moverá en un rebote.
      // El material físico se crea a partir de un material THREE, dándole una capacidad de rozamiento y de rebote.
      if (Math.random() < MyPhysiScene.PROBBOX) { // Se crean cajas o esferas aleatoriamente
        element = new Physijs.BoxMesh (   // Caja física
          new THREE.BoxGeometry (1,1,1),   // Caja de Three
          Physijs.createMaterial (   // Material físico
            // Las figuras se crean en modo alambre, cuando colisionen con el suelo cambiarán a color sólido
            new THREE.MeshLambertMaterial ({color: 0xFFFFFF * Math.random(),  wireframe: true}),   // Material de Three
            0.1, 0.9),   // Rozamiento y rebote
          1.0   // Masa
        );
        element.scale.set(Math.random()+0.5, Math.random()+0.5, Math.random()+0.5);   // Tamaño final aleatorio
        this.boxes.push(element);      
        this.todos.push(element);
      } else {   // Con la esfera se hace lo mismo
        element = new Physijs.SphereMesh (
          new THREE.SphereGeometry (Math.random()*0.5 + 0.25),
          Physijs.createMaterial (
            new THREE.MeshLambertMaterial ({color: 0xFFFFFF * Math.random(), wireframe: true}), 
            0.5, 0.7),
          1.0
        );    
        this.spheres.push(element);
        this.todos.push(element);
      }
      // Las figuras empiezan en el aire en una posición aleatoria
      element.position.set (Math.random()*10-5, Math.random()*4+10, Math.random()*10-5);
      element.rotation.set (Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2);

      // A las figuras se le añaden un atributo  colisionable  para indicar que estas figuras son colisionables
      element.colisionable = true;
      // Las figuras con física deben estar DIRECTAMENTE colgadas en la escena.
      this.add (element);
    }
  }

  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set (20, 10, 20);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new THREE.TrackballControls (this.camera, this.renderer.domElement);
    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
    this.cameraControl.enabled = false;
  }

  createGround(){
    //Crearemos nuestro suelo:
    var geometry = new THREE.BoxGeometry(40, 0.2, 40);
    geometry.translate(0,-0.1,0);

    // El material se hará con una textura de cesped
    var texture = new THREE.TextureLoader().load('../imgs/grass1.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    //Creamos el material a partir de la textura
    var material = new THREE.MeshPhongMaterial ({map: texture});
    //Creamos el material físico, con rozamiento y rebote:
    var physiMaterial = Physijs.createMaterial(material, 0.7, 0.3);
    //Creamos el mesh físico del suelo, con masa 0 para que no caiga
    var ground = new Physijs.BoxMesh(geometry, physiMaterial, 0);

    //Añadimos un listener de colisiones al suelo
    //ground.addEventListener('collision', ...)

    //Le añadimos unas paredes al suelo:
    geometry = new THREE.BoxGeometry(40, 1, 0.2);
    geometry.translate(0,0.5,0);
    texture = new THREE.TextureLoader().load('../imgs/ladrillo-difuso.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    material = new THREE.MeshPhongMaterial({map: texture});
    physiMaterial = Physijs.createMaterial(material, 1, 1);
    //Igual que con el suelo, al crear el mesh físico de las paredes, le damos masa 0
    var physiWall = new Physijs.BoxMesh(geometry, physiMaterial, 0);

    physiWall.position.z = 20;
    this.add(physiWall);

    //Creamos la otra pared
    physiWall = new Physijs.BoxMesh(geometry, physiMaterial, 0);
    physiWall.position.z = -20;
    this.add(physiWall);

    //Creamos otra pared
    physiWall = new Physijs.BoxMesh(geometry, physiMaterial, 0);
    physiWall.position.x = -20;
    physiWall.rotation.y = Math.PI/2;
    this.add(physiWall);

    //Y por último, añadimos el suelo
    this.add(ground);
  }

  createBackground(){
    var geometry = new THREE.BoxGeometry(5, 5, 5);
    var loader = new THREE.TextureLoader();
    var materials = [
      new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes2/Sky1_01.jpg'), side: THREE.BackSide}),
      new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes2/Sky1_02.jpg'), side: THREE.BackSide}),
      new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes2/Sky1_03.jpg'), side: THREE.BackSide}),
      new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes2/Sky1_04.jpg'), side: THREE.BackSide}),
      new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes2/Sky1_05.jpg'), side: THREE.BackSide}),
      new THREE.MeshLambertMaterial({map:loader.load('../imgs/backgrounds/imagenes2/Sky1_06.jpg'), side: THREE.BackSide}),
    ];
    var material = new THREE.MeshNormalMaterial();
    var physiMaterial = Physijs.createMaterial(material, 0, 0);
    var fondo = new Physijs.BoxMesh(geometry, physiMaterial, 0);
    this.add(fondo);
  }

  createGUI () {
    // Se crea una interfaz gráfica de usuario vacia
    var gui = new dat.GUI();
  
    // Se definen los controles que se modificarán desde la GUI
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightIntensity : 0.5,
      brake : true,   // Para frenar el rodamiento de las esferas
      flipper : false,   // Para mover la bisagra manualmente
      push : 1.0,   // La fuerza de los empujones que se le dan a las figuras
      
      boxesUp : () => {
        // Para dejar caer 'de nuevo' todas las figuras
        // Se le cambia la posición a mano y se le indica al motor de física que se ha hecho ese cambio manual
        // También se les pone la velocidad lineal a 0. Si no, las figuras que se habían caído del escenario y han adquirido una velocidad debido a la gravedad, la seguirían conservando y nada más ponerlas arriba, caerían bastante rápido.
        this.todos.forEach ((element) => {
          element.position.set (Math.random()*10-5, Math.random()*4+10, Math.random()*10-5);
          element.rotation.set (Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2); 
          element.setLinearVelocity (new THREE.Vector3());
          element.__dirtyPosition = true;
          element.__dirtyRotation = true;
          element.material.wireframe = false;
        })

      }
    }

    gui.add (this.guiControls, 'boxesUp').name ('[Cajas Arriba]');
    gui.add (this.guiControls, 'brake').name ('Frenar esferas');
    gui.add (this.guiControls, 'flipper').name ('Mover bisagra')
      .onChange( (value) => {
        if (value) {
          // Movimiento manual de la bisagra
          this.constraintHinge.enableAngularMotor (10, 10);
        } else {
          // Se apaga el motor para que se mueva con gravedad y colisiones
          this.constraintHinge.disableMotor();
        }
      });
    gui.add (this.guiControls, 'push', -10, 10, 1).name ('Fuerza');
    
    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la Luz : ');    
  }

  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
    this.spotLight.position.set( 60, 60, 40 );
    this.add (this.spotLight);
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }

  setCameraAspect (ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  update () {
    // Medida del tiempo transcurrido
    var timeInSeconds = this.clock.getDelta();

    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la intensidad de la luz con lo que haya indicado el usuario en la gui
    this.spotLight.intensity = this.guiControls.lightIntensity;
    
    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
    
    // Se actualiza el resto del modelo
    /* if (this.guiControls.brake) {
      // El procesamiento del frenado de las esferas
      // Las eferas tienden a rodar infinitamente, para darles más realismo hay que ir disminuyendo su velocidad angular
      var velocity = null;
      // El frenado se consigue leyendo la velocidad angular y volviéndola a poner disminuida en un porcentaje
      var brakingForce = MyPhysiScene.BRAKE*timeInSeconds;
      if (brakingForce > 1.0) brakingForce = 1.0;
      this.spheres.forEach ((e) => {
        velocity = e.getAngularVelocity();
        e.setAngularVelocity (velocity.multiplyScalar(1-brakingForce));
      });
    } */
    
    // Se le pide al motor de física que actualice las figuras según sus leyes
    this.simulate ();
    
    // Se le pide al renderer que renderice la escena que capta una determinada cámara, que nos la proporciona la propia escena.
    this.renderer.render(this, this.getCamera());

    // Por último, se solicita que la próxima vez que haya que refrescar la ventana se ejecute una determinada función, en este caso la funcion render.
    // La propia función render es la que indica que quiere ejecutarse la proxima vez
    // Por tanto, esta instrucción es la que hace posible que la función  render  se ejecute continuamente y por tanto podamos crear imágenes que tengan en cuenta los cambios que se la hayan hecho a la escena después de un render.
    requestAnimationFrame(() => this.update());
  }

}

// Constantes que se usan en la clase
MyPhysiScene.MAXBOXES=30;
MyPhysiScene.PROBBOX=0.5;
MyPhysiScene.BRAKE=2; // La cantidad de freno

/// La función principal
$(function () {
  // Se crea la escena
  var scene = new MyPhysiScene ("#WebGL-output");
  
  // listeners
  // Cada vez que el usuario cambie el tamaño de la ventana se llama a la función que actualiza la cámara y el renderer
  window.addEventListener ("resize", () => scene.onWindowResize());
  
  // Definimos un listener para el mouse down del ratón para los impulsos a las figuras
  window.addEventListener ("mousedown", () => scene.onMouseDown(event), true);
  window.addEventListener ("keydown", (event) => scene.onKeyDown (event), true);
  window.addEventListener ("keyup", (event) => scene.onKeyUp(event), true);
  
  
  // Finalmente, realizamos el primer renderizado.
  scene.update();
});