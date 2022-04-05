import * as THREE from "../libs/three.module.js"

class Pendulo extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();

        this.createGUI(gui, titleGUI);

        /*Queremos 2 péndulos: uno detrás, cuya parte central cambia de longitud,
        y otro delante, fijado a la parte roja del primero, en la que puede cambiar
        de posición y de tamaño
        */
       this.hv = 4.0; //altura verde
       this.hr = 5.0; //altura rojo
       this.hs = 10.0; //altura del pendulo secundario

        this.penduloPrincipal = this.createPenduloPrincipal();

        //this.penduloSecundario.position.y = this.guiControls.posicionSecundario;

        this.add(this.penduloPrincipal);

    }

    createPenduloPrincipal(){
        //Creo los materiales
        var materialVerde = new THREE.MeshStandardMaterial({color: 0x27C61F})
        var materialRojo = new THREE.MeshStandardMaterial({color: 0xB61114})
        var materialCilindro = new THREE.MeshStandardMaterial({color: 0xC9A90C})
        //Creo las geometrias necesarias
        var geometria = new THREE.BoxGeometry(4, this.hv, 2);
        var geometriaInf = new THREE.BoxGeometry(4, this.hv, 2);
        var geometriaRojo = new THREE.BoxGeometry(4, this.hr, 2);
        var geometriaCilindro = new THREE.CylinderGeometry(1, 1, 1, 6);
        //Primero roto el cilindro
        geometriaCilindro.rotateX(Math.PI/2);
        //Traslado la geometria de la parte roja y del cilindro
        geometriaCilindro.translate(0, 0, 1);
        //Traslado la geometria del rojo para que su centro esté en su borde superior   
        geometriaRojo.translate(0, -this.hr/2, 0);
        geometriaInf.translate(0, -this.hv, 0);

        this.parteVerdeSup = new THREE.Mesh(geometria, materialVerde);
        this.parteRoja = new THREE.Mesh(geometriaRojo, materialRojo);
        this.parteVerdeInf = new THREE.Mesh(geometriaInf, materialVerde);
        var cilindro = new THREE.Mesh(geometriaCilindro, materialCilindro);

        //Transformaciones de la parte roja:
        this.parteRoja.position.y = -this.hv/2;
        this.parteRoja.scale.y = this.guiControls.longitudRojo;
        //Traslado la parte inferior segun la longitud de la parte roja
        this.parteVerdeInf.position.y = -this.hr*this.guiControls.longitudRojo;

        this.penduloSecundario = this.createPenduloSecundario();

        var pendulo = new THREE.Object3D();
        pendulo.add(this.parteVerdeSup);
        pendulo.add(this.parteRoja);
        pendulo.add(this.parteVerdeInf);
        pendulo.add(this.penduloSecundario);
        pendulo.add(cilindro);

        return pendulo;

    }

    createPenduloSecundario(){
        var material = new THREE.MeshStandardMaterial({color: 0x3B1753});
        var materialCilindro = new THREE.MeshStandardMaterial({color: 0x832E03});

        var geometria = new THREE.BoxGeometry(2, this.hs, 1);
        var geometriaCilindro = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 6);
        //Transformo la geometria del cilindro
        geometriaCilindro.rotateX(Math.PI/2);
        geometriaCilindro.translate(0,-0.5,2);

        //Transformar la geometria del pendulo
        geometria.translate(0, -this.hs/2, 1.5);

        this.penduloSec = new THREE.Mesh(geometria, material);
        var cilindro = new THREE.Mesh(geometriaCilindro, materialCilindro); 

        this.penduloSec.scale.y = this.guiControls.longitudSecundario;
        this.penduloSec.rotation.z = this.guiControls.rotacionSecundario;

        this.penduloSec.position.y = -this.hv/2;
        cilindro.position.y = -this.hv/2;

        var penduloS = new THREE.Object3D();
        penduloS.add(this.penduloSec);
        penduloS.add(cilindro);

        return penduloS;
    }

    createGUI(gui, titleGUI){
        this.guiControls = {
            longitudRojo : 1.0,
            rotacionPenduloP : 0.0,
            longitudSecundario : 1.0,
            rotacionSecundario : 0.0,
            posicionSecundario : 10,

            //Boton de reset
            reset : () => {
                this.guiControls.longitudRojo = 1.0;
                this.guiControls.rotacionPenduloP = 0.0;
                this.guiControls.longitudSecundario = 1.0;
                this.guiControls.rotacionSecundario = 0.0;
                this.guiControls.posicionSecundario = 0.0;
            }
        }        
        //Crear las carpetas
        var folder1 = gui.addFolder('Primer péndulo');
        var folder2 = gui.addFolder('Segundo péndulo');
        var folderReset = gui.addFolder('Reset');
        //Principal
        folder1.add (this.guiControls, 'longitudRojo', 1.0, 2.0, 0.1).name('Longitud: ').listen();
        folder1.add (this.guiControls, 'rotacionPenduloP', -0.5, 0.5, 0.1).name('Rotación: ').listen();
        //Secundario
        folder2.add (this.guiControls, 'longitudSecundario', 1.0, 2.0, 0.1).name('Longitud: ').listen();
        folder2.add (this.guiControls, 'rotacionSecundario', -0.5, 0.5, 0.1).name('Rotacion: ').listen();
        folder2.add (this.guiControls, 'posicionSecundario', 10, 90, 1).name('Posición: ').listen();

        //Boton de reset
        folderReset.add(this.guiControls, 'reset').name('RESET');
    }

    update(){ 
        //Pendulo principal
        this.parteRoja.scale.y = this.guiControls.longitudRojo;
        this.parteVerdeInf.position.y = -this.hr*this.guiControls.longitudRojo;
        this.penduloPrincipal.rotation.z = this.guiControls.rotacionPenduloP;
        //Pendulo secundario
        this.penduloSec.scale.y = this.guiControls.longitudSecundario;
        this.penduloSec.rotation.z = this.guiControls.rotacionSecundario;
        this.penduloSecundario.position.y = -this.guiControls.posicionSecundario * this.guiControls.longitudRojo/100;
    }

}

export {Pendulo}