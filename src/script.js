import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// Textures
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
	console.log('onStart');
};

loadingManager.onLoad = () => {
	console.log('onLoad');
};
loadingManager.onProgress = () => {
	console.log('progress');
};
loadingManager.onError = () => {
	console.log('errer');
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughnes.jpg');

// minification happens when texture is smaller than original,, like zoom out, blurred points
// mip mapping => size down untill 1x1
//when too small... morie pattern occurs

colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;

//magnification filter => pixel gets stretched when texture is too small for it
//gets blurred when stretched
colorTexture.magFilter = THREE.NearestFilter; // gets sharp!!
//**** nearest fillter gives better performance  when minification , nearest filter dont use mipmapping so cheaper */

const gui = new dat.GUI();
gui.hide();

const meshParams = {
	color: '#ffffff',
	spin: () => {
		gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
	}
};
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
};

const cursor = {
	x: undefined,
	y: undefined
};
window.addEventListener('mousemove', (e) => {
	cursor.x = e.clientX / sizes.width - 0.5;
	cursor.y = -(e.clientY / sizes.height - 0.5);
});

const scene = new THREE.Scene();

//object

const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2);

const material = new THREE.MeshBasicMaterial({
	color: meshParams.color,
	map: colorTexture
});

const mesh = new THREE.Mesh(geometry, material);

mesh.position.y = 1;
scene.add(mesh);

//debug

gui.add(mesh.position, 'y', -3, 3, 0.01);
gui.add(mesh.position, 'x').min(-3).max(3).step(0.01);
gui.add(mesh.position, 'z', -3, 3, 0.01).name('zPosition');

gui.add(mesh, 'visible');

gui.add(material, 'wireframe');

gui.addColor(meshParams, 'color').onChange(() => {
	material.color = new THREE.Color(meshParams.color);
});
gui.add(meshParams, 'spin');

const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.0001, 10000);
camera.position.set(0, 0, 3);
camera.lookAt(0, 0, 0);
scene.add(camera);

//renderer

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // friction
controls.target.y = 1;
controls.update();

const animate = () => {
	controls.update(); // for damping
	renderer.render(scene, camera);
	window.requestAnimationFrame(animate);
};

const eventListeners = () => {
	window.addEventListener('resize', (e) => {
		sizes.width = window.innerWidth;
		sizes.height = window.innerHeight;
		camera.aspect = sizes.width / sizes.height;
		camera.updateProjectionMatrix();
		renderer.setSize(sizes.width, sizes.height);
	});

	window.addEventListener('dblclick', (e) => {
		const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

		if (!fullscreenElement) {
			if (canvas.requestFullscreen) {
				canvas.requestFullscreen();
			} else if (canvas.webkitFullscreen) {
				canvas.webkitRequestFullscreen();
			}
			// not on safari
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}

			console.log('exit fullscreen');
		}
	});
};

eventListeners();
animate();
