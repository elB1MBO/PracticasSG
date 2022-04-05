import * as THREE from "../libs/three.module.js"
import * as TWEEN from "../libs/tween.esm.js"

class Recorrido extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();

        this.createGUI(gui, titleGUI);

        //Creamos nuestra figura
        var cargadorTexturas = new THREE.TextureLoader();
        var textureUp = cargadorTexturas.load('../imgs/textura-ajedrezada.jpg');
        textureUp.repeat.set(0.1, 1);
        var material = new THREE.MeshPhongMaterial ({map: textureUp});
        var geometria = new THREE.ConeGeometry(2, 5, 3);
        geometria.rotateX(Math.PI/2);
        this.figura = new THREE.Mesh(geometria, material);
        //this.figura.rotation.z = Math.PI/2;
        
        //Variables locales con los parámetros y valores a usar
        var origen = {x: 0, y: 30};
        var destino = {x: 40, y: 50};

        //Definición de la animación: Variables origen, destino y tiempo
        var movimiento = new TWEEN.Tween(origen)
            .to(destino, 2000) //2 seg
            .easing(TWEEN.Easing.Quadratic.InOut)
            //Qué hacer con esos parámetros
            .onUpdate (() => {  
                this.figura.position.x = origen.x;
                this.figura.position.y = origen.y;
            })
            .repeat(Infinity)
            .start();

        //La animación comienza cuando se le indique
        //movimiento.start();
        //Hay que actualizar los movimientos Tween en la función de render
        TWEEN.update();
        
        this.add(movimiento);
        this.add(this.figura);

        this.visibleSpline = this.createPath();
        this.add(this.visibleSpline);

    }

    createPath(){
        this.spline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-10,10,-10), 
            new THREE.Vector3(4,10,4),
            new THREE.Vector3(4,10,10),
            new THREE.Vector3(-4,10,-4),
            new THREE.Vector3(10,10,-4)
        ], true);
        //Ademas del array de puntos, se puede añadir un segundo parámetro (true) para obtener un spline cerrado
        
        //Se crea una geometría
        var geometriaLinea = new THREE.BufferGeometry();
        //Se toman los vértices del spline, en este caso 100 muestras
        geometriaLinea.setFromPoints(this.spline.getPoints(100));
        //Se crea una línea visible con un material
        var material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 2});
        var visibleSpline = new THREE.Line(geometriaLinea, material);

        //Se necesita un parametro entre 0 y 1, 0 es el principio y 1 el final
        //Representa la posicion en el spline
        var time = Date.now();
        var looptime = 20000; //20 segundos
        var t = ( time % looptime ) / looptime;
        //Se coloca y orienta el objeto a animar
        var posicion = this.spline.getPointAt (t);
        this.figura.position.copy (posicion);
        var tangente = this.spline.getTangentAt (t);
        posicion.add(tangente); //Se mira a un punto en esa dirección
        this.figura.lookAt (posicion);
        //Lo que se alinea con la tangente es la Z positiva del objeto


        return visibleSpline;
    }

    createGUI(gui, titleGUI){
        
    }

    update(){ 
        //Se necesita un parametro entre 0 y 1, 0 es el principio y 1 el final
        //Representa la posicion en el spline
        var time = Date.now();
        var looptime = 20000; //20 segundos
        var t = ( time % looptime ) / looptime;
        //Se coloca y orienta el objeto a animar
        var posicion = this.spline.getPointAt (t);
        this.figura.position.copy (posicion);
        var tangente = this.spline.getTangentAt (t);
        posicion.add(tangente); //Se mira a un punto en esa dirección
        this.figura.lookAt (posicion);
        //Lo que se alinea con la tangente es la Z positiva del objeto
    }

}

export {Recorrido}