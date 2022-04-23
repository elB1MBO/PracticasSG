import * as THREE from "../libs/three.module.js"
import {CSG} from "../libs/CSG-v2.js"

class Practica1 extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();

        this.radio = 6;

        this.createGUI(gui, titleGUI);

        this.auricularesA = this.createAuriculares();
        //this.add(this.auricularesA);
        this.auricularesA.position.y = 20;
        this.auricularesObj = new THREE.Object3D();
        this.auricularesObj.add(this.auricularesA);

        /* this.auricularesA.lookAt(0,0,0);
        this.auricularesObj.lookAt(0,0,0); */

        this.add(this.auricularesObj);

    }

    createAuriculares(){
        var arco = this.createArco();
        arco.position.y = 1.5;
        var cascos = this.createCascos();
        var almohadillas = this.createAlmohadillas();
        
        var auriculares = new THREE.Object3D();
        
        auriculares.add(arco);
        auriculares.add(cascos);
        auriculares.add(almohadillas);

        return auriculares;
    }

    createArco(){
        var material = new THREE.MeshNormalMaterial();

        var geomTorusSuperior = new THREE.TorusGeometry(9, 0.5, 24, 24, 3);

        var torusSuperior = new THREE.Mesh(geomTorusSuperior, material);

        return torusSuperior;
    }

    createShape(){
        var shape = new THREE.Shape();
        shape.absellipse(0,0, this.radio/2, this.radio, 0, Math.PI*2);
        return shape;
    }

    createCasco(){
        var cascoShape = this.createShape();
        var opcionesExtrude = {depth: 2, bevelEnabled: true, bevelSegments: 10, steps:10, bevelSize: 1, bevelThickness: 3};
        var cuerpoCasco = new THREE.ExtrudeGeometry(cascoShape, opcionesExtrude);
    
        var casco = new THREE.Mesh(cuerpoCasco, new THREE.MeshNormalMaterial());
        return casco;
    }
     
    createCascos(){
        var material = new THREE.MeshNormalMaterial();

        
        var geomEsfera = new THREE.SphereGeometry(this.radio, 24, 24);
        var geomResta1 = new THREE.BoxGeometry(this.radio*2, this.radio*4, this.radio*2);
        var geomResta2 = new THREE.BoxGeometry(this.radio*2, this.radio*2, this.radio*2);

        geomResta1.translate(this.radio, 0, 0);
        geomResta2.translate(-this.radio, 0, 0);

        //geomEsfera.scale(this.radio, this.radio+1);

        var esfera1 = new THREE.Mesh(geomEsfera, material);
        var esfera2 = new THREE.Mesh(geomEsfera, material);
        var resta1 = new THREE.Mesh(geomResta1, material);
        var resta2 = new THREE.Mesh(geomResta2, material);

        //esfera1.scale.y =1.3;

        var csg = new CSG();
        var csg2 = new CSG();

        csg.subtract([esfera1, resta1]);
        csg2.subtract([esfera2, resta2]);

        var casco1 = csg.toMesh();
        var casco2 = csg2.toMesh();
        casco1.position.x = -this.radio;
        casco2.position.x = this.radio;
        var cascos = new THREE.Object3D();
        cascos.add(casco1);
        cascos.add(casco2);
        return cascos;
    }

    createAlmohadillas(){
        var material = new THREE.MeshNormalMaterial();

        var geom = new THREE.TorusGeometry(6, 0.75, 24, 24);
        geom.rotateY(Math.PI/2);

        var anillo = new THREE.Mesh(geom, material);
        var anillo2 = new THREE.Mesh(geom, material);

        anillo.position.x = -6;
        anillo2.position.x = 6;

        var almohadillas = new THREE.Object3D();
        almohadillas.add(anillo);
        almohadillas.add(anillo2);

        return almohadillas;
    }

    createGUI(gui, titleGUI){
        this.guiControls = {
            animacion : true,
            segundos : 4
        }

        var folder = gui.addFolder(titleGUI);
        folder.add(this.guiControls, 'animacion', true, false)
            .name('Animación: ').listen();
        folder.add(this.guiControls, 'segundos', 2, 8, 1)
            .name('Segundos por: ').listen();
    }

    update(){ 
        if(this.guiControls.animacion == true){
            this.auricularesA.rotation.y += 0.1*(1/this.guiControls.segundos);
            this.auricularesObj.rotation.z += 0.1*(1/8);
        }
    }

}

export {Practica1}