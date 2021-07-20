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

//for enviornment mapping

const cubeLoader = new THREE.CubeTextureLoader();

const enviornmentTexture = cubeLoader.load([
'/environmentMaps/htrTexture/px.png',
'/environmentMaps/htrTexture/nx.png',
'/environmentMaps/htrTexture/py.png',
'/environmentMaps/htrTexture/ny.png',
'/environmentMaps/htrTexture/pz.png',
'/environmentMaps/htrTexture/nz.png'])

//need 6 parameter for up down right left forward back

const gui = new dat.GUI();
gui.hide();
 
const meshParams = {
	color: '#ffffff',
	spin: () => {
		gsap.to(plane.rotation, { duration: 1, y: plane.rotation.y + Math.PI * 2 });
		gsap.to(sphere.rotation, { duration: 1, y: sphere.rotation.y + Math.PI * 2 });
		gsap.to(torus.rotation, { duration: 1, y: torus.rotation.y + Math.PI * 2 });
	}
};
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
};

const scene = new THREE.Scene();

//object


const material = new THREE.MeshStandardMaterial();

material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = enviornmentTexture
// env reflection on material can be seen


//three.js only supports cube map



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


gui.add(meshParams , 'spin')



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
