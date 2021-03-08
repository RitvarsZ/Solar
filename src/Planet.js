import { spherical2rectangular, rectangular2spherical} from 'astronomy-bundle/utils/coordinateCalc';
import { SphereGeometry, RingGeometry, MeshBasicMaterial, Mesh, DoubleSide, Vector3 } from 'three';
import { makeTextSprite } from './Helper';
import { gsap, TimelineMax, Expo } from "gsap";
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Moon from './Moon';

gsap.registerPlugin(MotionPathPlugin);

export default class Planet {

    constructor({ color, distanceToSun, name, objectFun, size, moons, rings = false }, timeOfInterest) {
        this.color = color;
        this.distanceToSun = distanceToSun;
        this.name = name;
        this.objectFun = objectFun;
        this.size = size;
        this.angle = 0;

        // Initialize sphere and orbit
        const initialPos = spherical2rectangular({lat: 0, lon: this.angle, radiusVector: this.distanceToSun})
        this.sphere = new Mesh(
            new SphereGeometry(this.size, 7, 7),
            new MeshBasicMaterial({ color: color })
        );
        this.sphere.position.set(initialPos.x, initialPos.y, initialPos.z);

        this.orbit = new Mesh(
            new RingGeometry(this.distanceToSun - 5, this.distanceToSun, 512),
            new MeshBasicMaterial({ color: 0x777777, side: DoubleSide })
        );

        // Initialize moons
        this.moons = [];
        moons.forEach(moon => {
            this.moons.push(new Moon(moon, timeOfInterest));
        });

        // Add rings if enabled
        this.rings = false;
        if (rings) {
            this.rings = new Mesh(
                new RingGeometry(this.size + 10, this.size + 25, 32),
                new MeshBasicMaterial({ color: 0x585834, side: DoubleSide })
            );
            this.rings.rotation.y = 0.2;
            this.rings.rotation.x = 0.2;
            this.rings.position.set(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z);
            console.log(this.rings.position);
            console.log(this.sphere.position)
        }

        // Make label
        this.label = makeTextSprite(this.name, { fontSize: 48, backgroundColor: { r:255, g:255, b:255, a:1 }});

        this.updateObjectPositions(timeOfInterest);

    }

    async updateObjectPositions(timeOfInterest) {
        const planetObject = this.objectFun(timeOfInterest);

        await planetObject.getHeliocentricEclipticSphericalJ2000Coordinates().then(res => {
            const endPosition = spherical2rectangular({
                lat: 0,
                lon: res.lon,
                radiusVector: this.distanceToSun
            });
            
            const startPosSpherical = rectangular2spherical(this.sphere.position);
            
            const midPointDeg = () => {
                const startDeg = startPosSpherical.lon;
                const endDeg = res.lon;

                const x1 = Math.abs(endDeg - startDeg);
                const x2 = 360 - x1;

                if (x1 > x2) {
                    if (startDeg > endDeg) {
                        return (startDeg + (x2 / 2)) % 360;
                    } else {
                        return (startDeg - (x2 / 2)) % 360;
                    }
                } else {
                    if (startDeg > endDeg) {
                        return (startDeg - (x1 / 2)) % 360;
                    } else {
                        return (startDeg + (x1 / 2)) % 360;
                    }
                }
            }
            
            const midPointCoords = spherical2rectangular({
                lat: 0,
                lon: midPointDeg(),
                radiusVector: this.distanceToSun
            });

            const timelinePlanets = new TimelineMax();
            timelinePlanets.to([this.sphere.position, this.rings.position], {
                motionPath: {
                    path: [{ ...this.sphere.position }, { ...midPointCoords }, { ...endPosition }],
                    type: "cube"
                },
                ease: Expo.easeOut,
                duration: 1
            });
            const timelineLabels = new TimelineMax();
            timelineLabels.to(this.label.position, {
                motionPath: {
                    path: [
                        { ...this.label.position },
                        { x: midPointCoords.x + this.size, y: midPointCoords.y + this.size, z: midPointCoords.z + this.size },
                        { x: endPosition.x + this.size, y: endPosition.y + this.size, z: endPosition.z + this.size }
                    ],
                    type: "cube"
                },
                ease: Expo.easeOut,
                duration: 1
            });

            // Update moon endPositions
            this.moons.forEach(moon => {
                moon.updateObjectPositions(timeOfInterest, endPosition);
            });
        });
    }
}
