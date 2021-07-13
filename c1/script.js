//Scene

window.onload = () => {
	const scene = new THREE.Scene();

	//Red Cube
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({
		color: 0xff0000
	});

	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	//Camera
	const sizes = {
		width: 800,
		height: 600
	};
	// 시야각 = fov 망원경 vs 전체 , aspect Ratio  width / height of viewPort
	const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height);
	camera.position.z = 3;

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
};
