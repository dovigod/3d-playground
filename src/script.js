import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

//fonts

const fontLoader = new THREE.FontLoader();
//use callback in param
fontLoader.load('/fonts/helvetiker_regular.typeface.json' , (font) =>{
	const textGeometry = new THREE.TextBufferGeometry(
		'Hello From Jisang',
		{
			font,
			size: 0.5,
			height:0.2, //depth of font
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness : 0.03,
			bevelSize: 0.02,
			bevelOffset: 0,
			bevelSegments: 5

		}
	)
	//bevel => round the font , text

	const textMaterial = new THREE.MeshBasicMaterial()
	const text = new THREE.Mesh(textGeometry, textMaterial)
	gui.add(textMaterial , 'wireframe')
	scene.add(text);
	console.log('font loaded!')
})

//textures 
const textureLoader = new THREE.TextureLoader()

//for enviornment mapping

const cubeLoader = new THREE.CubeTextureLoader();

const gui = new dat.GUI();
gui.hide();
 
const meshParams = {
	color: '#ffffff',
};
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
};

const scene = new THREE.Scene();




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



//controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // friction
controls.target.y = 1;
controls.update();

const clock = new THREE.Clock();


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

eventListeners();
animate();
