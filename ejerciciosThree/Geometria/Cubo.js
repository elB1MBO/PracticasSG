import * as THREE from '../libs/three.module.js'


class Cubo extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();

        // Se crea la parte de la interfaz que corresponde a la grapadora
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
        this.createGUI(gui, titleGui);

        //Un Mesh esta compuesto por una geometria y un material:
        var geomCubo = new THREE.BoxBufferGeometry(1, 1, 1);    //Geometria del cubo
        var materialCaja = new THREE.MeshNormalMaterial({ color: 0xAA0000 }); //Material del cubo

        //Creamos el Mesh Cubo
        var cubo = new THREE.Mesh(geomCubo, materialCaja);
        //Y lo añadimos como hijo del Object3D (this)
        this.add(cubo);

        //las geometrias se crean centradas en el origen, luego lo subimos sobre la caja
        cubo.position.y=0.5;

    }

    createGUI(gui, titleGui) {
        // Controles para el movimiento de la parte móvil
        this.guiControls = {
            rotacion: 0
        }

        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder(titleGui);
        // Estas lineas son las que añaden los componentes de la interfaz
        // Las tres cifras indican un valor mínimo, un máximo y el incremento
        folder.add(this.guiControls, 'rotacion', -0.125, 1.4, 0.001)
            .onChange((value) => this.setAngulo(-value));
    }

    update() {
        // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
    }
}

export { Cubo }
