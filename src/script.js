import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();

//textures 
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load('/matcaps/8.png')
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
			curveSegments: 5,
			bevelEnabled: true,
			bevelThickness : 0.001, // 뽈록이, 많을수록 튀어나와
			bevelSize: 0.02, 
			bevelOffset: 0,
			bevelSegments: 1,	 // 테두리.. 많을수록 둥글어
		}
	)
	// going to use bouning for frustum culling to let three.js caclulate geometries easily
	textGeometry.computeBoundingBox()
	//make Box3-> coordinates of box ,  

	textGeometry.translate(
		-((textGeometry.boundingBox.max.x-0.02) * 0.5), // bevel size
		-((textGeometry.boundingBox.max.y-0.02) * 0.5), // bevelsize
		-((textGeometry.boundingBox.max.z-0.03 )* 0.5)  //bevelthickness
	)

	textGeometry.computeBoundingBox()
	//re computejust use below!!!!!!

	// textGeometry.center()

	//actually , 
	
	const textMaterial = new THREE.MeshMatcapMaterial({
		matcap : matcapTexture
	})
	const text = new THREE.Mesh(textGeometry, textMaterial)
	
	scene.add(text);
	console.log('font loaded!')

	


	
})
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



//donuts100 ; 

//method 1

console.time('donut')
const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2 , 20 , 45);
	const donutMateral = new THREE.MeshMatcapMaterial({
		matcap : matcapTexture
	});
for(let i = 0 ; i < 100 ; i ++){
	
	const donut = new THREE.Mesh(donutGeometry , donutMateral)

	donut.position.x = (Math.random() -0.5 )* 100 // normalize value !! usef!!
	donut.position.y = (Math.random() -0.5 )* 100
	donut.position.z = (Math.random() -0.5 )* 100


	donut.rotation.x = Math.random() * Math.PI
	donut.rotation.y = Math.random() * Math.PI
	donut.rotation.z = Math.random() * Math.PI

	const scale = (Math.random()+1)*4

	donut.scale.x =scale;
	donut.scale.y =scale;
	donut.scale.z =scale;

	scene.add(donut)

	
}
console.timeEnd('donut')
// 76ms ..  -> 322ms , 

//use meshes , when making same multiple mesh , 



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
