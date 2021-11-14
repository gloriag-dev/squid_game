//setting 3D Scene and Camera

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//render function for 3D
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//setLight (since it was all black atb)
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.castShadow = true;
scene.add(directionalLight);
directionalLight.position.set(0, 1, 1);

//set camera position and background color
camera.position.z = 5;
renderer.setClearColor(0xb7c3f3, 1);

//load gltf
const loader = new THREE.GLTFLoader();
let doll;

//globals, set player's start position and end position
const start_position = 6;
const end_position = -start_position;

//set main text (h1)
const text = document.querySelector(".text");

//initialize players
let DEAD_PLAYERS = 0;
let SAFE_PLAYERS = 0;

//start!!
const startBtn = document.querySelector(".start-btn");

//load Doll from model
loader.load("./model/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  doll = gltf.scene;
  gltf.scene.position.set(0, -1, 0);
  gltf.scene.scale.set(0.4, 0.4, 0.4);
  startBtn.innerText = "start";
});

//Doll animation
function lookBackward() {
  gsap.to(doll.rotation, { duration: 0.45, y: -3.15 });
  setTimeout(() => (dallFacingBack = true), 150);
}
function lookForward() {
  gsap.to(doll.rotation, { duration: 0.45, y: 0 });
  setTimeout(() => (dallFacingBack = false), 450);
}

//set path
function createCube(size, posX, rotY = 0, color = 0xfbc851) {
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(posX, 0, 0);
  cube.rotation.y = rotY;
  scene.add(cube);
  return cube;
}

//Creating runway
createCube(
  { w: start_position * 2 + 0.21, h: 1.5, d: 1 },
  0,
  0,
  0xe5a716
).position.z = -1;
createCube({ w: 0.2, h: 1.5, d: 1 }, start_position, -0.4);
createCube({ w: 0.2, h: 1.5, d: 1 }, end_position, 0.4);

//define players
class Player {
  constructor(name = "Player", radius = 0.25, posY = 0, color = 0xffffff) {
    const geometry = new THREE.SphereGeometry(radius, 100, 100);
    const material = new THREE.MeshBasicMaterial({ color });
    const player = new THREE.Mesh(geometry, material);
    scene.add(player);
    player.position.x = start_position - 0.4;
    player.position.z = 1;
    player.position.y = posY;
    this.player = player;
    this.playerInfo = {
      positionX: start_position - 0.4,
      velocity: 0,
      name,
      isDead: false,
    };
  }

  run() {
    if (this.playerInfo.isDead) return;
    this.playerInfo.velocity = 0.03;
  }

  stop() {
    gsap.to(this.playerInfo, { duration: 0.1, velocity: 0 });
  }

  check() {
    if (this.playerInfo.isDead) return;
    if (!dollFacingBack && this.playerInfo.velocity > 0) {
      text.innerText = this.playerInfo.name + " lost!!!";
      this.playerInfo.isDead = true;
      this.stop();
      DEAD_PLAYERS++;
      if (DEAD_PLAYERS == players.length) {
        text.innerText = "Everyone lost!!!";
        gameStat = "ended";
      }
      if (DEAD_PLAYERS + SAFE_PLAYERS == players.length) {
        gameStat = "ended";
      }
    }
    if (this.playerInfo.positionX < end_position + 0.7) {
      text.innerText = this.playerInfo.name + " is safe!!!";
      this.playerInfo.isDead = true;
      this.stop();
      SAFE_PLAYERS++;
      if (SAFE_PLAYERS == players.length) {
        text.innerText = "Everyone is safe!!!";
        gameStat = "ended";
      }
      if (DEAD_PLAYERS + SAFE_PLAYERS == players.length) {
        gameStat = "ended";
      }
    }
  }

  update() {
    this.check();
    this.playerInfo.positionX -= this.playerInfo.velocity;
    this.player.position.x = this.playerInfo.positionX;
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const player1 = new Player("Player 1", 0.25, 0.3, 0xd1ffc6);
const player2 = new Player("Player 2", 0.25, -0.3, 0xffcfd2);

const players = [
  {
    player: player1,
    key: "ArrowUp",
    name: "Player 1",
  },
  {
    player: player2,
    key: "w",
    name: "Player 2",
  },
];

const TIME_LIMIT = 15;
async function init() {
  await delay(500);
  text.innerText = "Starting in 3";
  await delay(500);
  text.innerText = "Starting in 2";
  await delay(500);
  text.innerText = "Starting in 1";
  lookBackward();
  await delay(500);
  text.innerText = "Gooo!!!";
  start();
}

let gameStat = "loading";

function start() {
  gameStat = "started";
  const progressBar = createCube({ w: 8, h: 0.1, d: 1 }, 0, 0, 0xebaa12);
  progressBar.position.y = 3.35;
  gsap.to(progressBar.scale, { duration: TIME_LIMIT, x: 0, ease: "none" });
  setTimeout(() => {
    if (gameStat != "ended") {
      text.innerText = "Time Out!!!";
      loseMusic.play();
      gameStat = "ended";
    }
  }, TIME_LIMIT * 1000);
  startDoll();
}

let dollFacingBack = true;
async function startDoll() {
  lookBackward();
  await delay(Math.random() * 1500 + 1500);
  lookForward();
  await delay(Math.random() * 750 + 750);
  startDoll();
}

startBtn.addEventListener("click", () => {
  if (startBtn.innerText == "START") {
    init();
    document.querySelector(".modal").style.display = "none";
  }
});

function animate() {
  renderer.render(scene, camera);
  players.map((player) => player.player.update());
  if (gameStat == "ended") return;
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("keydown", function (e) {
  if (gameStat != "started") return;
  let p = players.find((player) => player.key == e.key);
  if (p) {
    p.player.run();
  }
});
window.addEventListener("keyup", function (e) {
  let p = players.find((player) => player.key == e.key);
  if (p) {
    p.player.stop();
  }
});

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
