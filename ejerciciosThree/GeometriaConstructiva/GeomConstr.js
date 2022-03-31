import * as THREE from "../libs/three.module.js"
import {CSG} from '../libs/CSG-v2.js'
import { color } from "../libs/dat.gui.module.js";

class GeomConstr extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();

        this.animacion = true;

        this.createGUI(gui, titleGUI);

        //Taza
        this.taza = this.createTaza();
        this.taza.position.x = -15;
        this.taza.position.z = 10;
        this.add(this.taza);

        //Dado
        this.dado = this.createDado();
        this.dado.position.x = 15;
        this.dado.position.z = -10;
        this.add(this.dado);
    }

    createTaza(){
        var material = new THREE.MeshNormalMaterial();
        //para crear la taza, tenemos primero que cerar 2 cilindros: uno exterior y otro interior, y hacerles la diferencia
        var cilExterior = new THREE.CylinderGeometry(10, 10, 25, 32, 1);
        var cilInterior = new THREE.CylinderGeometry(9, 9, 25, 32, 1);
        var torus = new THREE.TorusGeometry(6, 1, 24, 24);

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
        
        var cuboMesh = new THREE.Mesh(cubo, new THREE.MeshNormalMaterial());
        var esferaMesh = new THREE.Mesh(esfera, new THREE.MeshBasicMaterial({color: 0x194D33}));

        var cruz = this.createCruz();

        var csg = new CSG();

        csg.intersect ([cuboMesh, esferaMesh]);
        csg.subtract ([cruz]);

        var dado = csg.toMesh();
        return dado;
    }

    createCruz(){
        var material = new THREE.MeshBasicMaterial({color: 0x0EF61F});

        var cilindroH = new THREE.CylinderGeometry(3, 3, 12, 32);
        var cilindroV = new THREE.CylinderGeometry(3, 3, 12, 32);
        var cilindroV2 = new THREE.CylinderGeometry(3, 3, 12, 32); 

        var cilindroHMesh = new THREE.Mesh(cilindroH, material);
        var cilindroVMesh = new THREE.Mesh(cilindroV, material);
        var cilindroV2Mesh = new THREE.Mesh(cilindroV, material);
        //Roto el cilindro vertical 90º
        cilindroVMesh.rotation.z = Math.PI/2; 
        cilindroV2Mesh.rotation.x = Math.PI/2;

        var csg = new CSG();

        csg.union ([cilindroHMesh, cilindroVMesh, cilindroV2Mesh]);
        var cruz = csg.toMesh();
        return cruz;
    }

    createGUI(gui, titleGUI){

        this.guiControls = {posicionY : 0, animacion : true}

        var folder = gui.addFolder(titleGUI);

        //Cambiar de posicion en el eje Y la taza
        folder.add(this.guiControls, 'posicionY', -50, 50, 1)
        .name('PosicionY Taza: ')
        .onChange((value) => this.setPosicionYTaza(value));
        //Cambiar si la taza rota o no   
        folder.add(this.guiControls, 'animacion', true, false)
        .name('Animacion: ')
        .onChange((value) => this.setAnimacion(value));
    }

    setPosicionYTaza(value){
        this.taza.position.y = value;
    }

    setAnimacion(value){
        this.animacion = value;
    }

    update(){
        if (this.animacion == true) {
            this.taza.rotation.x += 0.01;
            this.taza.rotation.y += 0.01;
            this.taza.rotation.z += 0.01;

            this.dado.rotation.x += 0.01;
            this.dado.rotation.y += 0.01;
            this.dado.rotation.z += 0.01;
        }
    }

}

export {GeomConstr}