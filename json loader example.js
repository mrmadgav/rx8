"use strict";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
//ДЕЛАЕМ СЦЕНУ
let scene = new THREE.Scene();
let container = document.querySelector(".scene");
let fov = 40;
let aspect = container.clientWidth / container.clientHeight;
let near = 0.1;
let far = 200000;

//ДЕЛАЕМ КАМЕРУ
let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 50, 600);

let ambient = new THREE.AmbientLight(0x404040, 3);
scene.add(ambient);

let light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(50, 50, 100);
scene.add(light);

let loader = new THREE.GLTFLoader();
loader.load(
  "./mazda_rx8/sceneUpdated_withWheels and front rims QUALITY.gltf",
  function (gltf) {
    scene.add(gltf.scene);
    car = gltf.scene.children[0];
    car.castShadow = true;
    car.receiveShadow = true;
  }
);

const composer = new THREE.EffectComposer(renderer);

function animate() {
  requestAnimationFrame(animate);

  composer.render();
}
