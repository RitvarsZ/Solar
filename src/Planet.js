import { spherical2rectangular } from 'astronomy-bundle/utils/coordinateCalc';
import { SphereGeometry, RingGeometry, MeshBasicMaterial, Mesh, DoubleSide, EdgesGeometry, LineBasicMaterial, LineSegments } from 'three';
import Moon from './Moon';
import { makeTextSprite } from './Helper';

export default class Planet {

    constructor({ color, distanceToSun, name, objectFun, size, moons }, timeOfInterest) {
        this.color = color;
        this.distanceToSun = distanceToSun;
        this.name = name;
        this.objectFun = objectFun;
        this.size = size;

        // Initialize sphere and orbit
        this.sphere = new Mesh(
            new SphereGeometry(this.size, 7, 7),
            new MeshBasicMaterial({ color: color })
        );
        
        this.orbit = new Mesh(
            new RingGeometry(this.distanceToSun - 1, this.distanceToSun, 512),
            new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide })
        );

        // Initialize moons
        this.moons = [];
        moons.forEach(moon => {
            this.moons.push(new Moon(moon, timeOfInterest));
        });

        // Make label
        this.label = makeTextSprite(this.name, { fontSize: 48, backgroundColor: { r:255, g:255, b:255, a:1 }});

        this.updateObjectPositions(timeOfInterest);
    }

    async updateObjectPositions(timeOfInterest) {
        const planetObject = this.objectFun(timeOfInterest);

        await planetObject.getHeliocentricEclipticSphericalJ2000Coordinates().then(res => {
            const position = spherical2rectangular({
                lat: 0,
                lon: res.lon,
                radiusVector: this.distanceToSun
            });

            this.sphere.position.set(position.x, position.y, position.z);
            this.label.position.set(position.x + this.size, position.y  + this.size, position.z + this.size);
            // Update moon positions
            this.moons.forEach(moon => {
                moon.updateObjectPositions(timeOfInterest, position);
            });
        });
    }


}
