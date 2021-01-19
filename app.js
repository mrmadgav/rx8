// import {OrbitControls} from "./libs/three.min.js";
//Основные переменные

let container;
let camera;
let renderer;
let scene;
let car;

// - РАЗОБРАТЬСЯ, КАК РАБОТАЕТ ЭТА ШТУКА - //
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

  //ДЕЛАЕМ СЦЕНУ
  scene = new THREE.Scene();

  const fov = 40;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 1000;

  //ДЕЛАЕМ КАМЕРУ
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 600);

  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(50, 50, 100);
  scene.add(light);



  //НАСТРОЙКИ ДЛЯ ДАТ ГУИ
  let settings = {
    // ключи поворота модели
    rotationX: -1.4,
    rotationY: 0,
    rotationZ: 0.0,
    // color: 0xff00ff,
    // lightPower: 5,
    // ключи цвета кузова
    bodyRed: 0.2,
    bodyGreen: 0.2,
    bodyBlue: 0.2,
    // ключи цвета дисков
    rimsRed: 0.2,
    rimsGreen: 0.2,
    rimsBlue: 0.2,
  };
  //Сам dat GUI

  let gui = new dat.GUI();
  // создаем ползунки вращения авто
  gui.add(settings, "rotationX").min(-1.5).max(1.5).step(0.001);
  gui.add(settings, "rotationY").min(-0.2).max(0.2).step(0.001);
  gui.add(settings, "rotationZ").min(-0.03).max(0.03).step(0.001);
  // папка с настроками цвета авто
  let guiBodyColors = gui.addFolder("Choose Body Color");
  guiBodyColors.add(settings, "bodyRed").min(0).max(0.7).step(0.005);
  guiBodyColors.add(settings, "bodyGreen").min(0).max(0.7).step(0.005);
  guiBodyColors.add(settings, "bodyBlue").min(0).max(0.7).step(0.005);
  guiBodyColors.open();
  //папка с настройками цвета дисков
  let guiRimsColors = gui.addFolder("Choose Rims Color");
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

  function animate() {
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
    // car.parent.children[0].children[0].children[0].children[21].material.color.r = 2 - тонировка стекла
    // car.children[0].children[0].children[18].geometry.boundingSphere.radius = 320.00013; - не работает функция
    car.position.x = 0;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

    // Orbit Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
  //ЗАГРУЗЧИК МОДЕЛИ
  let loader = new THREE.GLTFLoader();
  loader.load("./mazda_rx8/sceneUpdated.gltf", function (gltf) {
    scene.add(gltf.scene);
    car = gltf.scene.children[0];
    // console.log(car.children[0].children[0].children[19].geometry.boundingSphere.radius); попытка достучаться до радиуса колеса
    console.log(
      car.parent.children[0].children[0].children[0].children[11].material
    );

    controls.update();
    animate(); // функция запускает анимацию
  });
}

init(); // запускаем всю сцену

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);
