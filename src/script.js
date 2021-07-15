import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

//bufferGeometry => chip memory
//float 32ARRay => native js , can store only float ,fixed length easy for computer to handle
const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 0, 0, 1]); // length of 9
// then convert this to THREE.js bufferAttribute
// positionsArray[0] = 0;
// positionsArray[1] = 0;
// positionsArray[2] = 0;

// positionsArray[3] = 0;
// positionsArray[4] = 1;
// positionsArray[5] = 0;

// positionsArray[6] = 1;
// positionsArray[7] = 0;
// positionsArray[8] = 0;

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// 3 == 1 vertex contains
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', positionsAttribute);

const material = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	wireframe: true
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
// const cube = new THREE.Mesh(
// 	new THREE.BoxBufferGeometry(1, 1, 1, 4, 4, 4),
// 	new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
// );

// cube.position.set(0, 0, 0);
// scene.add(cube);

//Camera

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

<<<<<<< HEAD
eventListeners();
animate();
=======
		console.log('exit fullscreen');
	}
});
>>>>>>> 81942f59687363edc43c7d938b4bedfd32b1d0ee
