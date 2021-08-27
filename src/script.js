import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as dat from 'dat.gui';

/**
 * Base
 */

// Debug
const gui = new dat.GUI();
const debugObject = {};
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

//object

const testSphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 32, 32), new THREE.MeshStandardMaterial());
scene.add(testSphere);

const updateAllMaterials = () => {
	scene.traverse((child) => {
		if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
			child.material.envMapIntensity = debugObject.envMapIntensity;
			child.material.needsUpdate = true;
			child.receiveShadow = true;
			child.castShadow = true;
		}
	});
};

//models
///Users/jisang/Desktop/workspaces/threeJourney/static/models/FlightHelmet/glTF/FlightHelmet.gltf
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
	gltf.scene.scale.set(10, 10, 10);
	gltf.scene.position.set(0, -4, 0);
	gltf.scene.rotation.y = Math.PI * 0.5;
	scene.add(gltf.scene);
	gui.add(gltf.scene.rotation, 'y', -Math.PI, Math.PI, 1).name('mask-rotate');
	updateAllMaterials();
});

/* Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
//light debug
gui.add(directionalLight, 'intensity', 0, 5, 0.01);
gui.add(directionalLight.position, 'x', -5, 5, 0.001).name('dl_X');
gui.add(directionalLight.position, 'y', -5, 5, 0.001).name('dl_Y');
gui.add(directionalLight.position, 'z', -5, 5, 0.001).name('dl_Z');

scene.add(directionalLight);

const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightHelper);

//env map
const cubeTextureLoader = new THREE.CubeTextureLoader();

const enviornmentMap = cubeTextureLoader.load([
	'/environmentMaps/0/px.jpg',
	'/environmentMaps/0/nx.jpg',
	'/environmentMaps/0/py.jpg',
	'/environmentMaps/0/ny.jpg',
	'/environmentMaps/0/pz.jpg',
	'/environmentMaps/0/nz.jpg'
]);

scene.background = enviornmentMap;
scene.environment = enviornmentMap;
scene.outputEncoding = THREE.sRGBEncoding;
//update
debugObject.envMapIntensity = 5;
gui.add(debugObject, 'envMapIntensity', 0, 10, 0.001);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-8, 4, 8);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true
});

renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui.add(renderer, 'toneMappingExposure', 0, 10, 0.001);
gui.add(renderer, 'toneMapping', {
	No: THREE.NoToneMapping,
	Linear: THREE.LinearToneMapping,
	Reinhard: THREE.ReinhardToneMapping,
	cineon: THREE.CineonToneMapping,
	ACESFilmic: THREE.ACESFilmicToneMapping
}).onFinishChange(() => {
	renderer.toneMapping = Number(renderer.toneMapping);
	updateAllMaterials();
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
