import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { WEBGL } from './WEBGL';
import SolarSystem from './SolarSystem';

if (WEBGL.isWebGLAvailable()) {
	// Initiate function or other initializations here
	document.body.appendChild(main());
} else {
	const warning = WEBGL.getWebGLErrorMessage();
	document.body.appendChild(warning);
}

function main() {
    const params = {
        exposure: 1.5,
        bloomStrength: 1.8,
        bloomThreshold: 0,
        bloomRadius: 1
    };
    const far = 50000;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, far);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const controls = new OrbitControls(camera, renderer.domElement);

    const solarSystem = new SolarSystem();
    console.log(solarSystem)

    solarSystem.planets.forEach(planet => {
        scene.add(planet.sphere);
    });

    // const size = 10000;
    // const divisions = 100;
    // const gridHelper = new THREE.GridHelper( size, divisions ); scene.add( gridHelper );

    camera.position.y = -39;
    camera.position.y = -950;
    camera.position.z = 504;

    const composer = new EffectComposer( renderer );
    const renderPass = new RenderPass( scene, camera );
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    
    composer.addPass( renderPass );
    composer.addPass( bloomPass );
    

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();
    });

    const animate = () => {
        requestAnimationFrame(animate);
        
        solarSystem.time.setHours(solarSystem.time.getHours() + 1);
        solarSystem.updatePlanetObjects();

        document.getElementById('info').innerHTML = `${solarSystem.time}`;
        controls.update();
        composer.render();
    };

    animate();

    return renderer.domElement;
};
