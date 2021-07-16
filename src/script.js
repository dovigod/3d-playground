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
const gradTexture = loader.load('/gradien/3.jpg')
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


// const material = new THREE.MeshBasicMaterial()
// material.map = colorTexture
// material.transparent = true;
// material.alphaMap = alphaTexture
// // material.side = THREE.BackSide
// material.side = THREE.DoubleSide 

// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true // new feature of normal material

const material = new THREE.MeshMatcapMaterial()
material.matcap = matTexture
//will pick color inside texture and make it as normal
//이용하면 카메라를 어디로 돌리든 같은 걸 볼수있으 
//can make light similar without light

const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(.5,16,16), material);

const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(1,1) , material
)
const torus = new THREE.Mesh(
	new THREE.TorusGeometry(.5,.2,16,32),
	material
)

sphere.position.x = -1.5
torus.position.x = 1.5

scene.add(sphere , plane , torus);

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
