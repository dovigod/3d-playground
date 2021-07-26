import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/particles/2.png')

//particle
const particleGeometry = new THREE.BufferGeometry()
const count = 50000

const vertices = new Float32Array(count * 3)
for(let i = 0 ; i < count * 3 ; i ++){
	vertices[i] = (Math.random()- 0.5) * 10
}
particleGeometry.setAttribute('position' , new THREE.BufferAttribute(vertices , 3))
const particleMaterial = new THREE.PointsMaterial({
	size: 0.02,
	sizeAttenuation: true, // if particle is far , small , near =-> big // get small dots, regardless of distance
	color: '#ff99cc',
	transparent: true,
	alphaMap: particleTexture, // hide edges, working , but still bug caused by drawing order of webgl
	// alphaTest: 0.001, //initially, webgl draw the texture, so, say to gpu not to draw anything
	// //mostly fixed, but on edge, still bug
	// depthTest:false // front -> draw , back -> dont draw // but may cause errors , if color different -> combination occur
	depthWrite: false
})
const particles = new THREE.Points(particleGeometry , particleMaterial)
scene.add(particles)

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