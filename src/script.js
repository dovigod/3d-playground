import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

const scene = new THREE.Scene();

//object

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
cube.position.set(0, 0, 0);
scene.add(cube);
//Camera
const sizes = {
	width: 800,
	height: 600
};

// const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.0001, 10000);

//left right top bottom
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);
scene.add(camera);
//camera looks flatt..ac
// multipy aspectRatio

//renderer

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);

let clock = new THREE.Clock();

const animate = () => {
	const elapsedTime = clock.getElapsedTime(); // 선언후 경과 시간
	//update

	renderer.render(scene, camera);

	// will rotate in same rotationrate on every browser

	cube.rotation.y = elapsedTime * 2;
	window.requestAnimationFrame(animate);
};

animate();
