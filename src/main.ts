import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('.canvas') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

const cubeLoader = new THREE.CubeTextureLoader();

const envMap = cubeLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg'
])

grassColorTexture.repeat.set(10, 10)
grassAmbientOcclusionTexture.repeat.set(10, 10)
grassNormalTexture.repeat.set(10, 10)
grassRoughnessTexture.repeat.set(10, 10)


grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
    aoMap: bricksAmbientOcclusionTexture
  }))

walls.geometry.setAttribute('uv2', new THREE.BufferAttribute(walls.geometry.attributes.uv.array, 2))
house.add(walls)
walls.position.y = 1.28

const roof = new THREE.Mesh(new THREE.ConeGeometry(3.2, 1, 4),
  new THREE.MeshStandardMaterial({
    color: '#b35f45'
  }))
house.add(roof)
roof.position.y = 2.5 + 0.5
roof.rotation.y = Math.PI * 0.25

house.castShadow = true


const door = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshPhysicalMaterial({
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,
  normalMap: doorNormalTexture,
  displacementMap: doorHeightTexture,
  displacementScale: 0.1,
  aoMap: doorAmbientOcclusionTexture,
  roughnessMap: doorRoughnessTexture,
  metalnessMap: doorMetalnessTexture,
  transparent: true
}))
house.add(door)
door.position.y = 0.9
door.position.z = 2 + 0.01
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

const houseWindow = new THREE.Group()
house.add(houseWindow)
houseWindow.position.set(1.3, 1.8, 1.95)

const windowDivider1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0), new THREE.MeshStandardMaterial({
  color: '#000000'
}))
houseWindow.add(windowDivider1)
windowDivider1.position.set(0.01, 0, 0.15)

const windowDivider2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0), new THREE.MeshStandardMaterial({
  color: '#000000'
}))
houseWindow.add(windowDivider2)
windowDivider2.position.set(0.01, 0, 0.15)



const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.2, 1, 1, 3), new THREE.MeshStandardMaterial({
  envMap: envMap,
  roughness: 0,
  metalness: 1
}))
gui.add(windowFrame.material, 'metalness', 0, 1, 0.0001)
gui.add(windowFrame.material, 'roughness', 0, 1, 0.0001)
houseWindow.add(windowFrame)

// grass

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    roughnessMap: grassRoughnessTexture,
    normalMap: grassNormalTexture
  })
)
floor.receiveShadow = true;
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)


// Graves 
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.45, 0.6, 0.1)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#727272' })

for (let i = 0; i < 100; i++) {

  const radius = 4 + Math.random() * 6
  const angle = Math.random() * Math.PI * 2;

  const graveMesh = new THREE.Mesh(graveGeometry, graveMaterial)
  graveMesh.position.x = Math.cos(angle) * radius
  graveMesh.position.z = Math.sin(angle) * radius
  graveMesh.position.y = 0.3

  graveMesh.rotation.z = (Math.random() - 0.5) * 0.4
  graveMesh.rotation.y = (Math.random() - 0.5) * 0.4

  graves.add(graveMesh)

  graveMesh.castShadow = true
}
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 1)
moonLight.position.set(4, 0.3, - 2)
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)
moonLight.castShadow = true


// Bulb
// const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.1), new THREE.MeshStandardMaterial({ color: '#ff7d46' }))
// house.add(bulb)
// bulb.position.set(0, 2.5, 2)
// pointLight
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.3, 2.5)
doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7
house.add(doorLight);



const fog = new THREE.Fog('#262837', 1, 14);
scene.fog = fog;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.x = 4
camera.position.y = 6
camera.position.z = 9
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
renderer.setClearColor('#262837')
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true

/**
 * Animate
 */
// const clock = new THREE.Clock()

const tick = () => {
  // const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()