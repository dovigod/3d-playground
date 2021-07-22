import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();

const fontLoader = new THREE.FontLoader();


//object

const material = new THREE.MeshStandardMaterial({color:0xffffff});
material.roughness = 0.4

const plane = new THREE.Mesh(new THREE.PlaneGeometry(3,3), material);
plane.rotation.x= -Math.PI * 0.5
plane.position.y = -1

const sphere = new THREE.Mesh(new THREE.SphereGeometry(.5,16,16) , material)
sphere.position.set(-1.5,0,0);

const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1) , material)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5
scene.add(plane);
scene.add(sphere);
scene.add(cube);
scene.add(torus);


//light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
const pointLight = new THREE.PointLight('#ffffff',0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

scene.add(ambientLight)
scene.add(pointLight)



const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100);
camera.position.set(3, 3, 3);
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

const clock = new THREE.Clock();
const animate = () => {

	const elapsedTime = clock.getElapsedTime()

	cube.rotation.x = elapsedTime * Math.PI * 0.2
	cube.rotation.y = elapsedTime * Math.PI * 0.4
	cube.rotation.z = elapsedTime * Math.PI * 0.6

	torus.rotation.x = elapsedTime * Math.PI * 0.2
	torus.rotation.y = elapsedTime * Math.PI * 0.4
	torus.rotation.z = elapsedTime * Math.PI * 0.6


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
