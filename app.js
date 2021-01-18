//Основные переменные

let container;
let camera;
let renderer;
let scene;
let car;
let newMaterial = "red";

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
    rotationX: -1.4,
    rotationY: 0,
    rotationZ: 0.0001,
    color: 0xff00ff,
    lightPower: 5,
  };
  //Сам dat GUI

  let gui = new dat.GUI();
  gui.add(settings, "rotationX").min(-1.5).max(1.5).step(0.001);
  gui.add(settings, "rotationY").min(-0.2).max(0.2).step(0.001);
  gui.add(settings, "rotationZ").min(-0.03).max(0.03).step(0.001);
  // gui.add(settings, "lightPower").min(0).max(10).step(0.5); - найти динамическое изменение света на модели
  gui.addColor(settings, "color");

  // ДЕЛАЕМ РЕНДЕР
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  function animate() {
    car.rotation.x = settings.rotationX;
    car.rotation.y = settings.rotationY;
    car.rotation.z += settings.rotationZ;

    // car.material.color.set = settings.color;
    // material.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  //ЗАГРУЗЧИК МОДЕЛИ
  let loader = new THREE.GLTFLoader();
  loader.load("./mazda_rx8/scene.gltf", function (gltf) {
    scene.add(gltf.scene);
    car = gltf.scene.children[0];
    // gltf.scene.traverse((car) => {
    //   if (car.isMesh) car.material = newMaterial;
    // });
    //   car.material = new THREE.MeshLambertMaterial(
    //     {color: Math.random() * 0xffffff });
    //  console.log(car.material.color.r);
    //  car.material.color = {r: 0, g:255, b:255};
    //  console.log(car.material.color.r);
    console.log(car.baseColor);
    // console.log(car.traverse);
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
