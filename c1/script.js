//Scene
const scene = new THREE.Scene();

//Red Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
	color: '#ff0000'
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Camera
const sizes = {
	width: 800,
	height: 600
};
// 시야각 = fov 망원경 vs 전체 , aspect Ratio  width / height of viewPort
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
scene.add(camera);

//renderer
//render scene from the camera point

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('canvas')
});
