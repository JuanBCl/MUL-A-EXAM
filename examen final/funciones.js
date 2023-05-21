import * as THREE from 'https://sebastiann16.github.io/CompG/three.module.js';
    import { OrbitControls } from 'https://sebastiann16.github.io/CompG/OrbitControls.js';

    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xdddddd, 1);
    document.body.appendChild(renderer.domElement);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
    camera.position.z = 15;
    camera.position.x = -1;
    camera.position.y = 3;
    scene.add(camera);

    var ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

    
    /**
     * Función Caras: Crea las caras de una figura pentagonal a partir de los vértices y los índices
     * ENTRADA:
     * - vertices: Arreglo de coordenadas (x, y, z) de los vértices
     * - indices: Arreglo de índices que definen las caras
     * SALIDA:
     * - geometry: Objeto BufferGeometry que contiene las caras de la figura
     */
    function Caras(vertices, indices) {
      var geometry = new THREE.BufferGeometry();
      var positionAttribute = new THREE.Float32BufferAttribute(vertices, 3);
      geometry.setAttribute('position', positionAttribute);

      var indexAttribute = new THREE.Uint32BufferAttribute(indices, 1);
      geometry.setIndex(indexAttribute);

      geometry.computeVertexNormals();

      return geometry;
    }

     /**
     * Función Prisma: Crea un prisma pentagonal uniendo las caras de la figura
     * ENTRADA:
     * - size: Tamaño de la figura
     * - height: Altura del prisma
     * - color: Color del material de la figura
     * SALIDA:
     * - prismMesh: Objeto Mesh que representa el prisma
     */
    function Prisma(size, height, color) {
      var vertices = [];
      var indices = [];

      // Crear los vértices de la base inferior y superior
      var angle = (2 * Math.PI) / 5;
      for (var i = 0; i < 5; i++) {
        var x1 = size * Math.cos(i * angle);
        var z1 = size * Math.sin(i * angle);
        var y1 = -height * 0.5;
        vertices.push(x1, y1, z1);

        var x2 = (size-1) * Math.cos(i * angle);
        var z2 = (size-1) * Math.sin(i * angle);
        var y2 = height * 0.5;
        vertices.push(x2, y2, z2);
      }

      // Unir las caras para formar el prisma
      for (var i = 0; i < 5; i++) {
        var i1 = i * 2;
        var i2 = i1 + 1;
        var i3 = (i1 + 2) % 10;
        var i4 = (i2 + 2) % 10;

        indices.push(i1, i3, i2);
        indices.push(i2, i3, i4);
        indices.push(i1, i2, i4);
        indices.push(i1, i4, i3);
      }

      var geometry = Caras(vertices, indices);
      var material = new THREE.MeshPhysicalMaterial({ color: color });

      var prismMesh = new THREE.Mesh(geometry, material);
      return prismMesh;
    }

    var prismArr = []; // Arreglo para almacenar los prismas

    // Generar figuras con caras pentagonales y tamaño constante
    var numFigures = 8; // Número de figuras a generar
    var separation = 4; // Separación entre figuras

    var prismSize = 2; // Tamaño de los prismas

    for (var i = 0; i < numFigures; i++) {
      var height = 3 //Math.random() * 4 + 2; // Altura aleatoria entre 2 y 6
      var color = Math.random() * 0xffffff; // Color aleatorio en formato hexadecimal

      var prism = Prisma(prismSize, height, color);

      var posX = (prismSize + (separation-2.3)) * (i % 4) - ((prismSize + (separation)) * 1.5); // Posición horizontal de la figura
      var posY = Math.floor(i / 4) * separation; // Posición vertical de la figura

      prism.position.set(posX, posY, 0); // Ubicar la figura en la escena
      scene.add(prism);
      prismArr.push(prism);
    }

    var controls = new OrbitControls(camera, renderer.domElement);

    var size = 1000;
    var divisions = 1000;

    var gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();