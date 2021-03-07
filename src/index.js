import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { WEBGL } from './WEBGL';
import SolarSystem from './SolarSystem';
import { planetConfigs } from './planetsConfigs';
import { CompressedPixelFormat } from 'three';

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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const controls = new OrbitControls(camera, renderer.domElement);

    camera.position.set(0, -900, 500);
    camera.layers.enable(1);
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();
    });

    // Initialize solar system.
    let time = new Date();
    const solarSystem = new SolarSystem(time, planetConfigs);

    solarSystem.sun.layers.enable(1);
    scene.add(solarSystem.sun);

    solarSystem.planets.forEach(planet => {
        planet.sphere.layers.enable(1);
        planet.orbit.layers.enable(1);
        scene.add(planet.sphere);
        scene.add(planet.orbit);

        planet.label.layers.enable(2);
        scene.add(planet.label);

        planet.moons.forEach(moon => {
            moon.sphere.layers.enable(1);
            scene.add(moon.sphere);
        })
    })

    // COMPOSER
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        params.bloomStrength,
        params.bloomRadius,
        params.bloomThreshold
    );
    
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    const animate = () => {
        requestAnimationFrame(animate);
        
        time.setHours(time.getHours() + 1);
        solarSystem.setTimeOfInterest(time);
        solarSystem.updatePlanetaryPositions();

        controls.update();

        renderer.autoClear = false;
        renderer.clear();
  
        camera.layers.set(1);
        composer.render();
        
        renderer.clearDepth();
        camera.layers.set(2);
        renderer.render(scene, camera);
    };

    animate();

    return renderer.domElement;
};
