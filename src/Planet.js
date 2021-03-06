import AstroPlanet from 'astronomy-bundle/planets/Planet';
import { SphereGeometry, PointLight } from 'three';

export default class Planet {
    /**
     * 
     * @param {String} name 
     * @param {AstroPlanet} object 
     * @param {SphereGeometry} sphere 
     * @param {Number} eccentricity 
     */
    constructor(name, object, sphere, eccentricity) {
        this.name = name;
        this.object = object;
        this.sphere = sphere;
        this.eccentricity = eccentricity;
        this.updatePos();
    }

    async updatePos() {
        const coords = await this.object.getHeliocentricEclipticRectangularDateCoordinates()

        this.sphere.position.set(coords.x * 500, coords.z * 500, coords.y * 500);
    }
}
