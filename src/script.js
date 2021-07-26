import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
	width: 360
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//galaxy
const parameters = {
	count : 1000,
	size : 0.01,
	radius: 5,
	branch: 3,
	spin: 1,
	randomness : 0.2,
	randomnessPow : 3,
	insideColor: '#ff5588',
	outsideColor : '#8855ff'
}
let particlesGeometry = null
let particlesMaterial = null
let points = null
const generateGalaxy = () => {

	if(points !== null){
		particlesGeometry.dispose()
		particlesMaterial.dispose()
		scene.remove(points)
	}

	particlesGeometry = new THREE.BufferGeometry()
	const positions = new Float32Array(parameters.count * 3)
	const colors = new Float32Array(parameters.count * 3)

	//base color

	const colorInside = new THREE.Color(parameters.insideColor);
	const colorOutside = new THREE.Color(parameters.outsideColor);


	for( let i = 0 ; i < parameters.count ; i ++){
		const i3 = i*3

		//positions
		const radius = (Math.random()) * parameters.radius
		const branchesAngle = ((i % parameters.branch) / parameters.branch) * Math.PI * 2
		const spinAngle = radius * parameters.spin

		const randomX = Math.pow(( Math.random()) , parameters.randomnessPow)  * (Math.random() < 0.5 ? 1 : - 1)
		const randomY = Math.pow(( Math.random()) , parameters.randomnessPow) * (Math.random() < 0.5 ? 1 : - 1)
		const randomZ = Math.pow(( Math.random()) , parameters.randomnessPow) * (Math.random() < 0.5 ? 1 : - 1)

		positions[i3] = radius * Math.cos(branchesAngle + spinAngle) + randomX 
		positions[i3+1] = randomY
		positions[i3+2] = radius * Math.sin(branchesAngle + spinAngle) + randomZ

		//color
		const mixedColor = colorInside.clone()
		mixedColor.lerp(colorOutside , radius / parameters.radius)
		colors[i3 + 0] = mixedColor.r
		colors[i3 + 1] = mixedColor.g
		colors[i3 + 2] = mixedColor.b

	}
	particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

	
	//lerp

	colorInside.lerp(colorOutside , 0.5)

	// material
	particlesMaterial = new THREE.PointsMaterial({
		size: parameters.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true
	})
	points = new THREE.Points(particlesGeometry , particlesMaterial)
	scene.add(points)


}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//dat.gui
gui.add(parameters,'count' , 100 , 100000 , 10).onFinishChange(( )=> {
	generateGalaxy()
})
gui.add(parameters ,'size' , 0.001 , 0.1 , 0.001).onFinishChange(() => {
	generateGalaxy()
})
gui.add(parameters ,'radius' , 0.01 , 20 , 0.01).onFinishChange(() => {
	generateGalaxy()
})

gui.add(parameters ,'branch' , 3 , 10 , 1).onFinishChange(() => {
	generateGalaxy()
})

gui.add(parameters ,'spin' , -5 , 5 , 1).onFinishChange(() => {
	generateGalaxy()
})

gui.add(parameters ,'randomness' , 0, 20 , 0.01).onFinishChange(() => {
	generateGalaxy()
})
gui.add(parameters ,'randomnessPow' , 1, 10 , 0.001).onFinishChange(() => {
	generateGalaxy()
})
gui.addColor(parameters, 'insideColor')
gui.addColor(parameters, 'outsideColor')

//problem , we are generating new galaxy, but not destroying old ones

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

generateGalaxy()