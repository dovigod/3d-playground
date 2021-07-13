import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();

//object

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));

const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));

cube2.position.set(1, 0, -2);

group.add(cube1);
group.add(cube2);

group.position.set(0, 1, 0);
group.scale.y = 2;
group.rotation.y = 1;

scene.add(group);
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//Camera
const sizes = {
	width: 800,
	height: 600
};

const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height);
camera.position.set(1, 1, 10);

scene.add(camera);

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
	group.rotation.y = elapsedTime * Math.PI * 2; // 1 revolution per sec
	group.position.y = Math.sin(elapsedTime); // up and down
	group.position.x = Math.cos(elapsedTime); // left and right ==> circular movement

	window.requestAnimationFrame(animate);
};

animate();
