import * as THREE from '../libs/three.module.js'
import * as KeyCode from '../libs/keycode.esm.js'
import {Bimbot} from './Bimbot.js' 
import {Objetos} from './Objetos.js'

class main extends THREE.Object3D {
  constructor(gui, titleGUI){
      super();
      this.createGUI(gui, titleGUI);

      this.clock = new THREE.Clock();

      this.velocidad = 0.2;

      //Variables para las animaciones:
      //Para ello, tengo un vector con los movimientos:
      //W A S D CLICK
      this.movimientos = [false, false, false, false, false]; 
      this.startAnimation = false; //variable que marca si una animación ya ha empezado o no
      this.currentAction = "Idle"; //Animación actual

      this.bimbot = new Bimbot();

      this.animationsMap = this.bimbot.animations; //Mapa de las animaciones del bimbot

      this.add(this.bimbot);

      for(var i = 0; i < this.bimbot.animations.length; i++){
          var clip = this.bimbot.animations[i];
          console.log(clip.name);
      }

      this.objetos = new Objetos();
      this.add(this.objetos);

      window.addEventListener("keydown", (event) => this.vidas(event));

      //this.bimbot.fadeToAction('Idle', true, 1);

      window.addEventListener("keydown", (event) => this.onKeyDown(event));
      window.addEventListener("keyup", (event) => this.onKeyUp(event));
      window.addEventListener("keypress", (event) => this.onKeyPressed(event));

      //Escuche el click izquierdo para dar un puñetazo
      //window.addEventListener("mousedown", (event) => this.onMouseDown(event));

      //Que escuche el boton de RESUME Y USAR
      document.getElementById("botonResume").addEventListener("mousedown", (event) => this.resume(event), true);
      document.getElementById("botonColecionables").addEventListener("mousedown", (event) => this.sumaVida(event), true);

      window.addEventListener("keydown", (event) => this.recogeColeccionable(event));

      //Colisiones:

      this.cajaColision1 = this.createBoxCollider();
      this.cajaColision1.position.z = 20;
      //this.colliders.add(this.cajaColision1);
      this.add(this.cajaColision1);

      //Cuando el robot llegue a esta caja, saldrá un mensaje de que tiene que volver al comienzo, pero la velocidad de las trampas habrá aumentado
      //Los coleccionables respawnarán -> en sitios aleatorios dentro del entorno?
      this.cajaFinal = this.createBoxCollider();
      this.cajaFinal.scale.x = 4;
      this.cajaFinal.position.z = 160;
      this.add(this.cajaFinal);

      //window.requestAnimationFrame(this.render);

      //para que la escena sepa cuándo tiene que actualizar la cámara
      this.gameResumed = false;

  }

  setPosicionCaja(){
      this.bimbot.collider.getWorldPosition(this.bimbot.cajaMundo);
      console.log("Después de get: "+this.bimbot.cajaMundo.x+" "+this.bimbot.cajaMundo.y+" "+this.bimbot.cajaMundo.z);        
  }

  // ******* ******* ******* COLLIDERS ******* ******* *******

  createBoxCollider(){
      var geom = new THREE.BoxGeometry(5, 5, 5);
      var material = new THREE.MeshToonMaterial({color: 0x049ef4});

      var caja = new THREE.Mesh(geom, material);
      return caja;
  }
  //Funcion que comprueba si dos boxes han colisionado
  intersectBoxes (b1, b2) {
    var vectorBetweenBoxes = new THREE.Vector2();
    vectorBetweenBoxes.subVectors (new THREE.Vector2 (b1.position.x, b1.position.z),
                                   new THREE.Vector2 (b2.position.x, b2.position.z));
    console.log("Subvector: "+vectorBetweenBoxes.length());
    return (vectorBetweenBoxes.length() < 2);
  }

  checkCollisions(){
      if(this.intersectBoxes(this.bimbot.getCollider(), this.cajaColision1)){
        console.log("Bimbot ha colisionado, pierde una vida y vuelve al inicio.");
        this.bimbot.position.x = 0;
        this.bimbot.position.z = 0;
        this.bimbot.setVidas(this.bimbot.getVidas()-1);
      }
  }

  // ******* ******* ******* RAYCAST ******* ******* *******

  /* render() {
    var raycaster = this.bimbot.getRaycaster();

    var intersects = raycaster.intersectObject(this.cajaColision1);

    intersects.material.color.set(0x981F18);

    renderer.render(this, this.getCamera());
  } */

  // ******* ******* ******* VIDA ******* ******* *******

  setMessage (str) {
    document.getElementById ("Messages").innerHTML = "<h2>"+str+"</h2>";
  }

  getBimbot(){
      return this.bimbot;
  }

  getCamera(){
      return this.camara;
  }

  vidas(event){
    var x = event.which || event.key;
    if(x === KeyCode.KEY_X && this.bimbot.getVidas()>0){
        console.log("PIERDE UNA VIDA");
        this.bimbot.setVidas(this.bimbot.getVidas()-1);
    } else if(x === KeyCode.KEY_Z){
        console.log("GANA UNA VIDA");
      this.bimbot.setVidas(this.bimbot.getVidas()+1);
    }
  }

  recogeColeccionable(event){
    var x = event.which || event.key;
    if(x === KeyCode.KEY_G){
        console.log("HA RECOGIDO UN COLECCIONABLE");
        this.bimbot.setColeccionables(this.bimbot.getColeccionables()+1);
    }
  }

  setInfoColeccionables(){
    document.getElementById("div-colecs").innerHTML = "<p id='num-colecs'>x"+this.bimbot.getColeccionables()+"</p>"
  }

  sumaVida(){
    console.log("GANA UNA VIDA, pierde un coleccionable");
    if(this.bimbot.getColeccionables()>0){
        this.bimbot.setVidas(this.bimbot.getVidas()+1);
        this.bimbot.setColeccionables(this.bimbot.getColeccionables()-1);
    }
  }

  gameOver(){
    if(this.bimbot.getVidas() === 0){
        var screen = document.getElementById("gameOverScreen");
        screen.style.display = "inline";
        //Elimina al bimbot de la escena, ya que ha muerto
        this.remove(this.bimbot);
    }
  }
  //Cuando pulsen el boton de Resume, se volverá a crear al bimbot y se quitará la pantalla de game over
  resume(event){
    if(event.button === 0){
        document.getElementById("gameOverScreen").style.display = "none";
        this.bimbot = new Bimbot();
        this.add(this.bimbot);
        this.gameResumed = true;
    }
  }

  // ******* ******* ******* ANIMACIONES ******* ******* *******

  //Click ratón:
  onMouseDown(event){
    if(event.button === 0){ //Boton izquierdo
        this.movimientos[4] = true;
        console.log("Ha pulsado el boton izqdo");
    }
  }
  onMouseUp(event){
    if(this.movimientos[4]){
        this.movimientos[4] = false;
        console.log("Ha soltado el boton izqdo");
    }
  }

  //Funcion que se activa cuando se aprieta una tecla.
  onKeyDown(event){
    var x = event.which || event.key;
    switch (x) {
        case KeyCode.KEY_W:
            //Cambia el estado de la variable corriendo a true
            this.movimientos[0] = true;
            this.startAnimation = true;
            if(this.movimientos[1]==true){ //Diagonal hacia delante-izqda
                this.bimbot.getModelo().rotation.y = Math.PI/4;
            }
            else if(this.movimientos[3]==true){ //Diagonal hacia delante-dcha
                this.bimbot.getModelo().rotation.y = -Math.PI/4;
            } else{
                this.bimbot.getModelo().rotation.y = Math.PI*2;
            }
            
            break;
        case KeyCode.KEY_A:
            this.movimientos[1] = true;
            this.startAnimation = true;
            if(this.movimientos[0]==true){ //Diagonal hacia delante-izqda
                this.bimbot.getModelo().rotation.y = Math.PI/4;
            }
            else if(this.movimientos[2]==true){ //Diagonal hacia detras-izqda
                this.bimbot.getModelo().rotation.y = Math.PI*3/4;
            } else{
                this.bimbot.getModelo().rotation.y = Math.PI/2;
            }
            break;
        case KeyCode.KEY_S:
            this.movimientos[2] = true;
            this.startAnimation = true;
            if(this.movimientos[1]==true){ //Diagonal hacia detras-izqda
                this.bimbot.getModelo().rotation.y = Math.PI*3/4;
            }
            else if(this.movimientos[3]==true){ //Diagonal hacia detras-dcha
                this.bimbot.getModelo().rotation.y = -Math.PI*3/4;
            } else{
                this.bimbot.getModelo().rotation.y = Math.PI;
            }
            break;
        case KeyCode.KEY_D:
            this.movimientos[3] = true;
            this.startAnimation = true;
            if(this.movimientos[0]==true){ //Diagonal hacia delante-dcha
                this.bimbot.getModelo().rotation.y = -Math.PI/4;
            }
            else if(this.movimientos[2]==true){ //Diagonal hacia detras-dcha
                this.bimbot.getModelo().rotation.y = -Math.PI*3/4;
            } else{
                this.bimbot.getModelo().rotation.y = -Math.PI/2;
            }
            break;  
        default:
            break;
    }
  }

  onKeyUp(event){
    var x = event.which || event.key;
    switch (x) {
        case KeyCode.KEY_W:
            //Cambia el estado de la variable corriendo a false
            this.movimientos[0] = false;
            this.idle = true;
            break;
        case KeyCode.KEY_A:
            this.movimientos[1] = false;
            this.idle = true;
            break;
        case KeyCode.KEY_S:
            this.movimientos[2] = false;
            this.idle = true;
            break;
        case KeyCode.KEY_D:
            this.movimientos[3] = false;
            this.idle = true;
            break;
        }
    this.bimbot.fadeToAction('Idle', true, 1);
  }

  onKeyPressed(event){
      var x = event.which || event.key;
      switch(x){
          case KeyCode.KEY_SPACE:
            this.bimbot.fadeToAction('Jump', false, 1);
            break;
          case KeyCode.KEY_Q:
            this.bimbot.fadeToAction("Wave", false, 0.6);
            break;
      }
  }

  createGUI (gui, str) {

    this.guiControls = {
    }
    var folder = gui.addFolder (str);
  }

  update(){
    var dt = this.clock.getDelta();
    if (this.mixer) this.mixer.update (dt);

    this.bimbot.update();
    this.objetos.update();

    //this.render();
    var vector = new THREE.Vector3(this.bimbot.position.x, this.bimbot.position.y, this.bimbot.position.z);
    this.bimbot.cajaMundo = vector;

    this.setPosicionCaja();

    this.setInfoColeccionables();

    //COLISIONES
    this.checkCollisions();


    //Vamos actualizando el mensaje de las vidas del robot
    this.setMessage("Vidas: "+this.bimbot.getVidas());
    //Funcion que comprueba si ha llegado a 0 vidas
    this.gameOver();

    /* if(this.idle==true){
        this.bimbot.fadeToAction('Idle', true, 1);
    } */

    //console.log("Estado: " + this.movimientos);
    //Hacia delante

    if(this.movimientos[0] === true){
        this.bimbot.position.z += this.velocidad;
        if(this.startAnimation && this.currentAction != "Running"){
            this.bimbot.fadeToAction("Running", true, 1);
            this.startAnimation = false;
        }
    }
    //Izquierda
    if(this.movimientos[1] === true){
        this.bimbot.position.x += this.velocidad;
        if(this.startAnimation && this.currentAction != "Running"){
            this.bimbot.fadeToAction("Running", true, 1);
            this.startAnimation = false;
        }
    }
    //Atras
    if(this.movimientos[2] === true){
        this.bimbot.position.z -= this.velocidad;
        if(this.startAnimation && this.currentAction != "Running"){
            this.bimbot.fadeToAction("Running", true, 1);
            this.startAnimation = false;
        }
    }
    //Derecha
    if(this.movimientos[3] === true){
        this.bimbot.position.x -= this.velocidad;
        if(this.startAnimation && this.currentAction != "Running"){
            this.bimbot.fadeToAction("Running", true, 1);
            this.startAnimation = false;
        }
    }

    //Boton izqdo raton
    if(this.movimientos[4] === true){
        if(this.startAnimation && this.currentAction != "Running"){
            this.bimbot.fadeToAction("Punch", false, 1);
            this.startAnimation = false;
        }
    }

  }

}

export { main };
