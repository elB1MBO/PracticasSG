import * as THREE from "../libs/three.module.js"

class Reloj extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();

        this.createGUI(gui, titleGUI);

        //para añadir las 12 esferas que representan las horas, las añadimos en un bucle
        for(var i=1; i<=12; i++){
            var esferaV = this.createEsfera()
            esferaV.rotation.y = (Math.PI/6)*i; //Cada esfera creada, rota respecto al eje y dependiendo de i
            this.add(esferaV);
        }

        this.manecilla = this.createManecilla();

        this.add(this.manecilla);
    }

    createEsfera(){
        var material = new THREE.MeshStandardMaterial({color: 0x17D20E});

        var geometria = new THREE.SphereGeometry(1, 32, 32);

        geometria.translate(15, 0, 0);

        var esferaQuieta = new THREE.Mesh(geometria, material);

        return esferaQuieta;
    }
   
    createManecilla(){
        var material = new THREE.MeshStandardMaterial({color: 0xF00509});
        var geometria = new THREE.SphereGeometry(1, 32, 32);

        geometria.translate(10, 0, 0);

        var esferaM = new THREE.Mesh(geometria, material);
        return esferaM;
    }

    createGUI(gui, titleGUI){
        this.guiControls = {
            velocidad : 1.0,

           reset : () => {
               this.guiControls.velocidad = 1.0;
           }
        }        
        //Crear las carpetas
        var folder = gui.addFolder('Primer péndulo');
        var folderReset = gui.addFolder('Reset');

        folder.add(this.guiControls, 'velocidad', -12.0, 12.0, 1.0).name('Velocidad: ').listen();

        //Boton de reset
        folderReset.add(this.guiControls, 'reset').name('RESET');
    }

    update(){ 
        this.manecilla.rotation.y -= 0.01*this.guiControls.velocidad;
    }

}

export {Reloj}