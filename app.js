//Основные переменные
var rotation_matrix = new THREE.Matrix4().identity();
var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

let container;
let camera;
let renderer;
let scene;
let car;
let gui;
let acceleration = 0;
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
  let makeInfoContainer = document.createElement("P");
  makeInfoContainer.innerHTML = "Use WASD to Drive";
  let body = document.querySelector("body");
  document.body.style.background = "none";
  body.appendChild(makeInfoContainer);
  // body.addEventListener("keydown", logKey);
  gui.close();
  // FLOOR
  var floorTexture = new THREE.ImageUtils.loadTexture(
    "./env_textures/road4.jpg"
  );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(20, 20);
  var floorMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture,
    side: THREE.DoubleSide,
  });
  var floorGeometry = new THREE.PlaneGeometry(8000, 8000, 1, 1);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);
  //сетка
  // let gridHelper = new THREE.GridHelper(8000, 50);
  // scene.add(gridHelper);
  //оси
  // let axesHelper = new THREE.AxesHelper(500);
  // scene.add(axesHelper);
  // skyBox
  const skyLoader = new THREE.CubeTextureLoader();
  const skyTexture = skyLoader.load([
    "./env_textures/posx.jpg",
    "./env_textures/negx.jpg",
    "./env_textures/posy.jpg",
    "./env_textures/negy.jpg",
    "./env_textures/posz.jpg",
    "./env_textures/negz.jpg",
  ]);
  skyTexture.encoding = THREE.sRGBEncoding;
  scene.background = skyTexture;
  //сбрасываем координаты машины
  car.position.x = 0;
  car.position.y = 0;
  car.position.z = 0;
  car.rotation.z = Math.PI;
  car.rotation.x = -1.57;
  //сбрасываем скорость вращения колёс
  car.parent.children[0].children[0].children[0].children[11].rotation.x = 0;
  car.parent.children[0].children[0].children[0].children[12].rotation.x = 0;
  car.parent.children[0].children[0].children[0].children[13].rotation.x = 0;
  car.parent.children[0].children[0].children[0].children[14].rotation.x = 0;
}

drive.addEventListener("click", makeDrive);

let loader = new THREE.GLTFLoader();
loader.load(
  "./mazda_rx8/sceneUpdated_withWheels and front rims.gltf",
  function (gltf) {
    init(); // запускаем всю сцену
    scene.add(gltf.scene);
    car = gltf.scene.children[0];
    car.castShadow = true;
    animate(); // функция запускает анимацию
  }
);

function init() {
  container = document.querySelector(".scene");

  //ДЕЛАЕМ СЦЕНУ
  scene = new THREE.Scene();

  let fov = 40;
  let aspect = container.clientWidth / container.clientHeight;
  let near = 0.1;
  let far = 200000;

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
    onStyle();
  }
  if (drive.dataset.status === "OnDrive") {
    onDrive();
  }
}
function onStyle() {
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
    car.parent.children[0].children[0].children[0].children[11].material.color;
  rimIDcolor.r = settings.rimsRed;
  rimIDcolor.g = settings.rimsGreen;
  rimIDcolor.b = settings.rimsBlue;
  // четыре колеса
  car.parent.children[0].children[0].children[0].children[11].rotation.x += 0.05;
  car.parent.children[0].children[0].children[0].children[12].rotation.x += 0.05;
  car.parent.children[0].children[0].children[0].children[13].rotation.x += 0.05;
  car.parent.children[0].children[0].children[0].children[14].rotation.x += 0.05;
  //режим свободной езды
}
function onDrive(e) {
  console.log(`Скорость: ${acceleration / 10}`);
  console.log(
    `скорость вращения колеса, ${car.parent.children[0].children[0].children[0].children[11].rotation.x}`
  );
  // console.log(`Координаты машины: x: ${parseInt(car.position.x)} y: ${parseInt(car.position.y)} z: ${parseInt(car.position.z)}`); - довольно странно
  
  var delta = clock.getDelta(); // seconds.
  var rotateAngle = (Math.PI / 4) * delta; // pi/2 radians (90 degrees) per second
  car.translateY(parseInt(-acceleration * delta));
  // acceleration = 0.7*acceleration; // сила трения (?)
  // порядок вращения колес
  // car.parent.children[0].children[0].children[0].children[13].rotation.order =
  //   "YXZ";
  // car.parent.children[0].children[0].children[0].children[14].rotation.order =
  //   "YXZ";
  if (keyboard.pressed("W")) {
    if (acceleration <= 1400) acceleration += 20;
    console.log(acceleration);
    // car.parent.children[0].children[0].children[0].children[13].rotateOnAxis(
    //   new THREE.Vector3(0, 0, 1),
    //   rotateAngle
    // )/10; - здесь тоже ось вращения не срабатывает
  }

  car.parent.children[0].children[0].children[0].children[11].rotation.x +=
    acceleration * 0.0005;
  car.parent.children[0].children[0].children[0].children[12].rotation.x +=
    acceleration * 0.0005;
  car.parent.children[0].children[0].children[0].children[13].rotation.x +=
    acceleration * 0.0005;
  car.parent.children[0].children[0].children[0].children[14].rotation.x +=
    acceleration * 0.0005;

  if (keyboard.pressed("S")) {
    if (acceleration >= 10) {
      acceleration -= 20;
      car.parent.children[0].children[0].children[0].children[11].rotation.x = 0;
      car.parent.children[0].children[0].children[0].children[12].rotation.x = 0;
      car.parent.children[0].children[0].children[0].children[13].rotation.x = 0;
      car.parent.children[0].children[0].children[0].children[14].rotation.x = 0;
    }
  }
  // rotate left/right/up/down
  if (keyboard.pressed("A") && acceleration > 0) {
    car.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotateAngle);

    // car.parent.children[0].children[0].children[0].children[13].rotateOnAxis(
    //   new THREE.Vector3(0, 1, 0),
    //   rotateAngle
    // ) / 10; 
    // car.parent.children[0].children[0].children[0].children[14].rotateOnAxis(
    //   new THREE.Vector3(0, 1, 0),
    //   rotateAngle
    // ) / 10;
  }
  if (keyboard.pressed("D") && acceleration > 0) {
    car.rotateOnAxis(new THREE.Vector3(0, 0, 1), -rotateAngle);
    // car.parent.children[0].children[0].children[0].children[13].rotateOnAxis(
    //   new THREE.Vector3(0, 1, 0),
    //   -rotateAngle
    // ) / 10;
    // car.parent.children[0].children[0].children[0].children[14].rotateOnAxis(
    //   new THREE.Vector3(0, 1, 0),
    //   -rotateAngle
    // ) / 10;
  }

  if (keyboard.pressed("Z")) {
    // тревожная кнопка
    car.position.set(0, 0, 0, 0);
    car.rotation.set(0, 0, 0);
  }
  camera.position.z = car.position.z + 600;
  camera.lookAt(car.position);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
// window.addEventListener("resize", onWindowResize);
