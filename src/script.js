import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();

//Red Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
	color: 0xff0000
});

const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 2;
// ===> mesh.position.set(0.7, -.6, 2);
//inherited from Vector3

//ordering rotation order
mesh.rotation.reorder('YXZ');
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;

mesh.scale.set(2, 2, 2);

scene.add(mesh);

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//Camera
const sizes = {
	width: 800,
	height: 600
};
// 시야각 = fov 망원경 vs 전체 , aspect Ratio  width / height of viewPort
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height);
camera.position.set(1, 1, 10);

//target is Vector3
camera.lookAt(mesh.position); // will look at the center of mesh

scene.add(camera);

//renderer
//render scene from the camera point
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
});

// renderer의 사이즈를 정함

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
