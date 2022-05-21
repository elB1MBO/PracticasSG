import * as THREE from '../libs/three.module.js'
import { GLTFLoader } from '../libs/GLTFLoader.js'
import * as TWEEN from '../libs/tween.esm.js'
import * as KeyCode from '../libs/keycode.esm.js'
import {Bimbot} from './Bimbot.js' 
import {Objetos} from './Objetos.js'

class main extends THREE.Object3D {
  constructor(gui, titleGUI){
      super();
      this.createGUI(gui, titleGUI);

      this.clock = new THREE.Clock();

      //Variables para las animaciones:
      //Para ello, tengo un vector con los movimientos:
      //W A S D SPACE
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

      //this.bimbot.fadeToAction('Idle', true, 1);

      window.addEventListener("keydown", (event) => this.onKeyDown(event));
      window.addEventListener("keyup", (event) => this.onKeyUp(event));
      window.addEventListener("keypress", (event) => this.onKeyPressed(event));
  }

  

  getBimbot(){
      return this.bimbot;
  }

  getCamera(){
      return this.camara;
  }

  //Funcion que se activa cuando se aprieta una tecla.
  onKeyDown(event){
    var x = event.which || event.key;
    switch (x) {
        case KeyCode.KEY_W:
            //Cambia el estado de la variable corriendo a true
            this.movimientos[0] = true;
            this.startAnimation = true;
            this.bimbot.getModelo().rotation.y = Math.PI*2;
            break;
        case KeyCode.KEY_A:
            this.movimientos[1] = true;
            this.startAnimation = true;
            this.bimbot.getModelo().rotation.y = Math.PI/2;
            break;
        case KeyCode.KEY_S:
            this.movimientos[2] = true;
            this.startAnimation = true;
            this.bimbot.getModelo().rotation.y = Math.PI;
            break;
        case KeyCode.KEY_D:
            this.movimientos[3] = true;
            this.startAnimation = true;
            this.bimbot.getModelo().rotation.y = -Math.PI/2;
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
            //this.bimbot.position.y += 1;
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


    /* if(this.idle==true){
        this.bimbot.fadeToAction('Idle', true, 1);
    } */

    //console.log("Estado: " + this.movimientos);
    //Hacia delante

    var play = "";

    if(this.movimientos[0] == true){
        console.log("Ha pulsado la W");
        this.bimbot.position.z += 0.3;
        if(this.startAnimation){
            //this.bimbot.fadeToAction("Running", true, 1);
            play="Running";
            this.startAnimation = false;
        }
    } else {
        console.log("Ha soltado la W");
    }
    //Izquierda
    if(this.movimientos[1] == true){
        console.log("Ha pulsado la A");
        this.bimbot.position.x += 0.3;
        if(this.startAnimation){
            //this.bimbot.fadeToAction("Running", true, 1);
            play="Running";
            this.startAnimation = false;
        }
    } else {
        console.log("Ha soltado la A");
    }
    //Atras
    if(this.movimientos[2] == true){
        console.log("Ha pulsado la S");
        this.bimbot.position.z -= 0.3;
        if(this.startAnimation){
            //this.bimbot.fadeToAction("Running", true, 1);
            play="Running";
            this.startAnimation = false;
        }
    } else {
        console.log("Ha soltado la S");
    }
    //Derecha
    if(this.movimientos[3] == true){
        console.log("Ha pulsado la D");
        this.bimbot.position.x -= 0.3;
        if(this.startAnimation){
            //this.bimbot.fadeToAction("Running", true, 1);
            play="Running";
            this.startAnimation = false;
        }
    } else {
        console.log("Ha soltado la D");
    }

    if(this.currentAction != play){
        const toPlay = this.bimbot.animations.get(play);
        const current = this.bimbot.animations.get(this.currentAction);

        console.log("Accion anterior:" + current + " Accion a ejecutar: "+toPlay);
        current.fadeOut(1);
        toPlay.reset().fadeIn(1).play();
    }
/* 
    switch (this.movimientos) {
        case this.movimientos[0] == true:
            console.log("Estado: " + this.movimientos[0]);
            this.bimbot.position.z += 0.5;
            this.bimbot.fadeToAction("Running", true, 1);
            break;
        case this.movimientos[1]:
            this.bimbot.position.x += 0.5;
            this.bimbot.fadeToAction("Running", true, 1);
            break;
        case this.movimientos[2]:
            this.bimbot.position.z -= 0.5;
            this.bimbot.fadeToAction("Running", true, 1);
            break;
        case this.movimientos[3]:
            this.bimbot.position.x -= 0.5;
            this.bimbot.fadeToAction("Running", true, 1);
            break;
        case this.movimientos[4]:
            
            break;

        default:
            break;
    } */

    //console.log("Estados 2: " + this.movimientos);

    //var camera = this.scene.getCamera();
    //this.camara.position.set(this.bimbot.position.x, this.bimbot.position.y+10, this.bimbot.position.z-20);

  }

}

export { main };
