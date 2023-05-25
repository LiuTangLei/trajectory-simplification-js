import {visvalingamWhyatt} from '../Visvalingam-Whyatt';
import {generateTrajectory, testSimplify} from './testCommon';

describe('DouglasPeucker', function () {
    it('should simplify the trajectory', function () {
        let baseLat: number = 48.8566; // Starting latitude (Paris)
        let baseLng: number = 2.3522; // Starting longitude (Paris)

        const latEnd: number = 41.9028; // Ending latitude (Rome)
        const lngEnd: number = 12.4964; // Ending longitude (Rome)

        const numPoints: number = 1234; // Number of points to generate

        let trajectory = generateTrajectory(numPoints, baseLat, baseLng, latEnd, lngEnd);
        const simplifiedLength = visvalingamWhyatt(trajectory, 8).length;
        testSimplify('Visvalingam-Whyatt', trajectory.length, simplifiedLength);
    });
});
