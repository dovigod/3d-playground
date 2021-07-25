import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();

const fontLoader = new THREE.FontLoader();

const gui = new dat.GUI()

//object

const material = new THREE.MeshStandardMaterial({color:0xffffff});
material.roughness = 0.4

const plane = new THREE.Mesh(new THREE.PlaneGeometry(3,3), material);
plane.rotation.x= -Math.PI * 0.5
plane.position.y = -1
plane.receiveShadow = true

const sphere = new THREE.Mesh(new THREE.SphereGeometry(.5,16,16) , material)
sphere.castShadow = true
scene.add(plane);
scene.add(sphere);



//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const directLight = new THREE.DirectionalLight(0xffffff , 0.5)
directLight.position.set(2,2,-1)
directLight.castShadow = true
// optimization for graphic
directLight.shadow.mapSize.width = 1024;
directLight.shadow.mapSize.height = 1024;
//use camera helper
directLight.shadow.camera.near = 1
directLight.shadow.camera.far = 5
//since using orthgraphic cam , reduce l r f n b t
directLight.shadow.camera.left = -2
directLight.shadow.camera.right = 2
directLight.shadow.camera.bottom = -2
directLight.shadow.camera.top = 2

//control blur

directLight.shadow.radius = 10

const spotLight = new THREE.SpotLight(0xffffff , 0.5 );
spotLight.position.set(2,3,4)
spotLight.castShadow = true
const dLight = gui.addFolder('dLight')
dLight.add(directLight.position,'x',-5,5,0.001)
dLight.add(directLight.position,'y',-5,5,0.001)
dLight.add(directLight.position,'z',-5,5,0.001)
dLight.add(directLight, 'intensity', 0 , 1 ,0.001)

scene.add(directLight);


scene.add(ambientLight)
scene.add(spotLight)




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

renderer.shadowMap.enabled = true // essential to create shadowmap

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
