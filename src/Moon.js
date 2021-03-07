import { spherical2rectangular } from 'astronomy-bundle/utils/coordinateCalc';
import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three';

export default class Moon {

    constructor({ color, distanceToPlanet, name, objectFun, size }, timeOfInterest = new Date()) {
        this.color = color;
        this.distanceToPlanet = distanceToPlanet;
        this.name = name;
        this.objectFun = objectFun;
        this.size = size;

        // Initialize sphere and orbit
        this.sphere = new Mesh(
            new SphereGeometry(this.size, 7, 7),
            new MeshBasicMaterial({ color: color })
        );
    }

    async updateObjectPositions(timeOfInterest, geoCenterPosition) {
        const moonObject = this.objectFun(timeOfInterest);

        await moonObject.getGeocentricEclipticSphericalDateCoordinates().then(res => {
            const relativePosition = spherical2rectangular({
                lat: res.lat,
                lon: res.lon,
                radiusVector: this.distanceToPlanet
            });

            const realPosition = {
                x: geoCenterPosition.x + relativePosition.x,
                y: geoCenterPosition.y + relativePosition.y,
                z: geoCenterPosition.z + relativePosition.z,
            };

            

            this.sphere.position.set(realPosition.x, realPosition.y, realPosition.z);
        });
    }


}
