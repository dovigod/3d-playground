import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();

const fontLoader = new THREE.FontLoader();
const textureLoader = new THREE.TextureLoader();
const backedShadow = textureLoader.load('/shadows/simpleShadow.jpg')

const gui = new dat.GUI()

//object

const material = new THREE.MeshStandardMaterial({
	color:0xffffff,
});
material.roughness = 0.4

const plane = new THREE.Mesh(new THREE.PlaneGeometry(6,6), new THREE.MeshStandardMaterial({
	color: 0xffffff
}));
plane.rotation.x= -Math.PI * 0.5
plane.position.y = -1
plane.receiveShadow = true


const sphere = new THREE.Mesh(new THREE.SphereGeometry(.5,16,16) , material)
sphere.castShadow = true
scene.add(plane);
scene.add(sphere);

const sphereShadow  = new THREE.Mesh(new THREE.PlaneGeometry(1.5 , 1.5),
new THREE.MeshBasicMaterial({
	color: 0x000000,
	alphaMap: backedShadow,
	transparent : true
}))
sphereShadow.rotation.x = -Math.PI * 0.5;
//sphereShadow.position.y = plane.position.y // z-fighting
sphereShadow.position.y = plane.position.y + 0.01


scene.add(sphereShadow)



//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
const directLight = new THREE.DirectionalLight(0xffffff , 0.3)
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

const spotLight = new THREE.SpotLight(0xffffff , 0.4 ,8, Math.PI * 0.2);
spotLight.position.set(2,2,0)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 2
spotLight.shadow.camera.far = 3.5
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.aspect = 1


const dLight = gui.addFolder('dLight')
dLight.add(directLight.position,'x',-5,5,0.001)
dLight.add(directLight.position,'y',-5,5,0.001)
dLight.add(directLight.position,'z',-5,5,0.001)
dLight.add(directLight, 'intensity', 0 , 1 ,0.001)

scene.add(directLight);


scene.add(ambientLight)
scene.add(spotLight)
scene.add(spotLight.target)

const slHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(slHelper)




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

renderer.shadowMap.enabled = false // essential to create shadowmap

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//control type algorithym
renderer.shadowMap.type = THREE.PCFSoftShadowMap // radius unsupport




//controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // friction
controls.target.y = 1;
controls.update();

const clock = new THREE.Clock();
const animate = () => {

	const elapsedTime = clock.getElapsedTime()
	//update Sphere
	sphere.position.x = Math.cos(elapsedTime)* 1.5
	sphere.position.z = Math.sin(elapsedTime)* 1.5
	sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
	//update Shadow
	sphereShadow.position.x = Math.cos(elapsedTime)* 1.5
	sphereShadow.position.z = Math.sin(elapsedTime)* 1.5
	sphereShadow.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.3
	



	
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
