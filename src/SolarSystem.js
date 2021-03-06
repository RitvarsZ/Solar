import { createTimeOfInterest } from 'astronomy-bundle/time';
import { createMoon } from 'astronomy-bundle/moon';
import { createEarth } from 'astronomy-bundle/earth';
import { createSun } from 'astronomy-bundle/sun';
import { createVenus, createMercury, createMars, createJupiter, createSaturn, createUranus, createNeptune } from 'astronomy-bundle/planets';
import { Mesh, SphereGeometry, MeshBasicMaterial } from 'three';
import Planet from './Planet';

export default class SolarSystem {   
    constructor () {
        this.time = new Date()
        this.planets = [
            new Planet(
                'sun',
                createSun(createTimeOfInterest.fromDate(this.time)),
                new Mesh(new SphereGeometry(40, 7, 7), new MeshBasicMaterial({color: 0xffff00})),
                1
            ),
            new Planet(
                'earth',
                createEarth(createTimeOfInterest.fromDate(this.time)),
                new Mesh(new SphereGeometry(20, 7, 7), new MeshBasicMaterial({color: 0x4285F4})),
                0.0167086
            ),
            new Planet(
                'moon',
                createMoon(createTimeOfInterest.fromDate(this.time)),
                new Mesh(new SphereGeometry(5, 6, 6), new MeshBasicMaterial({color: 0xFFFFFF})),
                0.0549
            ),
            new Planet(
                'venus',
                createVenus(createTimeOfInterest.fromDate(this.time)),
                new Mesh(new SphereGeometry(20, 6, 6), new MeshBasicMaterial({color: 0xC480A7})),
                0.006772
            ),
            new Planet(
                'mercury',
                createMercury(createTimeOfInterest.fromDate(this.time)),
                new Mesh(new SphereGeometry(20, 6, 6), new MeshBasicMaterial({color: 0xD59C35})),
                0.205630
            ),
            new Planet(
                'mars',
                createMars(createTimeOfInterest.fromDate(this.time)),
                new Mesh(new SphereGeometry(20, 6, 6), new MeshBasicMaterial({color: 0xA33818})),
                0.0934
            ),
            new Planet(
                'jupiter',
                createJupiter(createTimeOfInterest.fromDate(this.time)),
                new Mesh(new SphereGeometry(20, 6, 6), new MeshBasicMaterial({color: 0x8C9AA9})),
                0.0489
            ),
            new Planet(
                'saturn',
                createSaturn(createTimeOfInterest.fromDate(this.time)),
                new Mesh(new SphereGeometry(20, 6, 6), new MeshBasicMaterial({color: 0xC3BFA8})),
                0.0565
            ),
            new Planet(
                'uranus',
                createUranus(createTimeOfInterest.fromDate(this.time)),
                new Mesh(new SphereGeometry(20, 6, 6), new MeshBasicMaterial({color: 0xAFD6DB})),
                0.046381
            ),
            new Planet(
                'neptune',
                createNeptune(createTimeOfInterest.fromDate(this.time)),
                new Mesh(new SphereGeometry(20, 6, 6), new MeshBasicMaterial({color: 0x4F7BE0})),
                0.008678
            ),
        ];
    }

    updatePlanetObjects() {
        this.planets.forEach(planet => {
            switch (planet.name) {
                case 'sun':
                    planet.object = createSun(createTimeOfInterest.fromDate(this.time));
                    break;
                case 'earth':
                    planet.object = createEarth(createTimeOfInterest.fromDate(this.time));
                    break;
                case 'moon':
                    planet.object = createMoon(createTimeOfInterest.fromDate(this.time));
                    break;
                case 'venus':
                    planet.object = createVenus(createTimeOfInterest.fromDate(this.time));
                    break;
                case 'mercury':
                    planet.object = createMercury(createTimeOfInterest.fromDate(this.time));
                    break;
                case 'mars':
                    planet.object = createMars(createTimeOfInterest.fromDate(this.time));
                    break;
                case 'jupiter':
                    planet.object = createJupiter(createTimeOfInterest.fromDate(this.time));
                    break;
                case 'saturn':
                    planet.object = createSaturn(createTimeOfInterest.fromDate(this.time));
                    break;
                case 'uranus':
                    planet.object = createUranus(createTimeOfInterest.fromDate(this.time));
                    break;
                case 'neptune':
                    planet.object = createNeptune(createTimeOfInterest.fromDate(this.time));
                    break;
            }

            planet.updatePos();
        });
    }
}
