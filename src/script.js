import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const sizes = {
	width: 800,
	height: 600
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

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
cube.position.set(0, 0, 0);
scene.add(cube);

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

//controls

const controls = new OrbitControls(camera, canvas);
controls.target.y = 1;
controls.update();

// let clock = new THREE.Clock();

const animate = () => {
	// const elapsedTime = clock.getElapsedTime();

	renderer.render(scene, camera);

	// cube.rotation.y = elapsedTime * 2;
	window.requestAnimationFrame(animate);
};

animate();
