import * as THREE from '../libs/three.module.js'
import * as KeyCode from '../libs/keycode.esm.js'
import { Bimbot } from './Bimbot.js'
import { Objetos } from './Objetos.js'

class main extends THREE.Object3D {
    constructor(gui, titleGUI) {
        super();
        this.createGUI(gui, titleGUI);

        this.clock = new THREE.Clock();

        //Velocidad de movimiento del robot
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

        //Array de los box helpers
        this.boxHelpers = [];

        this.bimbot = new Bimbot();
        //La caja del bot irá aparte, ya que se tiene que crear y destruir al reiniciar el juego cuando muere
        this.botBoxHelper = new THREE.Box3Helper(this.bimbot.getBBox(), 0xffff00);
        this.add(this.botBoxHelper);

        this.animationsMap = this.bimbot.animations; //Mapa de las animaciones del bimbot
        //this.bimbot.position.z = 150;
        this.add(this.bimbot);

        for (var i = 0; i < this.bimbot.animations.length; i++) {
            var clip = this.bimbot.animations[i];
            //console.log(clip.name);
        }

        this.objetos = new Objetos();
        this.add(this.objetos);

        //Colisiones:

        this.cajas = this.objetos.getCajas();
        this.coleccionables = this.objetos.getColeccionables();
        this.trampas = this.objetos.getTrampas();

        //Para saber cuando colisiona una caja para destruirla, usaré una matriz, con el array de cajas y un array de booleanos
        this.arrayCajas = [];
        this.arrayCajas.push(this.cajas);
        
        this.colisionesCajas = [false, false];
        this.arrayCajas.push(this.colisionesCajas);
        ////console.log(this.arrayCajas);

        //Cuando el robot llegue a esta caja, saldrá un mensaje de que tiene que volver al comienzo, pero la velocidad de las trampas habrá aumentado
        this.end = this.createEnd();
        this.endBox = new THREE.Box3();
        //this.endBox.copy(this.end.geometry.boundingBox).applyMatrix4(this.end.matrixWorld);
        this.endHelper = new THREE.Box3Helper(this.endBox, 0xABCDEF);
        this.add(this.endHelper);
        this.add(this.end);

        //Para establecer por defecto que las box helpers no sean visibles
        this.setBoxHelpers(false);

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
        /* window.addEventListener("keypress", (event) => this.onKeyPressed(event)); */

        //Escuche el click izquierdo para dar un puñetazo
        window.addEventListener("mousedown", (event) => this.onMouseDown(event));
        window.addEventListener("mouseup", (event) => this.onMouseUp(event));

        //Que escuche el boton de RESUME Y USAR
        document.getElementById("botonResume").addEventListener("mousedown", (event) => this.resume(event), true);
        document.getElementById("botonColecionables").addEventListener("mousedown", (event) => this.sumaVida(event), true);

        window.addEventListener("keydown", (event) => this.keyColeccionable(event));

    }

    // ******* ******* ******* GUI ******* ******* *******

    setBoxHelpers(value){
        this.botBoxHelper.visible = value;
        this.endHelper.visible = value;
        this.objetos.setBoxHelpers(value);
    }

    createGUI(gui, titleGUI) {

        this.guiControls = { boxHelpers: false }

        var folder = gui.addFolder(titleGUI);

        //Cambiar la visibilidad de los box helpers
        folder.add(this.guiControls, 'boxHelpers', true, false)
            .name('Box Helpers: ')
            .onChange((value) => this.setBoxHelpers(value));
    }

    // ******* ******* ******* POINTS ******* ******* *******

    createEnd() {
        var geom = new THREE.BoxGeometry(4, 5, 4);
        var material = new THREE.MeshToonMaterial({ visible: false });

        var caja = new THREE.Mesh(geom, material);
        caja.position.y = 2.5;
        caja.position.z = 160;
        caja.geometry.computeBoundingBox();
        return caja;
    }

    reachEnd(){
        if(this.endBox.containsBox(this.bimbot.getBBox())){
            //console.log("Ha llegado al final");
            this.checkpoint.z = this.end.position.z;
            //console.log(this.checkpoint);
            //Mueve el punto final al comienzo del mapa
            if(this.final){
                this.end.position.y = -10;
                this.victoria();
            }else{
                this.final = true;
            }
            this.end.scale.x = 5;
            this.end.position.z = 0;
            //Activa el mensaje
            var screen = document.getElementById("check-msg");
            screen.style.display = "inline";
        }
    }

    victoria(){
        document.getElementById("check-msg").style.display = "none";
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
            //console.log("Bimbot ha colisionado, pierde una vida y vuelve al checkpoint.");
            //console.log(this.checkpoint);
            this.bimbot.position.x = this.checkpoint.x;
            this.bimbot.position.y = this.checkpoint.y;
            this.bimbot.position.z = this.checkpoint.z;
            this.hit(); //pierde una vida
        }
    }
    checkCollisionsCaja(objeto, indice) {
        if (objeto.getBBox().intersectsBox(this.bimbot.getBBox())) {
            this.arrayCajas[1][indice] = true;
        }else{
            this.arrayCajas[1][indice] = false;
        }
        //console.log("ARRAY CAJAS: "+this.arrayCajas);
    }

    checkCollisionsColeccionables(objeto) {
        if (objeto.getBBox().intersectsBox(this.bimbot.getBBox())) {
            //console.log("Bimbot ha encontrado un coleccionable, lo recoge.");
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
        if(this.bimbot.getVidas()>0){
            this.bimbot.setVidas(this.bimbot.getVidas()-1);
        }
    }

    vidas(event) {
        var x = event.which || event.key;
        if (x === KeyCode.KEY_X && this.bimbot.getVidas() > 0) {
            //console.log("PIERDE UNA VIDA");
            this.bimbot.setVidas(this.bimbot.getVidas() - 1);
        } else if (x === KeyCode.KEY_Z) {
            //console.log("GANA UNA VIDA");
            this.bimbot.setVidas(this.bimbot.getVidas() + 1);
        }
    }

    recogeColeccionable() {
        //console.log("HA RECOGIDO UN COLECCIONABLE");
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
        //console.log("GANA UNA VIDA, pierde un coleccionable");
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
            this.remove(this.botBoxHelper);
        }
    }
    //Cuando pulsen el boton de Resume, se volverá a crear al bimbot y se quitará la pantalla de game over
    resume(event) {
        if (event.button === 0) {
            /* document.getElementById("gameOverScreen").style.display = "none";
            this.bimbot = new Bimbot();
            this.add(this.bimbot);
            this.gameResumed = true;
            this.botBoxHelper = new THREE.Box3Helper(this.bimbot.getBBox(), 0xffff00);
            this.add(this.botBoxHelper);
            //Resetea los coleccionables borrando lo restantes y creandolos todos de nuevo
            for (var i = 0; i < this.coleccionables.length; i++) {
                this.objetos.remove(this.coleccionables[i]);
            }
            this.objetos.createCollectables(); */
            window.location.reload();
        }
    }

    // ******* ******* ******* ANIMACIONES ******* ******* *******

    //Click ratón:
    onMouseDown(event) {
        if (event.button === 0) { //Boton izquierdo
            this.movimientos[4] = true;
            //console.log("Ha pulsado el boton izqdo: "+this.movimientos[4]);
        }
    }
    onMouseUp(event) {
        if (event.button === 0) {
            this.movimientos[4] = false;
            //console.log("Ha soltado el boton izqdo: "+this.movimientos[4]);
            this.currentAction = "Idle";
            this.bimbot.fadeToAction('Idle', true, 1);
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
                    //this.startAnimation = false;
                    //console.log("Presionando W "+this.startAnimation);
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
                this.currentAction = "Idle";
                this.startAnimation = true;
                break;
            case KeyCode.KEY_A:
                this.movimientos[1] = false;
                this.currentAction = "Idle";
                this.startAnimation = true;
                break;
            case KeyCode.KEY_S:
                this.movimientos[2] = false;
                this.currentAction = "Idle";
                this.startAnimation = true;
                break;
            case KeyCode.KEY_D:
                this.movimientos[3] = false;
                this.currentAction = "Idle";
                this.startAnimation = true;
                break;
        }
        this.bimbot.fadeToAction('Idle', true, 1);
    }


    // ******* ******* ******* UPDATE ******* ******* *******

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
            this.checkCollisionsCaja(this.arrayCajas[0][i], i);
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

        
        //En el movimiento, defino unos límites para que no se salga del mapa
        //Hacia delante
        if (this.movimientos[0] === true) {
            if (this.bimbot.position.z < this.limiteZ) {
                this.bimbot.position.z += this.velocidad;
            }
            //Comprueba si tiene que empezar la animacion
            if (this.startAnimation && this.currentAction != "Running") {
                this.currentAction = "Running";
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
                this.currentAction = "Running";
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
                this.currentAction = "Running";
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
                this.currentAction = "Running";
                this.bimbot.fadeToAction("Running", true, 1);
                this.startAnimation = false;
            }
        }

        //Boton izqdo raton
        if (this.movimientos[4] === true) {
            //console.log(this.currentAction);
            for (let i = 0; i < this.arrayCajas[0].length; i++) {
                var caja = this.arrayCajas[0][i];
                var colisiona = this.arrayCajas[1][i];
                if(colisiona){
                    //console.log("Destruye caja");
                    //Borra la caja 
                    this.objetos.remove(this.arrayCajas[0][i]);
                    //Y tambien la borra de la matriz, junto a su bool correspondiente
                    this.arrayCajas[0].splice(i, 1);
                    this.arrayCajas[1].splice(i, 1);
                }
            }
            if (this.startAnimation && this.currentAction != "Punch") {
                this.currentAction = "Punch";
                this.bimbot.fadeToAction("Punch", false, 1);
                this.startAnimation = false;
            }
            /* this.currentAction = "Idle";
            this.bimbot.fadeToAction("Idle", true, 1); */
        }

    }

}

export { main };
