import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';


//textures 
const loader = new THREE.TextureLoader()

const colorTexture = loader.load('/textures/door/color.jpg');
const alphaTexture = loader.load('/textures/door/alpha.jpg');
const heightTexture = loader.load('/textures/door/height.jpg');
const normalTexture = loader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = loader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = loader.load('/textures/door/metalness.jpg');
const roughnessTexture = loader.load('/textures/door/roughness.jpg');
const gradTexture = loader.load('/gradients/3.jpg')
const matTexture = loader.load('/matcaps/8.png')

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

const scene = new THREE.Scene();

//object


const material = new THREE.MeshStandardMaterial();
// more realistic , + metalness added , roughness added
// material.roughness =0.45
// material.metalness = .55
material.map = colorTexture

material.aoMap = ambientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap = heightTexture
material.displacementScale = 0.05
material.metalnessMap = metalnessTexture
material.roughnessMap = roughnessTexture
material.normalMap = normalTexture
material.normalScale.set(0.5,1.5)
// details!!

//metal . rogugh attributes will be combined with maps so disable it

//plane -> no effect -> not enough vertices
//1. adding more subdivision

material.alphaMap = alphaTexture
material.transparent = true


gui.add(material , 'displacementScale' , 0, 1 , 0.0001)
gui.add(material , 'aoMapIntensity' , 0 , 10, 0.01)
gui.add(material , 'wireframe')




const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(.5,16,16), material, 64 ,64);

	sphere.geometry.setAttribute('uv2' , new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));


const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(1,1 ,100,100) , material
)

plane.geometry.setAttribute('uv2' , new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));



const torus = new THREE.Mesh(
	new THREE.TorusGeometry(.5,.2,64,128),
	material
)

torus.geometry.setAttribute('uv2' , new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));


sphere.geometry.setAttribute('uv2' , new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));


sphere.position.x = -1.5
torus.position.x = 1.5

scene.add(sphere , plane , torus);




//lights

const ambientLight = new THREE.AmbientLight(0xffffff , 0.5)
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 2);

scene.add(camera);

//renderer

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


//debug

const materialFolder = gui.addFolder('material')
materialFolder.add(material , 'metalness', 0 , 1 , 0.01)
materialFolder.add(material , 'roughness', 0 , 1 , 0.01)
materialFolder.addColor(meshParams, 'color').onChange( () =>{
	material.color.set(meshParams.color)
})
materialFolder.add(material ,'transparent')
materialFolder.add(material , 'opacity' , 0 , 1 , 0.01)
materialFolder.add(material , 'wireframe');
materialFolder.add(material , 'flatShading')



//controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // friction
controls.target.y = 1;
controls.update();

const clock = new THREE.Clock();


const animate = () => {

	const elapsedTime = clock.getElapsedTime();


	sphere.rotation.y =  0.3 * elapsedTime;
	plane.rotation.y = 0.3 * elapsedTime;
	torus.rotation.y = 0.3 * elapsedTime;

	sphere.rotation.x =  0.45 * elapsedTime;
	plane.rotation.x = 0.45 * elapsedTime;
	torus.rotation.x = .45 * elapsedTime;

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
