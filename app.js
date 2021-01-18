//Variables for setup

let container;
let camera;
let renderer;
let scene;
let car;

// let clock = new THREE.Clock();
// let angle = 0; // текущий угол
// let angularSpeed = THREE.Math.degToRad(20); // угловая скорость - градусов в секунду
// let delta = 0;
// let radius = 20;
// function animate() {
//   delta = clock.getDelta(); // getDelta() - возвращает интервал в долях секунды
//   requestAnimationFrame(animate);

//   camera.position.x = Math.cos(angle) * radius;
//   camera.position.z = Math.sin(angle) * radius;
//   angle += angularSpeed * delta; // приращение угла

//   camera.lookAt(mesh.position);

//   renderer.render(scene, camera);
// }

function init() {
  container = document.querySelector(".scene");

  //Create scene
  scene = new THREE.Scene();

  const fov = 40;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 1000;

  // let controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.update();
  // scene.add(controls);

  //Camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 600);

  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(50, 50, 100);
  scene.add(light);
  
  let settings = {
    rotationY: 0,
    rotationX: 0,
    rotationZ: 0    
  }

  //dat GUI
  let FizzyText = function () {
    this.message = "текст";
    this.opacity = 0.8;
    this.display = true;
    this.explode = function () {};
    this.color0 = "#ff9966";
    this.color1 = "#336699";
    this.fontSize = 16;
    this.textDecoration = "none";
    // Define render logic ...
  };
  let text = new FizzyText();
  let gui = new dat.GUI();
  let div = document.querySelector("#some");
  let controllerText = gui.add(text, "message");
  let controllerOpacity = gui.add(text, "opacity", 0, 1);
  let controllerColor = gui.addColor(text, "color0");
  let controllerBackground = gui.addColor(text, "color1");
  let controllerDisplay = gui.add(text, "display");
  gui.add(text, "explode");    
   
   //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  //Load Model
  let loader = new THREE.GLTFLoader();
  loader.load("./mazda_rx8/scene.gltf", function (gltf) {
    scene.add(gltf.scene);
    car = gltf.scene.children[0];
    animate();
  });
}

function animate() {
  requestAnimationFrame(animate);
  car.rotation.z += 0.005;
  renderer.render(scene, camera);
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);
