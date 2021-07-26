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
	size : 0.02
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
	for( let i = 0 ; i < parameters.count ; i ++){
		const i3 = i*3
		positions[i3] = (Math.random() - 0.5) * 3
		positions[i3+1] = (Math.random() - 0.5) * 3
		positions[i3+2] = (Math.random() - 0.5) * 3
	}
	particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

	// material
	particlesMaterial = new THREE.PointsMaterial({
		size: parameters.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
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