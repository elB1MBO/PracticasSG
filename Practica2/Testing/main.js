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

        this.limiteZ = 170;
        this.limiteZN = -15;
        this.limiteX = 8;
        this.limiteXN = -8;

        //Variables para las animaciones:
        //Para ello, tengo un vector con los movimientos:
        //W A S D SPACE
        this.movimientos = [false, false, false, false, false];
        this.startAnimation = false; //variable que marca si una animación ya ha empezado o no
        this.currentAction = "Idle"; //Animación actual

        this.bimbot = new Bimbot();

        var boxHelper = new THREE.Box3Helper(this.bimbot.getBBox(), 0xffff00);
        this.add(boxHelper);

        this.animationsMap = this.bimbot.animations; //Mapa de las animaciones del bimbot

        this.add(this.bimbot);

        for (var i = 0; i < this.bimbot.animations.length; i++) {
            var clip = this.bimbot.animations[i];
            console.log(clip.name);
        }

        this.objetos = new Objetos();
        this.add(this.objetos);

        this.cajas = this.objetos.getCajas();
        this.coleccionables = this.objetos.getColeccionables();
        this.trampas = this.objetos.getTrampas();

        //this.bimbot.fadeToAction('Idle', true, 1);

        window.addEventListener("keydown", (event) => this.onKeyDown(event));
        window.addEventListener("keyup", (event) => this.onKeyUp(event));
        window.addEventListener("keypress", (event) => this.onKeyPressed(event));
    }

    //Funcion que comprueba si dos boxes han colisionado
    intersectBoxes(b1, b2) {
        var vectorBetweenBoxes = new THREE.Vector2();
        vectorBetweenBoxes.subVectors(new THREE.Vector2(b1.position.x, b1.position.z),
            new THREE.Vector2(b2.position.x, b2.position.z));
        return (vectorBetweenBoxes.length() < 2);
    }

    checkCollisions(objeto) {
        if(objeto.getBBox().intersectsBox(this.bimbot.getBBox())){
            console.log("Bimbot ha colisionado, pierde una vida y vuelve al inicio.");
            this.bimbot.position.x = 0;
            this.bimbot.position.z = 0;
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

    recogeColeccionable() {
        console.log("HA RECOGIDO UN COLECCIONABLE");
    }

    getBimbot() {
        return this.bimbot;
    }

    getCamera() {
        return this.camara;
    }


    // ******* ******* ******* ANIMACIONES ******* ******* *******

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
                    console.log("Presionando W "+this.startAnimation);
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

    onKeyPressed(event) {
        var x = event.which || event.key;
        switch (x) {
            /* case KeyCode.KEY_SPACE:
                this.bimbot.fadeToAction('Jump', false, 1);
                break;
            case KeyCode.KEY_Q:
                this.bimbot.fadeToAction("Wave", false, 0.6);
                break; */
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



        //console.log(this.movimientos);
        

        if (this.movimientos[0] === true) {
            if (this.bimbot.position.z < this.limiteZ) {
                this.bimbot.position.z += this.velocidad;
            }
            //Comprueba si tiene que empezar la animacion
            if (this.startAnimation && this.currentAction != "Running") {
                console.log("ENTRA EN EL IF" + this.startAnimation + " " + this.currentAction);
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
                console.log("ENTRA EN EL IF" + this.startAnimation + " " + this.currentAction);
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
                console.log("ENTRA EN EL IF" + this.startAnimation + " " + this.currentAction);
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
                console.log("ENTRA EN EL IF" + this.startAnimation + " " + this.currentAction);
                this.currentAction = "Running";
                this.bimbot.fadeToAction("Running", true, 1);
                this.startAnimation = false;
            }
        }

        //Boton izqdo raton
        /* if (this.movimientos[4] === true) {
            if (this.startAnimation && this.currentAction != "Running") {
                this.bimbot.fadeToAction("Punch", false, 1);
                this.startAnimation = false;
            }
        } */
    }

}

export { main };
