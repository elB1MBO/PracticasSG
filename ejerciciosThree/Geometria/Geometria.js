import * as THREE from "../libs/three.module.js"

/**
 * Crearemos varias figuras geometricas que mostraremos en una misma escena
 */

class Geometria extends THREE.Object3D {
    constructor(gui, titleGui){
        super();

        //Creamos la interfaz:
        this.createGUI(gui, titleGui);
        //Creamos nuestros cuerpos geometricos:
        this.cubo = this.createCubo();
        this.cono = this.createCono();
        this.cilindro = this.createCilindro();
        this.torusKnot = this.createTorusKnot();

        //Creo objetos padre de cada figura
        this.cuboPadre = new THREE.Object3D;
        this.cuboPadre.add(this.cubo);
        this.cuboPadre.add(new THREE.AxesHelper(15));

        this.conoPadre = new THREE.Object3D;
        this.conoPadre.add(this.cono);
        this.conoPadre.add(new THREE.AxesHelper(15));

        this.cilindroPadre = new THREE.Object3D;
        this.cilindroPadre.add(this.cilindro);
        this.cilindroPadre.add(new THREE.AxesHelper(15));

        this.torusKnotPadre = new THREE.Object3D;
        this.torusKnotPadre.add(this.torusKnot);
        this.torusKnotPadre.add(new THREE.AxesHelper(15));

        //Añadimos los hijos de Object3D:
        this.add(this.cuboPadre);    
        this.add(this.conoPadre);
        this.add(this.cilindroPadre);
        this.add(this.torusKnotPadre);
    }
    //Cubo
    createCubo(){
        var geomCubo = new THREE.BoxBufferGeometry(10, 10, 10);    //Geometria del cubo
        var materialCubo = new THREE.MeshNormalMaterial(); //Material del cubo
        materialCubo.flatShading = true;
        materialCubo.needsUpdate = true;

        //Creamos el Mesh Cubo
        var cubo = new THREE.Mesh(geomCubo, materialCubo);
        cubo.position.x=-10;
        cubo.position.y=10;
        
        return cubo;
    }
    //Cono
    createCono(){
        var geomCono = new THREE.ConeGeometry(5, 20, 64);
        var materialCono = new THREE.MeshNormalMaterial();
        materialCono.flatShading = true;
        materialCono.needsUpdate = true;

        var cono = new THREE.Mesh(geomCono, materialCono);
        cono.position.x = 10;
        cono.position.y = 10;
        return cono;
    }
    //Cilindro
    createCilindro(){
        var geomCil = new THREE.CylinderGeometry(5, 5, 20, 32);
        var materialCil = new THREE.MeshNormalMaterial();
        materialCil.flatShading = true;
        materialCil.needsUpdate = true;
        
        var cilindro = new THREE.Mesh(geomCil, materialCil);    
        cilindro.position.x = 10;
        cilindro.position.y = -10;
        return cilindro;
    }
    //TorusKnot
    createTorusKnot(){
        var geomTK = new THREE.TorusKnotGeometry(10, 3, 100, 16);
        var materialTK = new THREE.MeshNormalMaterial();
        materialTK.flatShading = true;
        materialTK.needsUpdate = true;

        var torusKnot = new THREE.Mesh(geomTK, materialTK);
        torusKnot.position.x = -15;
        torusKnot.position.y = -15;
        return torusKnot;
    }

    createGUI(gui, titleGui){
        this.guiControls = {rotacion : 0}
    
        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'rotacion', -0.125, 1.4, 0.001)
        .onChange((value) => this.setAngulo(-value));
    }

    //Este metodo se llamará cada vez que se refresque la pantalla, ya que se llama en el update de la escena
    update(){
        //this.rotation.y += 0.01;
        this.cubo.rotation.y += 0.01;
        this.cilindro.rotation.y += 0.01;
        this.cono.rotation.y += 0.01;
        this.torusKnot.rotation.y += 0.01;
    }

}

export{ Geometria }