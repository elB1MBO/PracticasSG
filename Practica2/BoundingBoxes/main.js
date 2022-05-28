import * as THREE from '../libs/three.module.js'
import { GLTFLoader } from '../libs/GLTFLoader.js'
import * as TWEEN from '../libs/tween.esm.js'
import {TrampaPinchos} from './TrampaPinchos.js'

class main extends THREE.Object3D {
    constructor(gui, titleGUI) {
        super();
        this.createGUI(gui, titleGUI);

        this.clock = new THREE.Clock();

        this.trampa = new TrampaPinchos(10);
        this.trampa.translateX(5);
        this.trampa.translateZ(5);
        console.log(this.trampa);

        this.boxHelper = new THREE.Box3Helper(this.trampa.getBBox(), 0xffff00);
        console.log(this.boxHelper);
        this.add(this.boxHelper)

        this.add(this.trampa);
    }

    

    createGUI(gui, str) {

        this.guiControls = {
        }
        var folder = gui.addFolder(str);
    }

    update() {
        this.trampa.update();
    }

}

export { main };
