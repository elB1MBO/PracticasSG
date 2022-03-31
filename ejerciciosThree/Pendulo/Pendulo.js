import * as THREE from "../libs/three.module.js"

class Pendulo extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();

        this.createGUI(gui, titleGUI);

        this.altura = 5.0;
        this.ancho = 1.0;

        this.penduloSuperior = this.createPenduloSuperior();
        this.penduloInferior = this.createPenduloInferior();

        this.penduloInferior.position.y = -this.altura/2;
        //this.penduloSuperior.position.y = -this.altura/2;

        this.penduloSuperior.scale.y = this.guiControls.escalaSuperior;

        this.penduloInferior.scale.y = this.guiControls.escalaInferior;
        this.penduloInferior.rotation.z = this.guiControls.rotacionInferior;
        this.penduloInferior.position.y = -this.altura*this.guiControls.escalaSuperior;

        this.rotation.z = this.guiControls.rotacionSuperior;

        this.add(this.penduloSuperior);
        this.add(this.penduloInferior);
    }

    createPenduloSuperior(){
        var material = new THREE.MeshStandardMaterial({color: 0xFDFF00});
        var geom = new THREE.BoxGeometry(this.ancho, this.altura, this.ancho);

        this.pendSup = new THREE.Mesh(geom, material);

        return this.pendSup;
    }
    createPenduloInferior(){
        var material = new THREE.MeshStandardMaterial({color: 0x004FFA});
        var geom = new THREE.BoxGeometry(this.ancho, this.altura, this.ancho);

        this.pendInf = new THREE.Mesh(geom, material);

        return this.pendInf;
    }

    createGUI(gui, titleGUI){
        //Controles para el tamaño, la orientación y la posición de la caja
        this.guiControls = {
            escalaSuperior : 1.0,
            rotacionSuperior : 0.0,
            escalaInferior : 1.0,
            rotacionInferior : 0.0,

            //Un botón para dejarlo todo en su posición inicial
            //Cuando se pulse se ejecutará esta función
            reset : () => {
                this.guiControls.escalaSuperior = 1.0;
                this.guiControls.rotacionSuperior = 0.0;
                this.guiControls.escalaInferior = 1.0;
                this.guiControls.rotacionInferior = 0.0;
            }
        }

        //Añadir la carpeta con los controles
        var folder = gui.addFolder (titleGUI);
        //Y añadimos los controles a la interfaz
        //El método listen permite que cuado se cambia el valor de una variable 
        //en el código, la barra de la interfaz se actualice
        folder.add(this.guiControls, 'escalaSuperior', 1.0, 2.0, 0.1)
            .name('Escala pendulo superior: ').listen();
        folder.add(this.guiControls, 'rotacionSuperior', -0.5, 0.5, 0.1)
            .name('Rotacion superior: ').listen();

        folder.add(this.guiControls, 'escalaInferior', 1.0, 2.0, 0.1)
            .name('Escala inferior: ').listen();
        folder.add(this.guiControls, 'rotacionInferior', -0.5, 0.5, 0.1)
            .name('Rotacion inferior: ').listen();
        //Y el boton de reset
        folder.add(this.guiControls, 'reset').name(' RESET ');

    }

    update(){ 
        /* ORDEN en que se aplican, sin importar el orden de cómo se escriban las órdenes:
            Primero: Escalado
            Segundo: rotacion en Z
            Tercero: rotacion en Y
            Cuarto: rotacion en X
            Por último: traslación
        */

        this.penduloSuperior.scale.y = this.guiControls.escalaSuperior;

        this.penduloInferior.scale.y = this.guiControls.escalaInferior;
        this.penduloInferior.rotation.z = this.guiControls.rotacionInferior;
        //Queremos que baje el tamaño del pedulo superior, es decir, 10 * la escala asignada
        this.penduloInferior.position.y = -this.altura*this.guiControls.escalaSuperior;
        //Queremos que roten los 2, entonces rotamos this
        this.rotation.z = this.guiControls.rotacionSuperior;
    }

}

export {Pendulo}