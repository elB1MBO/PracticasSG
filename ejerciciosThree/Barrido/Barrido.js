import * as THREE from "../libs/three.module.js"

/**
 * Crear varios objetos por barrido
 */

class Barrido extends THREE.Object3D {
    constructor(gui, titleGUI){
        super();

        this.createGUI(gui, titleGUI);
        
        //Corazon
        this.corazon = this.createCorazon();
        this.corazon.position.y = 150;
        this.corazon.rotation.z = Math.PI;
        var puntos = [
            new THREE.Vector3(50,50,50),
            new THREE.Vector3(90, 75, 50),
            new THREE.Vector3(120, 90, 60),
            new THREE.Vector3(200, 100, 90),
            new THREE.Vector3(230, 60, 120)
        ]
        var ruta = new THREE.CatmullRomCurve3(puntos);
        
        var opciones = {steps: 50, curveSegments: 5, extrudePath: ruta};
        var geometriaCorazonBarrido = new THREE.ExtrudeGeometry(this.createShapeCorazon(), opciones);
        var linea = new THREE.LineBasicMaterial({color: 0xff0000});
        this.linea = new THREE.Line(geometriaCorazonBarrido, linea);
        //this.add(this.linea);
        this.corazonBarrido = new THREE.Mesh(geometriaCorazonBarrido,new THREE.MeshNormalMaterial());
        this.add(this.corazonBarrido);

        //Añado el corazon
        this.add(this.corazon);

        //Corazon con barrido
        
        //Pica
        this.pica = this.createPica();
        this.pica.position.x=10;
        this.add(this.pica);

    }

    //Funciones que crearan los palos de la baraja
    createCorazon(){
        var figuraCorazon = this.createShapeCorazon(); //Método que crea y devuelve un shape

        this.opcionesExtrude = { depth: 5, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0, bevelThickness: 1 };

        this.cuerpoCorazon = new THREE.ExtrudeGeometry( figuraCorazon, this.opcionesExtrude );

        var corazon = new THREE.Mesh( this.cuerpoCorazon, new THREE.MeshNormalMaterial() );

        corazon.position.z = -this.opcionesExtrude.depth/2;

        this.axis = new THREE.AxesHelper(100);
        corazon.add(this.axis);

        // Formar nodos de rotación y translación para la animación
        //this.nodoRT = new THREE.Mesh(this.cuerpoCorazon, new THREE.MeshNormalMaterial());   // Geometría del corazon

        this.cd = new THREE.Object3D();  // Nodo que mantiene verticalidad y se fija a una distancia x
        this.cd.position.x = 20; // Transformación fija
        this.cd.add(this.corazon);

        this.e = new THREE.Object3D();   // Nodo que rota sobre el eje z a la distancia definida
        this.e.add(this.cd);

        this.add(this.e);

        return corazon;
    }
    createDiamante(){
        
    }
    createPica(){
        var pica = new THREE.Object3D();
        var corazon = this.createCorazon();
        var pie = this.createPie();
        
        pie.position.y = -30;
        pie.position.x = 0;
        pie.position.z = 0;

        pica.add(corazon);
        pica.add(pie);
        return pica;
    }
    createTrebol(){

    }
    


    createShapeCorazon(){
        var heartShape = new THREE.Shape();

        heartShape.moveTo( 0, 0 );
        heartShape.bezierCurveTo( 0, 0, -5, -25, -25, -25 );
        heartShape.bezierCurveTo( -60,-25, -55, 10, -55, 10 );
        heartShape.bezierCurveTo(-50,35,-25,25,0,70);
        
        heartShape.bezierCurveTo(25,25,50,35,50,10);
        heartShape.bezierCurveTo(50,10,50,-25,25,-25);
        heartShape.bezierCurveTo(5,-25,0,0,0,0);

        return heartShape;
        
    }

    createPie(){
        var puntos = [];
        puntos.push(new THREE.Vector3(0.09,29.99,0));
        puntos.push(new THREE.Vector3(0.9,4.99,0));
        puntos.push(new THREE.Vector3(10,0,0));
        puntos.push(new THREE.Vector3(1,5,0));
        puntos.push(new THREE.Vector3(0.1,30,0));
        //puntos.push(new THREE.Vector3(0.001,10,0));
        
        var pie = new THREE.Mesh(new THREE.LatheGeometry(puntos), new THREE.MeshNormalMaterial());
        return pie;
    }

    createShapeTrebol(){
        var trevorShape = new THREE.Shape();

        trevorShape.moveTo(0,0);
        trevorShape.bezierCurveTo(0,0,-20,-10, )
    }

    createGUI(gui, titleGui){
        //Controlar la posicion
        this.guiControls = {posicionC : 150, posicionP : 0}

        //Se crea una seccion para los controles del corazon
        var folder = gui.addFolder(titleGui);
        //Aqui se añaden los componentes de la interfaz
        //Las 3 cifras indican un valor minimo, maximo e incremento
        folder.add(this.guiControls, 'posicionC', -200, 200, 1)
            .name('PosicionY corazon: ')
            .onChange((value) => this.setPosicionCorazon(value));

        folder.add(this.guiControls, 'posicionP', -200, 200, 1)
            .name('PosicionY Pica: ')
            .onChange((value) => this.setPosicionPica(value));

    }

    setPosicionCorazon(value){
        this.corazon.position.y = value;
    }
    setPosicionPica(value){
        this.pica.position.y = value;
    }

    //Este metodo se llamará cada vez que se refresque la pantalla, ya que se llama en el update de la escena
    update(){
        this.corazon.rotation.y += 0.01;
        this.pica.rotation.y += 0.01;

        this.cd.rotation.z += 0.01;
        this.e.rotation.z += 0.01;
    }
}

export{Barrido}