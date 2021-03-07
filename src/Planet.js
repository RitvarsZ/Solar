import { spherical2rectangular, rectangular2spherical} from 'astronomy-bundle/utils/coordinateCalc';
import { SphereGeometry, RingGeometry, MeshBasicMaterial, Mesh, DoubleSide, Vector3 } from 'three';
import { makeTextSprite } from './Helper';
import { gsap, TimelineMax, Expo } from "gsap";
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Moon from './Moon';

gsap.registerPlugin(MotionPathPlugin);

export default class Planet {

    constructor({ color, distanceToSun, name, objectFun, size, moons }, timeOfInterest) {
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
            timelinePlanets.to(this.sphere.position, {
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
