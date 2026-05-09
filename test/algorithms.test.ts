import {expect} from 'chai';
import {douglasPeucker, imaiIriSimplify, radialDistance, visvalingamWhyatt, type Coordinate} from '../index';

interface TestPoint extends Coordinate {
    id: string;
}

const ids = (points: TestPoint[]): string[] => points.map(point => point.id);

const kinkedPath: TestPoint[] = [
    {id: 'a', latitude: 0, longitude: 0},
    {id: 'b', latitude: 0, longitude: 0.001},
    {id: 'c', latitude: 0.001, longitude: 0.002},
    {id: 'd', latitude: 0, longitude: 0.003},
    {id: 'e', latitude: 0, longitude: 0.004},
];

describe('trajectory simplification algorithms', function () {
    it('Douglas-Peucker preserves endpoints, order, and significant bends', function () {
        expect(ids(douglasPeucker(kinkedPath, 60))).to.deep.equal(['a', 'c', 'e']);
        expect(ids(douglasPeucker(kinkedPath, 150))).to.deep.equal(['a', 'e']);
    });

    it('Radial Distance keeps points far enough from the last retained point', function () {
        const path: TestPoint[] = [
            {id: 'a', latitude: 0, longitude: 0},
            {id: 'b', latitude: 0, longitude: 0.0001},
            {id: 'c', latitude: 0, longitude: 0.002},
            {id: 'd', latitude: 0, longitude: 0.0021},
            {id: 'e', latitude: 0, longitude: 0.004},
        ];

        expect(ids(radialDistance(path, 100))).to.deep.equal(['a', 'c', 'e']);
    });

    it('Visvalingam-Whyatt removes low-area points without cloning coordinates', function () {
        const straightPath: TestPoint[] = [
            {id: 'a', latitude: 0, longitude: 0},
            {id: 'b', latitude: 0, longitude: 0.001},
            {id: 'c', latitude: 0, longitude: 0.002},
            {id: 'd', latitude: 0.001, longitude: 0.003},
            {id: 'e', latitude: 0, longitude: 0.004},
        ];

        const simplified = visvalingamWhyatt(straightPath, 20000);

        expect(ids(simplified)).to.deep.equal(['a', 'd', 'e']);
        expect(simplified[1]).to.equal(straightPath[3]);
    });

    it('Imai-Iri returns the shortest valid path under the error tolerance', function () {
        expect(ids(imaiIriSimplify(kinkedPath, 60))).to.deep.equal(['a', 'c', 'e']);
        expect(ids(imaiIriSimplify(kinkedPath, 150))).to.deep.equal(['a', 'e']);
    });

    it('validates inputs and tolerances', function () {
        expect(() => douglasPeucker([kinkedPath[0]], 1)).to.throw(/at least 2 points/);
        expect(() => radialDistance(kinkedPath, -1)).to.throw(/greater than or equal to 0/);
        expect(() => visvalingamWhyatt([{id: 'bad', latitude: Number.NaN, longitude: 0}], 1)).to.throw(/at least 2 points/);
        expect(() => imaiIriSimplify([{id: 'a', latitude: 91, longitude: 0}, kinkedPath[1]], 1)).to.throw(/latitude/);
    });
});