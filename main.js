const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
4;
renderer.setClearColor(0xb7c3f3, 1);

const light = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(light);

function createCube(size, positionX) {
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = positionX;
  scene.add(cube);
}
camera.position.z = 5;
const loader = new THREE.GLTFLoader();

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
class Doll {
  constructor() {
    loader.load("model/scene.gltf", (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.scale.set(0.4, 0.4, 0.4);
      gltf.scene.position.set(0, -1, 0);
      this.doll = gltf.scene;
    });
  }
  lookBackward() {
    gsap.to(this.doll.rotation, { y: 3.14, duration: 0.45 });
  }
  lookForward() {
    gsap.to(this.doll.rotation, { y: 0, duration: 0.45 });
  }
}
function createTrack() {
  createCube({ w: 0.2, h: 1.5, d: 1 }, 3);
}
createTrack();
let doll = new Doll();
setTimeout(() => {
  doll.lookBackward();
}, 1000);

animate();

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
