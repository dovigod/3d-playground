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
//ambient light -> omnidirectional Light
const ambientLight = new THREE.AmbientLight(0xffffff , 0.5);
// scene.add(ambientLight);
// const directionalLight = new THREE.DirectionalLight(0xffff2c , 0.5);
// //works as sunlight , distance doesn't matter , light direction always center of scene ,, mostly use on global lighting
// directionalLight.position.set( -2,1,2)
// scene.add(directionalLight);

// const hemisphereLight = new THREE.HemisphereLight(0xff0000 ,0x0000ff);
// // light1 on top , light 2 on bottom
// scene.add(hemisphereLight)

 const pointLight = new THREE.PointLight(0xff9000 , 0.5 , 10 , 2) // distance -> 영향권, decay -> 빛 소멸
 pointLight.position.set(1 , -1 , 1)
 scene.add(pointLight)
// //will dim if face has larger angle agains light vectors
// // for particular points

const rectareaLight = new THREE.RectAreaLight(0x4e00ff , 0.5 ,2, 2)
rectareaLight.position.set(0,-1, 0);
//cool , 사진점 갔을때 부분 조명 느낌
rectareaLight.lookAt(new THREE.Vector3())
scene.add(rectareaLight)

const spotLight = new THREE.SpotLight(0x00ff00 , 0.5 , 6 , Math.PI * 0.1 ,0.25 ,1);
spotLight.position.set(1,1,1)
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
