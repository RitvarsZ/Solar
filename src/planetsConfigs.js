import { createEarth } from 'astronomy-bundle/earth';
import { createMoon } from 'astronomy-bundle/moon';
import { createVenus, createMercury, createMars, createJupiter, createSaturn, createUranus, createNeptune } from 'astronomy-bundle/planets';

export const planetConfigs = [
    {
        color: 0xD59C35,
        distanceToSun: 100,
        name: 'Mercury',
        objectFun: (toi) => createMercury(toi),
        size: 7,
        moons: []
    },
    {
        color: 0xC480A7,
        distanceToSun: 150,
        name: 'Venus',
        objectFun: (toi) => createVenus(toi),
        size: 13,
        moons: []
    },
    {
        color: 0x4285F4,
        distanceToSun: 200,
        name: 'Earth',
        objectFun: (toi) => createEarth(toi),
        size: 15,
        moons: [
            {
                color: 0xDAD9D7,
                distanceToPlanet: 20,
                name: 'Moon',
                objectFun: (toi) => createMoon(toi),
                size: 3
            }
        ]
    },
    {
        color: 0xA33818,
        distanceToSun: 250,
        name: 'Mars',
        objectFun: (toi) => createMars(toi),
        size: 13,
        moons: []
    },
    {
        color: 0x999534,
        distanceToSun: 320,
        name: 'Jupiter',
        objectFun: (toi) => createJupiter(toi),
        size: 25,
        moons: []
    },
    {
        color: 0xB16A10,
        distanceToSun: 390,
        name: 'Saturn',
        objectFun: (toi) => createSaturn(toi),
        size: 22,
        moons: [],
        rings: true
    },
    {
        color: 0x53A187,
        distanceToSun: 460,
        name: 'Uranus',
        objectFun: (toi) => createUranus(toi),
        size: 22,
        moons: []
    },
    {
        color: 0x4C508B,
        distanceToSun: 520,
        name: 'Neptune',
        objectFun: (toi) => createNeptune(toi),
        size: 22,
        moons: []
    },
]
