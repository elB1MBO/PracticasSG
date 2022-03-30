import * as THREE from "../libs/three.module.js"
import {CSG} from '../libs/CSG-v2.js'
import { color } from "../libs/dat.gui.module.js";

class GeomConstr extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();

        this.createGUI(gui, titleGUI);

        //Taza
        this.taza = this.createTaza();
        this.add(this.taza);

        //Figura rara
        this.dado = this.createDado();
        this.dado.position.y = 20;
        this.add(this.dado);
    }

    createTaza(){
        var material = new THREE.MeshNormalMaterial();
        //para crear la taza, tenemos primero que cerar 2 cilindros: uno exterior y otro interior, y hacerles la diferencia
        var cilExterior = new THREE.CylinderGeometry(10, 10, 25, 32, 1);
        var cilInterior = new THREE.CylinderGeometry(9, 9, 25, 32, 1);
        var torus = new THREE.TorusGeometry(5, 1, 24, 24);

        //Posicionamos el cilindro interior para que deje un fondo
        cilInterior.translate(0, 1, 0);
        torus.translate(-10, 0, 0);

        var cilExteriorMesh = new THREE.Mesh(cilExterior, material);
        var cilInteriorMesh = new THREE.Mesh(cilInterior, material);
        var torusMesh = new THREE.Mesh(torus, material);

        var csg = new CSG();
        //Si hacemos primero subtract del cilindro y luego le ponemos el toro, 
        //se verá por dentro, ya que no le hara la diferencia con el cil interior
        csg.union ([cilExteriorMesh, torusMesh]);
        csg.subtract ([cilInteriorMesh]);

        var taza = csg.toMesh();
        taza.axis = new THREE.AxesHelper(30);
        taza.add(taza.axis);
        return taza;
    }

    createDado(){
        var cubo = new THREE.BoxGeometry(10, 10, 10, 32);
        var esfera = new THREE.SphereGeometry(5.5, 32, 32);
        
        var cuboMesh = new THREE.Mesh(cubo, new THREE.MeshBasicMaterial({color: 0xD025B7}));
        var esferaMesh = new THREE.Mesh(esfera, new THREE.MeshBasicMaterial({colro: 0x194D33}));

        var csg = new CSG();

        csg.intersect ([cuboMesh, esferaMesh]);

        var dado = csg.toMesh();
        return dado;
    }

    createGUI(gui, titleGUI){

        this.guiControls = {posicionY : 0}

        var folder = gui.addFolder(titleGUI);

        //Cambiar de posicion en el eje Y la taza
        folder.add(this.guiControls, 'posicionY', -50, 50, 1)
        .name('PosicionY Taza: ')
        .onChange((value) => this.setPosicionYTaza(value));
        //Cambiar si la taza rota o no   
    }

    setPosicionYTaza(value){
        this.taza.getWorldPosition.y = value;
    }

    update(){}

}

export {GeomConstr}