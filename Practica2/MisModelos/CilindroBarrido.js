import { CSG } from "../libs/CSG-v2.js";
import * as THREE from "../libs/three.module.js"

class CilindroBarrido extends THREE.Mesh {
    constructor(gui, titleGUI){
        super();
        this.rc = 1.5;
        this.hc = 5;
        
        var textura = new THREE.TextureLoader().load('../imgs/textura-dorada-metalica.jpg');
        this.material = new THREE.MeshPhongMaterial({map: textura});
        var geomCil = new THREE.CylinderGeometry(this.rc, this.rc, this.hc, 24);
        
        this.cilindro = new THREE.Mesh(geomCil, this.material);
        
        this.barrido = this.createBarrido();
        
        var csg = new CSG();
        csg.union([this.cilindro, this.barrido]); //Porque omite al cilindro?
        this.cilBarrido = csg.toMesh();

        return this.cilindro;
    }

    createBarrido(){
        var curva = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0,-this.hc/2,this.rc),
            new THREE.Vector3(this.rc/2, -1.875, this.rc),
            new THREE.Vector3(this.rc,-this.hc/4,0),
            new THREE.Vector3(0,0,-this.rc),
            new THREE.Vector3(-this.rc,1.25,0),
            new THREE.Vector3(0,2.5,this.rc)
        ]);

        /* var puntos = curva.getPoints(50);
        var geometria = new THREE.BufferGeometry().setFromPoints(puntos);
        var material = new THREE.LineBasicMaterial({color: 0xff0000}); */

        var shape = this.createShape();
        var opciones = {steps: 50, curveSegments: 10, extrudePath: curva};
        var geometria = new THREE.ExtrudeGeometry(shape, opciones);

        var objetoCurvo = new THREE.Mesh(geometria, this.material);
        return objetoCurvo;
    }

    createShape(){
        var shape = new THREE.Shape();
        shape.absellipse(0,0,this.rc/5, this.rc/5, 0, Math.PI*2);
        //shape.absarc(0, 0, this.rc/5,Math.PI, Math.PI*2);
        return shape;
    }

}

export {CilindroBarrido}