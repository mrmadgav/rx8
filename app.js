//Основные переменные

let container;
let camera;
let renderer;
let scene;
let car;
let gui;
var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();
//НАСТРОЙКИ ДЛЯ ДАТ ГУИ
let settings = {
  // ключи поворота модели
  rotationX: -1.4,
  rotationY: 0,
  rotationZ: 0.0,
  // ключи цвета кузова
  bodyRed: 0.2,
  bodyGreen: 0.2,
  bodyBlue: 0.2,
  // ключи цвета дисков
  rimsRed: 0.2,
  rimsGreen: 0.2,
  rimsBlue: 0.2,
};

// кнопка переключения анимации (!)
var drive = document.querySelector("button");
drive.dataset.status = "OnStyle";

// Функция, включающая по нажатию на кнопку drive камеру от первого лица и возможность ездить на авто
function makeDrive() {
  drive.dataset.status = "OnDrive";
  document.querySelector("body").addEventListener("keydown", logKey);
  gui.close();
  let ground = new THREE.PlaneGeometry(500, 500);
  let material = new THREE.MeshNormalMaterial((wireframe = true));

  meshGround = new THREE.Mesh(ground, material);

  scene.add(meshGround);
  meshGround.rotation.x += Math.PI / 2;
  let gridHelper = new THREE.GridHelper(800, 50);
  scene.add(gridHelper);
  let axesHelper = new THREE.AxesHelper(500);
  scene.add(axesHelper);

  car.rotation.x = -1.57;
  car.position.x = 0;
  car.position.y = 0;
  car.position.z = 0;
  car.rotation.z = Math.PI;
  fov = 0;
  console.log(camera);
}
drive.addEventListener("click", makeDrive);

let loader = new THREE.GLTFLoader();
loader.load("./mazda_rx8/sceneUpdated.gltf", function (gltf) {
  init(); // запускаем всю сцену
  scene.add(gltf.scene);
  car = gltf.scene.children[0];
  animate(); // функция запускает анимацию
});
// console.log(drive.dataset.status === 'OnStyle');

function init() {
  container = document.querySelector(".scene");

  //ДЕЛАЕМ СЦЕНУ
  scene = new THREE.Scene();

  let fov = 40;
  let aspect = container.clientWidth / container.clientHeight;
  let near = 0.1;
  let far = 2000;

  //ДЕЛАЕМ КАМЕРУ
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 600);

  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(50, 50, 100);
  scene.add(light);

  //Сам dat GUI

  gui = new dat.GUI();
  // создаем ползунки вращения авто
  gui.add(settings, "rotationX").min(-1.5).max(1.5).step(0.001);
  gui.add(settings, "rotationY").min(-0.2).max(0.2).step(0.001);
  gui.add(settings, "rotationZ").min(-0.03).max(0.03).step(0.001);
  // папка с настроками цвета авто
  var guiBodyColors = gui.addFolder("Choose Body Color");
  guiBodyColors.add(settings, "bodyRed").min(0).max(0.7).step(0.005);
  guiBodyColors.add(settings, "bodyGreen").min(0).max(0.7).step(0.005);
  guiBodyColors.add(settings, "bodyBlue").min(0).max(0.7).step(0.005);
  guiBodyColors.open();
  //папка с настройками цвета дисков
  var guiRimsColors = gui.addFolder("Choose Rims Color");
  guiRimsColors.add(settings, "rimsRed").min(0).max(0.7).step(0.005);
  guiRimsColors.add(settings, "rimsGreen").min(0).max(0.7).step(0.005);
  guiRimsColors.add(settings, "rimsBlue").min(0).max(0.7).step(0.005);
  guiRimsColors.open();
  // gui.add(settings, "lightPower").min(0).max(10).step(0.5); - найти динамическое изменение света на модели

  // ДЕЛАЕМ РЕНДЕР
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);
  // Orbit Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  update();
}

function update() {
  if (drive.dataset.status === "OnStyle") {
    // поворот модели
    car.rotation.x = settings.rotationX;
    car.rotation.y = settings.rotationY;
    car.rotation.z += settings.rotationZ;
    // цвет кузова
    let bodyIDcolor =
      car.parent.children[0].children[0].children[0].children[0].material.color;
    bodyIDcolor.r = settings.bodyRed;
    bodyIDcolor.g = settings.bodyGreen;
    bodyIDcolor.b = settings.bodyBlue;
    // цвет дисков
    let rimIDcolor =
      car.parent.children[0].children[0].children[0].children[11].material
        .color;
    rimIDcolor.r = settings.rimsRed;
    rimIDcolor.g = settings.rimsGreen;
    rimIDcolor.b = settings.rimsBlue;
  }

  if (drive.dataset.status === "OnDrive") {
    document.body.style.background = "none";
  }
}

var rotation_matrix = new THREE.Matrix4().identity();
//отлавливает нажатие клавиши управления
function logKey(e) {
  console.log(`${e.code}`);
  var delta = clock.getDelta(); // seconds.
  var moveDistance = 200 * delta; // 200 pixels per second
  var rotateAngle = (Math.PI / 4) * delta; // pi/2 radians (90 degrees) per second
  if (keyboard.pressed("W")) car.translateZ(-moveDistance);
  console.log(car.position.x, car.position.y, car.position.z);
  if (keyboard.pressed("S")) car.translateZ(moveDistance);
  if (keyboard.pressed("Q")) car.translateX(-moveDistance);
  if (keyboard.pressed("E")) car.translateX(moveDistance);
  // rotate left/right/up/down

  if (keyboard.pressed("A"))
    car.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
  if (keyboard.pressed("D"))
    car.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
  if (keyboard.pressed("R"))
    car.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle);
  if (keyboard.pressed("F"))
    car.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle);

  if (keyboard.pressed("Z")) {
    car.position.set(0, 0, 0, 0);
    car.rotation.set(0, 0, 0);
  }
  var relativeCameraOffset = new THREE.Vector3(0, 50, 600);
  var cameraOffset = relativeCameraOffset.applyMatrix4(car.matrixWorld);

  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = car.position.z;
  camera.lookAt(car.position);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);
