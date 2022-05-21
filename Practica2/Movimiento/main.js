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

      window.addEventListener("keydown", (event) => this.vidas(event));

      //this.bimbot.fadeToAction('Idle', true, 1);

      window.addEventListener("keydown", (event) => this.onKeyDown(event));
      window.addEventListener("keyup", (event) => this.onKeyUp(event));
      window.addEventListener("keypress", (event) => this.onKeyPressed(event));
  }

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

  gameOver(){
      if(this.bimbot.getVidas() === 0){
        var screen = document.getElementById("gameOverScreen");
        screen.style.display = "block";
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

    //Vamos actualizando el mensaje de las vidas del robot
    this.setMessage("Vidas: "+this.bimbot.getVidas());
    //Funcion que comprueba si ha llegado a 0 vidas
    this.gameOver();

    /* if(this.idle==true){
        this.bimbot.fadeToAction('Idle', true, 1);
    } */

    //console.log("Estado: " + this.movimientos);
    //Hacia delante

    if(this.movimientos[0] == true){
        this.bimbot.position.z += this.velocidad;
        if(this.startAnimation){
            this.bimbot.fadeToAction("Running", true, 1);
            this.startAnimation = false;
        }
    }
    //Izquierda
    if(this.movimientos[1] == true){
        this.bimbot.position.x += this.velocidad;
        if(this.startAnimation){
            this.bimbot.fadeToAction("Running", true, 1);
            this.startAnimation = false;
        }
    }
    //Atras
    if(this.movimientos[2] == true){
        this.bimbot.position.z -= this.velocidad;
        if(this.startAnimation){
            this.bimbot.fadeToAction("Running", true, 1);
            this.startAnimation = false;
        }
    }
    //Derecha
    if(this.movimientos[3] == true){
        this.bimbot.position.x -= this.velocidad;
        if(this.startAnimation){
            this.bimbot.fadeToAction("Running", true, 1);
            this.startAnimation = false;
        }
    }

  }

}

export { main };
