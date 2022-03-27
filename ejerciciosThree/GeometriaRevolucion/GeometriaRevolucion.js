import * as THREE from "../libs/three.module.js"

/**
 * Crearemos varias figuras geometricas que mostraremos en una misma escena
 */

class GeometriaRevolucion extends THREE.Object3D {
    constructor(gui, titleGui){
        super();

        //Creamos la interfaz:
        this.createGUI(gui, titleGui);
        
        //Creamos nuestra figura por revolucion:
        //Puntos
        var puntos = [];
        puntos.push(new THREE.Vector3(0.01,19.99, 0));
        puntos.push(new THREE.Vector3(5,14.99,0));
        puntos.push(new THREE.Vector3(10,9.99,0));
        puntos.push(new THREE.Vector3(10,0.0001,0));
        puntos.push(new THREE.Vector3(5,-5.01,0));
        puntos.push(new THREE.Vector3(5,-5,0));
        puntos.push(new THREE.Vector3(10,0.001,0));
        puntos.push(new THREE.Vector3(10,10,0));
        puntos.push(new THREE.Vector3(5,15,0));
        puntos.push(new THREE.Vector3(0.01,20,0));
        //Creams nuestra figura
        this.latheObject = new THREE.Mesh(new THREE.LatheGeometry(puntos), new THREE.MeshNormalMaterial());
        this.add(this.latheObject);

        //Para crear una linea invisible como en el video
        var lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setFromPoints(puntos);
        var line = new THREE.Line(lineGeometry, new THREE.MeshNormalMaterial())
        this.add(line);

        //Si modificamos la geometria del objeto, habria que hacer dispose() cada vez que se modifica, para destruir la que vamos a descartar
        
    }
    
    createGUI(gui, titleGui){
        this.guiControls = {rotacion : 0}
    
        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'rotacion', -0.125, 1.4, 0.001)
        .onChange((value) => this.setAngulo(-value));
    }

    //Este metodo se llamará cada vez que se refresque la pantalla, ya que se llama en el update de la escena
    update(){
        
    }

}

export{ GeometriaRevolucion }