import * as THREE from '../libs/three.module.js'
import { GLTFLoader } from '../libs/GLTFLoader.js'
import * as TWEEN from '../libs/tween.esm.js'
import * as KeyCode from '../libs/keycode.esm.js'
import {Bimbot} from './Bimbot.js' 

class main extends THREE.Object3D {
  constructor(gui, titleGUI){
      super();
      this.createGUI(gui, titleGUI);

    this.clock = new THREE.Clock();

      this.bimbot = new Bimbot();
      this.add(this.bimbot);

      for(var i = 0; i < this.bimbot.animations.length; i++){
          var clip = this.bimbot.animations[i];
          console.log(clip.name);
      }

      //this.bimbot.fadeToAction('Idle', true, 1);

      window.addEventListener("keydown", (event) => this.onKeyDown(event));
      window.addEventListener("keyup", (event) => this.onKeyUp(event));
      window.addEventListener("keypress", (event) => this.onKeyPressed(event));
  }

  getBimbot(){
      return this.bimbot;
  }

  //Funcion que se activa cuando se aprieta una tecla.
  onKeyDown(event){
    var x = event.which || event.key;
    switch (x) {
        case KeyCode.KEY_W:
            this.bimbot.rotation.y = Math.PI*2;
            this.bimbot.position.z += 0.5;
            this.bimbot.fadeToAction("Running", true, 1);
            break;
        case KeyCode.KEY_A:
            this.bimbot.rotation.y = Math.PI/2;
            this.bimbot.position.x += 0.5;
            this.bimbot.fadeToAction("Running", true, 1);
            break;
        case KeyCode.KEY_S:
            this.bimbot.rotation.y = Math.PI;
            this.bimbot.position.z -= 0.2;
            this.bimbot.fadeToAction("Walking", true, 1);
            break;
        case KeyCode.KEY_D:
            this.bimbot.rotation.y = -Math.PI/2;
            this.bimbot.position.x -= 0.5;
            this.bimbot.fadeToAction("Running", true, 1);
            break;  
        /* case KeyCode.KEY_SPACE:
            this.bimbot.position.y += 0.5;
            this.bimbot.fadeToAction("Jump", true, 0.8);
            break; */  
        /* case KeyCode.KEY_SHIFT:
            this.bimbot.fadeToAction("Wave", false, 0.6);
            break; */
        default:
            break;
    }
  }

  onKeyUp(event){
    this.bimbot.fadeToAction('Idle', true, 1);
  }

  onKeyPressed(event){
      var x = event.which || event.key;
      switch(x){
          case KeyCode.KEY_SPACE:
            this.bimbot.fadeToAction('Jump', false, 1);
            this.bimbot.position.y += 1;
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
    
    //var camera = this.scene.getCamera();
    //camera.position.set(this.bimbot.position.x, this.bimbot.position.y+10, this.bimbot.position.z-20);

  }

}



/* 
class CharacterController {
    constructor(){
        this.input = new CharacterControllerInput();
        this.stateMachine = new FiniteStateMachine(new CharacterControllerInput);

        this.LoadModels();
    }
}

//Clase para controlar el movimiento del robot
class CharacterControllerInput {
    constructor(){
        this.init();
    }

    init(){
        this._keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
        };
        window.addEventListener('keydown', (event) => this.onKeyDown(event), false);
        window.addEventListener('keyup', (event) => this.onKeyUp(event), false);

    }
    onKeyDown(event) {
        switch (event.keyCode) {
            case 87: //w
                this._keys.forward = true;
                break;
            case 65: //a
                this._keys.left = true;
            case 83: //s
                this._keys.backward = true;
            case 68: //d
                this._keys.right = true;
            case 32: //space
                this._keys.space = true;
            case 16: //shift
                this._keys.shift = true;
            default:
                break;
          }
      }
    
      onKeyUp(event) {
        switch (event.keyCode) {
            case 87: //w
                this._keys.forward = false;
                break;
            case 65: //a
                this._keys.left = false;
            case 83: //s
                this._keys.backward = false;
            case 68: //d
                this._keys.right = false;
            case 32: //space
                this._keys.space = false;
            case 16: //shift
                this._keys.shift = false;
            default:
                break;
          }
      }
}

//Para las transiciones entre animaciones
class FiniteStateMachine {
    constructor(){
        this.states = {};
        this.currentState = null;
    }

    addState(name, type) {
        this.states[name] = type;
    }

    setState(name) {
        const previousState = this.currentState;

        if(previousState) {
            if(previousState.Name == name){
                return;
            }
            previousState.Exit();
        }

        const state = new this.states[name](this);

        this.currentState = state;
        state.Enter(previousState);
    }

    update(time, input){
        if(this.currentState){
            this.currentState.update(time, input);
        }
    }
}
//Clase hija de la Maquina finita de estados que añadira los estados
class CharacterFSM extends FiniteStateMachine {
    constructor(proxy){
        super();
        this.proxy = proxy;
        this.init();
    }

    init(){
        this.addState('idle', IdleState);
        this.addState('run', RunState);
        this.addState('jump', JumpState);
        this.addState('wave', WaveState);
    }
}

//Ahora definimos los estados:
class IdleState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name(){
        return 'idle';
    }

    Enter(previousState){
        const idleAction = this.parent.proxy.animations['idle'].action;
        if(previousState){
            const previousAction = this.parent.proxy.animations[previousState.Name].action;
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(previousAction, 0.5, true);
            idleAction.play();
        } else {
            idleAction.play();
        }
    }

    Exit(){}

    update(time, input){
        if(input.move.forward || input.move.backward) {
            this.parent.setState('run');
        } else if(input.move.space){
            this.parent.setState('jump');
        }
    }
}

class RunState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name(){
        return 'run';
    }

    Enter(previousState){
        const currentAction = this.parent.proxy.animations['run'].action;
        if(previousState){
            const previousAction = this.parent.proxy.animations[previousState.Name].action;
            
            currentAction.time = 0.0;
            currentAction.enabled = true;
            currentAction.setEffectiveTimeScale(1.0);
            currentAction.setEffectiveWeight(1.0);
            currentAction.crossFadeFrom(previousAction, 0.5, true);
            currentAction.play();
        } else {
            currentAction.play();
        }
    }

    Exit(){}

    update(time, input){
        if(input.move.forward || input.move.backward) {
            return;
        } else if(input.move.space){
            this.parent.setState('jump');
        }

        this.parent.setState('idle');
    }
}

class JumpState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name(){
        return 'jump';
    }

    Enter(previousState){
        const currentAction = this.parent.proxy.animations['jump'].action;
        const mixer = currentAction.getMixer();
        mixer.addEventListener('finished', this.FinishedCallback);

        if(previousState){
            const previousAction = this.parent.proxy.animations[previousState.Name].action;
            
            currentAction.reset();
            currentAction.setLoop(THREE.LoopOnce, 1);
            currentAction.clampWhenFinished = true;
            currentAction.crossFadeFrom(previousAction, 0.5, true);
            currentAction.play();
        } else {
            currentAction.play();
        }
    }

    Finished(){
        this.CleanUp();
        const previousAction = this.parent.proxy.animations[previousState.Name].action;
        this.parent.setState(previousAction);
    }
    CleanUp(){
        const action = this.parent.proxy.animations['jump'].action;
        action.getMixer().removeEventListener('finished', this.CleanupCallback);
    }

    Exit(){
        this.CleanUp();
    }

    update(time, input){
        
    }
} */

export { main };
