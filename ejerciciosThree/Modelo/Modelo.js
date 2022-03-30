import * as THREE from "../libs/three.module.js"
import {MTLLoader} from "../libs/MTLLoader.js"
import {GLTFLoader} from "../libs/GLTFLoader.js"
import { OBJLoader } from "../libs/OBJLoader.js"

class Modelo extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();
        
        //this.createGUI(gui, titleGUI);

        var materialLoader = new MTLLoader();
        var objectLoader = new OBJLoader();

        materialLoader.load ('../models/porsche911/911.mtl',
            (materials) => {
                objectLoader.setMaterials(materials);
                objectLoader.load('../models/porsche911/Porsche_911_GT2.obj', 
                (object) => {
                    this.add(object);
                }, null, null);
            });

        var robotLoader = new GLTFLoader();
        robotLoader.load('../models/gltf/robot.glb', (gltf) => {
            //El modelo está en el atributo scene
            this.model = gltf.scene;
            //Y las animaciones en el atributo animations
            var animations = gltf.animations;
            //Añadir el modelo
            this.model.position.x = -5;
            this.model.position.z = -5;
            this.add(this.model);
            
            //Se llama al método que crea el AnimationMixer y el diccionario de AnimationAction
            this.createActions (this.model, animations);
            //Se llama el método que crea la interfaz de usuario
            this.createGUI(gui, titleGUI);

        }, undefined, (e) => {console.error(e);}
        );

    }

    createActions(model, animations){
        //Se crea un mixer para este modelo
        this.mixer = new THREE.AnimationMixer (model);

        //Se crea el diccionario de AnimationAction 
        this.actions = {};
        this.clipNames = [];

        for(var i = 0; i < animations.length; i++){
            //Se toma una animacion de AnimationAction y el array de nombres
            var clip = animations[i];

            //Se incorpora el clip al mixer y obtenenmos su AnimationAction
            var action = this.mixer.clipAction (clip);
            //Se añade el AnimationAction al diccionario con su nombre
            this.actions[clip.name] = action;
            //Se añade el nombre a la lista de nombres, para la interfaz
            this.clipNames.push(clip.name);
        }
    }

    //Metodo que lanza la animacion
    fadeToAction(name, repeat){
        //Referenciamos la animación antigua y la actual
        var previousAction = this.activeAction;
        this.activeAction = this.actions[name];

        //Reseteamos la animación anterior, y borramos cualquier rastro de la ejec anterior
        this.activeAction.reset();
        //La nueva animacion comenzara mientras la otra se para
        //Se emplea un 10% del tiempo en la transicion
        //this.activeAction.crossFadeFrom(previousAction, this.activeAction.time/10);
        //Hacemos que la animacion se quede en su ultimo frame cuando se acabe
        this.activeAction.clampWhenFinished = true;
        //Ajustamos su peso al máximo, ya que queremos ver la animacion completa
        this.activeAction.setEfectiveWeight(1);
        //Se establece el numero de repeticiones
        if(repeat){
            this.activeAction.setLoop(THREE.Repeat);
        } else {
            this.activeAction.setLoop(THREE.LoopOnce);
        }
        //Una vez configurado el accionador, se lanza la animacion
        this.activeAction.play();
    }

    //Inputs -----> diap 7, ordenes mediante teclado
    /**
     * Eventos? con addEventListener()
     * ej: window.addEventListener("resize", () => scene.onWindowResize());
     *  keydown: cuando se pulsa
     *  keyup: cuando sueltas una tecla
     *  keypressed: se lanza el evento cuando lo pulsas y sueltas
     *  Si quieres poder pulsar 2 teclas a la vez, no sirve el keypressed
     * 
     *  Mediante import * as KeyCode from 'keycode.esm.js' para saber si se ha pulsado una tecla no imprimible
     * ej: if(x == KeyCode.KEY_CONTROL)
     * caracter imprimible -> if(String.fromCharCode (x) == "A")
     * 
     * Eventos de raton:
     * mousedwon, mouseup, mousemove, wheel
     * 
     * Se compruba el estado de los eventos con estados:
     * MyScene.NO_ACTION=0, 
     * MyScene.MOVING=1, etc.
     * 
     * Picking:
     * pickableObjects es el array de objetos donde se van a buscar intersecciones con el rayo
     * 
     * Pick devuelve el Mesh completo que he clickado, pero si queremos la clase que representa la figura completa,
     * lo que haremos será:
     * Desde cada mesh, pondremos una referencia a la raíz, sin importar su profundidad,
     * para poder acceder a la clase sin importar el Mesh clickado
     * EJEMPLO: tengo la clase Darth vader, con varios Mesh, como la espada, cabeza...
     * cada Mesh apunta a DarthVader
     * Esto es con: 
     * class DarthVader ...{
     *  constructor(){
     *      this.cabeza = new THREE.Mesh(...);
     *      this.cabeza.userData = this;
     *  }
     *  caminar(){}
     * }
     * Entonces al hacer click:
     *  var meshClickado = pickedObjects [0].object;
     *  meshClickado.userData.caminar();
     * 
     * Feedback: añadir una transparencia al objeto seleccionado, por ejemplo
     * 
     */


    createGUI(gui, titleGUI){
        this.guiControls = {
            //Lista de desplegables de animaciones del archivo
            current : 'Animaciones',
            //Para ver una animacion solo una vez o repetidamente
            repeat : false
        }
        //Creamos y añadimos los controles de la interfaz de usuario
        var folder = gui.addFolder(titleGUI);
        var repeatCtrl = folder.add(this.guiControls, 'repeat')
            .name('Repetitivo: ');
        var clipCtrl = folder.add(this.guiControls, 'current')
            .options(this.clipNames).name('Animaciones: ');

        //Cada vez que uno de los controles de la interfaz de usuario cambie, llamamos al método que lance la animación elegida
        clipCtrl.onChange(() => {
            this.fadeToAction (this.guiControls.current, this.guiControls.repeat);
        });
        repeatCtrl.onChange(() => {
            this.fadeToAction (this.guiControls.current, this.guiControls.repeat);
        });
    }

    update(){}
}

export {Modelo}