import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}


// ============================================================================================
let isWireframeEnabled = false; // Flag that determines whether the wireframe should be enabled or not.
let materialsList = []; // Holds all the materials in the scene to support wireframe toggling on and off.

// This function toggles the wireframe view for all the objects in the scene
let toggleWireframe = (e) => {
	if (e.key == "w") {
		console.log("Toggling wireframe")
		isWireframeEnabled = !isWireframeEnabled
		for (let material of materialsList) {
			material.wireframe = isWireframeEnabled
		}
	}
}

// A wrapper function to make sure that all of the mateirals that are being created 
// for this scene, will be stored in materialsList variable to support wireframe toggling.
const createMaterial = (material) => {
	materialsList.push(material)
	return material;
}

const spaceship = new THREE.Group();

// Constant geometries sizes
const sizes = {}
sizes.hullRadius = 0.5; // TODO: CHANGE TO REAL VALUE
sizes.hullLength = 3 * sizes.hullRadius

sizes.headRadius = sizes.hullRadius 
sizes.headLength = 2 * sizes.hullRadius

sizes.shipSize = 1; // TODO: CHANGE TO REAL VALUE
sizes.planetSize = 5 * sizes.shipSize

// Add here the rendering of your spaceship
// Ship's Hull (Cylinder)
const hull = {}
hull.color = 0x049ef4 // TODO: CHANGE !!!
hull.material = createMaterial(new THREE.MeshBasicMaterial({color: hull.color}))
hull.geometry = new THREE.CylinderGeometry(sizes.hullRadius, sizes.hullRadius, sizes.hullLength)
hull.mesh = new THREE.Mesh(hull.geometry, hull.material)
spaceship.add(hull.mesh)

// Ship's Head (Cone)
const head = {}
head.color = 0xd10000;
head.material = createMaterial(new THREE.MeshBasicMaterial({color: head.color}))
head.geometry = new THREE.ConeGeometry(sizes.headRadius, sizes.headLength)
head.mesh = new THREE.Mesh(head.geometry, head.material)
const moveHeadMat = new THREE.Matrix4()
moveHeadMat.makeTranslation(0,1.25,0)
spaceship.add(head.mesh)
head.mesh.applyMatrix4(moveHeadMat)


// Ship's wings (Two-sided mesh plane)
const wings = new THREE.Group()
const wing = {}
wing.color = 0x254d65;
wing.height = 1;
wing.width = 0.5;
wing.material = createMaterial(new THREE.MeshBasicMaterial({color: wing.color}))
wing.geometry = new THREE.PlaneGeometry(wing.height, wing.width)
wing.material.side = THREE.DoubleSide

// First wing
wing.mesh = new THREE.Mesh(wing.geometry, wing.material) 
wings.add(wing.mesh)

// Second wing 
wing.mesh = new THREE.Mesh(wing.geometry, wing.material) 
wings.add(wing.mesh)
const rotateWingMat = new THREE.Matrix4();
rotateWingMat.makeRotationY(degrees_to_radians(120));
wing.mesh.applyMatrix4(rotateWingMat);

// Third wing
wing.mesh = new THREE.Mesh(wing.geometry, wing.material) 
wings.add(wing.mesh)
rotateWingMat.makeRotationY(degrees_to_radians(240));
wing.mesh.applyMatrix4(rotateWingMat);

hull.mesh.add(wings)
const moveWingsMat = new THREE.Matrix4()
moveWingsMat.makeTranslation(0, -1, 0)
wings.applyMatrix4(moveWingsMat)

// Ship's windows (Rings)
const shipWindows = new THREE.Group()
const shipWindow = {}
shipWindow.color = 0xffff00;
shipWindow.material = createMaterial(new THREE.MeshBasicMaterial({color: shipWindow.color}))
shipWindow.geometry = new THREE.RingGeometry(0.05, 0.15, 30)

// First Window
shipWindow.mesh = new THREE.Mesh(shipWindow.geometry, shipWindow.material)
shipWindows.add(shipWindow.mesh)

// Second Window
shipWindow.mesh = new THREE.Mesh(shipWindow.geometry, shipWindow.material)
shipWindows.add(shipWindow.mesh)

// Move second window to be next to the first one
const moveWindowMat = new THREE.Matrix4();
moveWindowMat.makeTranslation(0,0.4,0);
shipWindow.mesh.applyMatrix4(moveWindowMat);

// Move all windows to be on the ship's hull
const moveAllWindowsMat = new THREE.Matrix4();
moveAllWindowsMat.makeTranslation(0,0,sizes.hullRadius);
shipWindows.applyMatrix4(moveAllWindowsMat);

hull.mesh.add(shipWindows)

scene.add(spaceship)

// Planet (Sphere)
const planet = {}
planet.color = 0x04f6ba;
planet.material = createMaterial(new THREE.MeshBasicMaterial({color: planet.color}))
planet.geometry = new THREE.SphereGeometry(1, 64, 32)
planet.mesh = new THREE.Mesh(planet.geometry, planet.material)
const movePlanetMat = new THREE.Matrix4()
movePlanetMat.makeTranslation(-2, 0 , 0)
planet.mesh.applyMatrix4(movePlanetMat)
scene.add(planet.mesh)

// ============================================================================================

// This defines the initial distance of the camera
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0,0,5);
camera.applyMatrix4(cameraTranslate)

renderer.render( scene, camera );

const controls = new OrbitControls( camera, renderer.domElement );

let isOrbitEnabled = true; 

const toggleOrbit = (e) => {
	if (e.key == "o"){
		isOrbitEnabled = !isOrbitEnabled;
	}
}



document.addEventListener('keydown',toggleOrbit)
document.addEventListener('keydown',toggleWireframe)

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function animate() {

	requestAnimationFrame( animate );

	controls.enabled = isOrbitEnabled;
	controls.update();

	renderer.render( scene, camera );

}
animate()