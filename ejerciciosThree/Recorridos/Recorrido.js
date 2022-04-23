import * as THREE from "../libs/three.module.js"
import * as TWEEN from "../libs/tween.esm.js"

class Recorrido extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();

        this.createGUI(gui, titleGUI);

        this.visibleSpline = this.createPath();
        this.add(this.visibleSpline);
        this.visibleSpline2 = this.createPath2();
        this.add(this.visibleSpline2);

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
        var origen = {p:0};
        var destino = {p:1};

        //Definición de la animación: Variables origen, destino y tiempo
        var movimiento = new TWEEN.Tween(origen)
            .to(destino, 4000) //2 seg
            .easing(TWEEN.Easing.Quadratic.InOut)
            //Qué hacer con esos parámetros
            .onUpdate (() => {  
                //Se coloca y orienta el objeto a animar
                var posicion = this.spline.getPointAt (origen.p);
                this.figura.position.copy (posicion);
                var tangente = this.spline.getTangentAt (origen.p);
                posicion.add(tangente); //Se mira a un punto en esa dirección
                this.figura.lookAt (posicion);
                //Lo que se alinea con la tangente es la Z positiva del objeto
            })
            //.repeat(Infinity)

        //Segundo movimiento:
        origen = {p:0};
        destino = {p:1};

        var movimiento2 = new TWEEN.Tween(origen)
            .to(destino, 8000) //2 seg
            .easing(TWEEN.Easing.Quadratic.InOut)
            //Qué hacer con esos parámetros
            .onUpdate (() => {  
                //Se coloca y orienta el objeto a animar
                var posicion = this.spline.getPointAt (origen.p);
                this.figura.position.copy (posicion);
                var tangente = this.spline.getTangentAt (origen.p);
                posicion.add(tangente); //Se mira a un punto en esa dirección
                this.figura.lookAt (posicion);
                //Lo que se alinea con la tangente es la Z positiva del objeto
            })
            //.repeat(Infinity)

        movimiento.chain(movimiento2);
        movimiento2.chain(movimiento);
        //La animación comienza cuando se le indique
        movimiento.start();

        //Hay que actualizar los movimientos Tween en la función de render

        this.add(this.figura);
    }

    createPath(){
        this.spline = new THREE.CatmullRomCurve3([
            //new THREE.Vector3(-10,10,-10), 
            new THREE.Vector3(4,10,4),
            new THREE.Vector3(4,9,10),
            new THREE.Vector3(-4,8,-4),
            new THREE.Vector3(10,11,-4)
        ]);
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
        //para hacerlo cte
        /* var time = Date.now();
        var looptime = 4000; //4 segundos
        var t = ( time % looptime ) / looptime; */
        

        return visibleSpline;
    }

    createPath2(){
        this.spline2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(10, 11, -4),
            new THREE.Vector3(12, 11, -4),
            new THREE.Vector3(8,12,4),
            new THREE.Vector3(-10,10,-10),
            new THREE.Vector3(-4, 10, -12),
            new THREE.Vector3(0, 10, -10),
            new THREE.Vector3(4,10,4)
        ]);

        var geometriaLinea = new THREE.BufferGeometry();
        //Se toman los vértices del spline, en este caso 100 muestras
        geometriaLinea.setFromPoints(this.spline2.getPoints(100));
        //Se crea una línea visible con un material
        var material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 2});
        var visibleSpline2 = new THREE.Line(geometriaLinea, material);

        //Se necesita un parametro entre 0 y 1, 0 es el principio y 1 el final
        //Representa la posicion en el spline
        /* var time = Date.now();
        var looptime = 8000; //4 segundos
        var t = ( time % looptime ) / looptime;
        //Se coloca y orienta el objeto a animar
        var posicion = this.spline2.getPointAt (t);
        this.figura.position.copy (posicion);
        var tangente = this.spline2.getTangentAt (t);
        posicion.add(tangente); //Se mira a un punto en esa dirección
        this.figura.lookAt (posicion); */
        //Lo que se alinea con la tangente es la Z positiva del objeto


        return visibleSpline2;

    }

    createGUI(gui, titleGUI){
        
    }

    update(){ 
        //Se necesita un parametro entre 0 y 1, 0 es el principio y 1 el final
        //Representa la posicion en el spline
        /* var time = Date.now();
        var looptime = 4000; //4 segundos
        var t = ( time % looptime ) / looptime;
        //Se coloca y orienta el objeto a animar
        var posicion = this.spline.getPointAt (t);
        this.figura.position.copy (posicion);
        var tangente = this.spline.getTangentAt (t);
        posicion.add(tangente); //Se mira a un punto en esa dirección
        this.figura.lookAt (posicion);
        //Lo que se alinea con la tangente es la Z positiva del objeto

        var time2 = Date.now();
        var looptime2 = 8000; //4 segundos
        var t2 = ( time2 % looptime2 ) / looptime2;
        //Se coloca y orienta el objeto a animar
        var posicion2 = this.spline2.getPointAt (t2);
        this.figura.position.copy (posicion2);
        var tangente2 = this.spline2.getTangentAt (t2);
        posicion.add(tangente2); //Se mira a un punto en esa dirección
        this.figura.lookAt (posicion2); */
        //Lo que se alinea con la tangente es la Z positiva del objeto

        TWEEN.update();

    }

}

export {Recorrido}