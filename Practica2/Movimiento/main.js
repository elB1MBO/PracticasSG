import * as THREE from '../libs/three.module.js'
import * as KeyCode from '../libs/keycode.esm.js'
import { Bimbot } from './Bimbot.js'
import { Objetos } from './Objetos.js'

class main extends THREE.Object3D {
    constructor(gui, titleGUI) {
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

        //Checkpoint
        this.checkpoint = new THREE.Vector3(0,0,0);
        //Bool que indica si ha llegado al final del mapa, que sabe para saber que tiene que volver al inicio
        this.final = false;

        this.bimbot = new Bimbot();
        /* this.bimbot.traverseVisible((nodo) => {
            nodo.castShadow = true;
            nodo.receiveShadow = true;
        }); */
        this.boxHelper = new THREE.Box3Helper(this.bimbot.getBBox(), 0xffff00);
        this.add(this.boxHelper);

        this.animationsMap = this.bimbot.animations; //Mapa de las animaciones del bimbot
        this.bimbot.position.z = 150;
        this.add(this.bimbot);

        for (var i = 0; i < this.bimbot.animations.length; i++) {
            var clip = this.bimbot.animations[i];
            console.log(clip.name);
        }

        this.objetos = new Objetos();
        this.add(this.objetos);

        //Colisiones:

        this.cajas = this.objetos.getCajas();
        this.coleccionables = this.objetos.getColeccionables();
        this.trampas = this.objetos.getTrampas();

        //Cuando el robot llegue a esta caja, saldrá un mensaje de que tiene que volver al comienzo, pero la velocidad de las trampas habrá aumentado
        this.end = this.createEnd();
        this.endBox = new THREE.Box3();
        //this.endBox.copy(this.end.geometry.boundingBox).applyMatrix4(this.end.matrixWorld);
        var endHelper = new THREE.Box3Helper(this.endBox, 0xABCDEF);
        this.add(endHelper);
        this.add(this.end);

        //Defino los limites en los que puede moverse por el mapa
        this.limiteZ = 170;
        this.limiteZN = -15;
        this.limiteX = 8;
        this.limiteXN = -8;

        //para que la escena sepa cuándo tiene que actualizar la cámara
        this.gameResumed = false;

        //****** LISTENERS ********/

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

        window.addEventListener("keydown", (event) => this.keyColeccionable(event));

    }

    // ******* ******* ******* POINTS ******* ******* *******

    createEnd() {
        var geom = new THREE.BoxGeometry(5, 5, 5);
        var material = new THREE.MeshToonMaterial({ visible: false });

        var caja = new THREE.Mesh(geom, material);
        caja.position.y = 2.5;
        caja.position.z = 160;
        caja.geometry.computeBoundingBox();
        return caja;
    }

    reachEnd(){
        if(this.endBox.containsBox(this.bimbot.getBBox())){
            console.log("Ha llegado al final");
            this.checkpoint.z = this.end.position.z;
            console.log(this.checkpoint);
            //Mueve el punto final al comienzo del mapa
            if(this.final){
                this.end.position.y = -10;
                this.victoria();
            }else{
                this.final = true;
            }
            this.end.position.z = 0;
        }
    }

    victoria(){
        alert("¡HAS GANADO!");
    }

    // ******* ******* ******* COLLIDERS ******* ******* *******

    //Funcion que comprueba si dos boxes han colisionado
    intersectBoxes(b1, b2) {
        var vectorBetweenBoxes = new THREE.Vector2();
        vectorBetweenBoxes.subVectors(new THREE.Vector2(b1.position.x, b1.position.z),
            new THREE.Vector2(b2.position.x, b2.position.z));
        return (vectorBetweenBoxes.length() < 2);
    }

    checkCollisions(objeto) {
        if(objeto.getBBox().intersectsBox(this.bimbot.getBBox())){
            console.log("Bimbot ha colisionado, pierde una vida y vuelve al checkpoint.");
            //this.bimbot.position = this.checkpoint;
            console.log(this.checkpoint);
            this.bimbot.position.x = this.checkpoint.x;
            this.bimbot.position.y = this.checkpoint.y;
            this.bimbot.position.z = this.checkpoint.z;
            this.hit(); //pierde una vida
        }
    }
    checkCollisionsCaja(objeto) {
        if (objeto.getBBox().intersectsBox(this.bimbot.getBBox())) {
            console.log("Choca con una caja");
        }
    }

    checkCollisionsColeccionables(objeto) {
        if (objeto.getBBox().intersectsBox(this.bimbot.getBBox())) {
            console.log("Bimbot ha encontrado un coleccionable, lo recoge.");
            this.objetos.remove(objeto);
            this.recogeColeccionable();
            return true;
        }
        return false;
    }

    

    // ******* ******* ******* VIDA ******* ******* *******

    setMessage(str) {
        document.getElementById("Messages").innerHTML = "<h2>" + str + "</h2>";
    }

    getBimbot() {
        return this.bimbot;
    }

    getCamera() {
        return this.camara;
    }
    
    hit(){ //Funcion que se llama cuando el bimbot recibe daño
        this.bimbot.setVidas(this.bimbot.getVidas()-1);
    }

    vidas(event) {
        var x = event.which || event.key;
        if (x === KeyCode.KEY_X && this.bimbot.getVidas() > 0) {
            console.log("PIERDE UNA VIDA");
            this.bimbot.setVidas(this.bimbot.getVidas() - 1);
        } else if (x === KeyCode.KEY_Z) {
            console.log("GANA UNA VIDA");
            this.bimbot.setVidas(this.bimbot.getVidas() + 1);
        }
    }

    recogeColeccionable() {
        console.log("HA RECOGIDO UN COLECCIONABLE");
        this.bimbot.setColeccionables(this.bimbot.getColeccionables() + 1);
    }

    keyColeccionable(event) {
        var x = event.which || event.key;
        if (x === KeyCode.KEY_G) {
            this.recogeColeccionable();
        }
    }

    setInfoColeccionables() {
        document.getElementById("div-colecs").innerHTML = "<p id='num-colecs'>x" + this.bimbot.getColeccionables() + "</p>"
    }

    sumaVida() {
        console.log("GANA UNA VIDA, pierde un coleccionable");
        if (this.bimbot.getColeccionables() > 0) {
            this.bimbot.setVidas(this.bimbot.getVidas() + 1);
            this.bimbot.setColeccionables(this.bimbot.getColeccionables() - 1);
        }
    }

    gameOver() {
        if (this.bimbot.getVidas() === 0) {
            var screen = document.getElementById("gameOverScreen");
            screen.style.display = "inline";
            //Elimina al bimbot de la escena, ya que ha muerto
            this.remove(this.bimbot);
            this.remove(this.boxHelper);
        }
    }
    //Cuando pulsen el boton de Resume, se volverá a crear al bimbot y se quitará la pantalla de game over
    resume(event) {
        if (event.button === 0) {
            document.getElementById("gameOverScreen").style.display = "none";
            this.bimbot = new Bimbot();
            this.add(this.bimbot);
            this.gameResumed = true;
            this.boxHelper = new THREE.Box3Helper(this.bimbot.getBBox(), 0xffff00);
            this.add(this.boxHelper);
            //Resetea los coleccionables borrando lo restantes y creandolos todos de nuevo
            for (var i = 0; i < this.coleccionables.length; i++) {
                this.objetos.remove(this.coleccionables[i]);
            }
            this.objetos.createCollectables();
        }
    }

    // ******* ******* ******* ANIMACIONES ******* ******* *******

    //Click ratón:
    onMouseDown(event) {
        if (event.button === 0) { //Boton izquierdo
            this.movimientos[4] = true;
            console.log("Ha pulsado el boton izqdo");
        }
    }
    onMouseUp(event) {
        if (this.movimientos[4]) {
            this.movimientos[4] = false;
            console.log("Ha soltado el boton izqdo");
        }
    }

    //Funcion que se activa cuando se aprieta una tecla.
    onKeyDown(event) {
        var x = event.which || event.key;
        switch (x) {
            case KeyCode.KEY_W:
                //Cambia el estado de la variable corriendo a true
                this.movimientos[0] = true;
                this.startAnimation = true;
                if (this.movimientos[1] == true) { //Diagonal hacia delante-izqda
                    this.bimbot.getModelo().rotation.y = Math.PI / 4;
                }
                else if (this.movimientos[3] == true) { //Diagonal hacia delante-dcha
                    this.bimbot.getModelo().rotation.y = -Math.PI / 4;
                } else {
                    this.bimbot.getModelo().rotation.y = Math.PI * 2;
                }

                break;
            case KeyCode.KEY_A:
                this.movimientos[1] = true;
                this.startAnimation = true;
                if (this.movimientos[0] == true) { //Diagonal hacia delante-izqda
                    this.bimbot.getModelo().rotation.y = Math.PI / 4;
                }
                else if (this.movimientos[2] == true) { //Diagonal hacia detras-izqda
                    this.bimbot.getModelo().rotation.y = Math.PI * 3 / 4;
                } else {
                    this.bimbot.getModelo().rotation.y = Math.PI / 2;
                }
                break;
            case KeyCode.KEY_S:
                this.movimientos[2] = true;
                this.startAnimation = true;
                if (this.movimientos[1] == true) { //Diagonal hacia detras-izqda
                    this.bimbot.getModelo().rotation.y = Math.PI * 3 / 4;
                }
                else if (this.movimientos[3] == true) { //Diagonal hacia detras-dcha
                    this.bimbot.getModelo().rotation.y = -Math.PI * 3 / 4;
                } else {
                    this.bimbot.getModelo().rotation.y = Math.PI;
                }
                break;
            case KeyCode.KEY_D:
                this.movimientos[3] = true;
                this.startAnimation = true;
                if (this.movimientos[0] == true) { //Diagonal hacia delante-dcha
                    this.bimbot.getModelo().rotation.y = -Math.PI / 4;
                }
                else if (this.movimientos[2] == true) { //Diagonal hacia detras-dcha
                    this.bimbot.getModelo().rotation.y = -Math.PI * 3 / 4;
                } else {
                    this.bimbot.getModelo().rotation.y = -Math.PI / 2;
                }
                break;
            default:
                break;
        }
    }

    onKeyUp(event) {
        var x = event.which || event.key;
        switch (x) {
            case KeyCode.KEY_W:
                //Cambia el estado de la variable corriendo a false
                this.movimientos[0] = false;
                this.idle = true;
                this.startAnimation = true;
                break;
            case KeyCode.KEY_A:
                this.movimientos[1] = false;
                this.idle = true;
                this.startAnimation = true;
                break;
            case KeyCode.KEY_S:
                this.movimientos[2] = false;
                this.idle = true;
                this.startAnimation = true;
                break;
            case KeyCode.KEY_D:
                this.movimientos[3] = false;
                this.idle = true;
                this.startAnimation = true;
                break;
        }
        this.bimbot.fadeToAction('Idle', true, 1);
    }

    onKeyPressed(event) {
        var x = event.which || event.key;
        switch (x) {
            case KeyCode.KEY_SPACE:
                this.bimbot.fadeToAction('Jump', false, 1);
                break;
            case KeyCode.KEY_Q:
                this.bimbot.fadeToAction("Wave", false, 0.6);
                break;
        }
    }

    createGUI(gui, str) {

        this.guiControls = {
        }
        var folder = gui.addFolder(str);
    }

    update() {
        var dt = this.clock.getDelta();
        if (this.mixer) this.mixer.update(dt);

        this.bimbot.update(dt);
        this.objetos.update(dt);

        this.setInfoColeccionables();

        //Comprobamos si ha llegado al final
        this.endBox.copy(this.end.geometry.boundingBox).applyMatrix4(this.end.matrixWorld);
        this.reachEnd();

        //Cajas
        for (var i = 0; i < this.cajas.length; i++) {
            this.checkCollisionsCaja(this.cajas[i]);
        }
        //Trampas
        for (var i = 0; i < this.trampas.length; i++) {
            this.checkCollisions(this.trampas[i]);
        }
        //Coleccionables
        for (var i = 0; i < this.coleccionables.length; i++) {
            if (this.checkCollisionsColeccionables(this.coleccionables[i])) {
                this.coleccionables.splice(i, 1);
            }
        }

        //Vamos actualizando el mensaje de las vidas del robot
        this.setMessage("Vidas: " + this.bimbot.getVidas());
        //Funcion que comprueba si ha llegado a 0 vidas
        this.gameOver();

        /* if(this.idle==true){
            this.bimbot.fadeToAction('Idle', true, 1);
        } */

        //console.log("Estado: " + this.movimientos);
        //Hacia delante

        //En el movimiento, defino unos límites para que no se salga del mapa

        if (this.movimientos[0] === true) {
            if (this.bimbot.position.z < this.limiteZ) {
                this.bimbot.position.z += this.velocidad;
            }
            if (this.startAnimation && this.currentAction != "Running") {
                this.bimbot.fadeToAction("Running", true, 1);
                this.startAnimation = false;
            }
        }
        //Izquierda
        if (this.movimientos[1] === true) {
            if (this.bimbot.position.x < this.limiteX) {
                this.bimbot.position.x += this.velocidad;
            }
            if (this.startAnimation && this.currentAction != "Running") {
                this.bimbot.fadeToAction("Running", true, 1);
                this.startAnimation = false;
            }
        }
        //Atras
        if (this.movimientos[2] === true) {
            if (this.bimbot.position.z > this.limiteZN) {
                this.bimbot.position.z -= this.velocidad;
            }
            if (this.startAnimation && this.currentAction != "Running") {
                this.bimbot.fadeToAction("Running", true, 1);
                this.startAnimation = false;
            }
        }
        //Derecha
        if (this.movimientos[3] === true) {
            if (this.bimbot.position.x > this.limiteXN) {
                this.bimbot.position.x -= this.velocidad;
            }
            if (this.startAnimation && this.currentAction != "Running") {
                this.bimbot.fadeToAction("Running", true, 1);
                this.startAnimation = false;
            }
        }

        //Boton izqdo raton
        if (this.movimientos[4] === true) {
            if (this.startAnimation && this.currentAction != "Running") {
                this.bimbot.fadeToAction("Punch", false, 1);
                this.startAnimation = false;
            }
        }

    }

}

export { main };
