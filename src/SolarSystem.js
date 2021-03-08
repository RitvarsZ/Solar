import { createTimeOfInterest } from 'astronomy-bundle/time';
import { createMoon } from 'astronomy-bundle/moon';
import { createEarth } from 'astronomy-bundle/earth';
import { createSun } from 'astronomy-bundle/sun';
import { createVenus, createMercury, createMars, createJupiter, createSaturn, createUranus, createNeptune } from 'astronomy-bundle/planets';
import { Mesh, SphereGeometry, MeshBasicMaterial } from 'three';
import Planet from './Planet';

export default class SolarSystem {   
    constructor (timeOfInterest = new Date(), planetConfigs) {
        this.timeOfInterest = createTimeOfInterest.fromDate(timeOfInterest);
        this.planets = [];

        // Initialize sun
        this.sun = new Mesh(
            new SphereGeometry(40, 40, 40),
            new MeshBasicMaterial({color: 0xffff00})
        );

        // Initialize planets
        planetConfigs.forEach(planet => {
            this.planets.push(new Planet({ ... planet }, this.timeOfInterest));
        });
    }

    setTimeOfInterest(timeOfInterest) {
        this.timeOfInterest = createTimeOfInterest.fromDate(timeOfInterest);
    }

    updatePlanetaryPositions() {
        this.planets.forEach(planet => {
            planet.updateObjectPositions(this.timeOfInterest);
        });
    }
}
