import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {updateArmRotation, updateArmsMotion, updateHeadRotation, updateWalkingAnimation, stopWalkingAnimation} from "./utils/animations"
import {handleScreenResize, initializeBones} from "./utils/helpers"
import { onKeyDown, onKeyUp } from "./utils/events";
import ReactDOM from "react-dom/client";
import App from "./react/App"


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer();

window.addEventListener("resize", handleScreenResize(camera, renderer));

renderer.setSize(window.innerWidth, window.innerHeight);
camera.aspect = window.innerWidth / window.innerHeight;
camera.position.set(0, 0, 5); // Adjust camera position
camera.lookAt(0, 0, 0); // Adjust lookAt position
camera.updateProjectionMatrix();

const loader = new GLTFLoader();
let model, mixer, sphere, bones;

let clock = new THREE.Clock();

loader.load(
  "./models/model.glb",
  function (gltf) {
    model = gltf.scene;
    scene.add(model);

    model.walking = 0;

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./images/texture.jpg');

    // Create a sphere geometry
    const sphereGeometry = new THREE.SphereGeometry(700, 40, 50);
    sphereGeometry.scale(-1, 1, 1); // Invert the sphere to make it inside out
    // sphereGeometry.position.y += 10;
    // Create a material with the image texture
    const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });

    // Create a mesh with the geometry and material
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.y += 200;
    sphere.position.x -= 100;
    // Add the sphere to the scene
    scene.add(sphere);


    bones = initializeBones(model)
  
    bones.rightUpperArm.rotation.z = -Math.PI / 3;
    bones.leftUpperArm.rotation.z = -Math.PI / 3;

    model.initialPositionX = model.position.x

    mixer = new THREE.AnimationMixer(model);

    document.addEventListener("keydown", onKeyDown(model, bones, clock));
    document.addEventListener("keyup", onKeyUp(model));
    model.position.y = -1;
    model.scale.set(1, 1, 1);

    const documentRoot = ReactDOM.createRoot(document.getElementById("root"))

    documentRoot.render(<App model={model}/>)
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 3;

const mouse = new THREE.Vector2();

document.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});


function animate() {
  requestAnimationFrame(animate);
  if (mixer) {
    const delta = clock.getDelta();
    mixer.update(delta);
  }
  if (model && bones && sphere) {
    updateHeadRotation(mouse, bones, model.isWalking)
    updateArmRotation(model, bones, mouse)
  }
  if (model && sphere && model.isWalking) {
    updateWalkingAnimation(bones, clock);
    updateArmsMotion(bones, clock)
    if (model.isWalking === -1) {
      model.position.x -= 0.005; // Adjust the speed as needed
      sphere.rotation.y += 0.0005
      if (model.position.x < -1) model.isWalking = 0
    }
    if (model.isWalking === 1) {
      model.position.x += 0.005; // Adjust the speed as needed
      sphere.rotation.y -= 0.0005
      if (model.position.x > 2) model.isWalking = 0
    }
  }

  renderer.render(scene, camera);
}

animate();

