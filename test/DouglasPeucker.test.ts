import {expect} from 'chai';
import {douglasPeucker} from '../Douglas-Peucker';

describe('DouglasPeucker', function () {
    it('should simplify the trajectory', function () {
        let trajectory: { latitude: number, longitude: number }[] = [];
        let baseLat: number = 48.8566; // Starting latitude (Paris)
        let baseLng: number = 2.3522; // Starting longitude (Paris)

        const latEnd: number = 41.9028; // Ending latitude (Rome)
        const lngEnd: number = 12.4964; // Ending longitude (Rome)

        const numPoints: number = 1234; // Number of points to generate
        const stepLat: number = (latEnd - baseLat) / numPoints; // Step size for latitude
        const stepLng: number = (lngEnd - baseLng) / numPoints; // Step size for longitude

        // Function to generate a random offset in degrees
        const randomOffset: () => number = () => (Math.random() * 8 / 111000) * (Math.random() < 0.5 ? 1 : -1);

        // Function to generate a random noise
        const randomNoise: () => number = () => Math.random() * 0.02 - 0.01; // Generate noise between -0.01 to 0.01

        // Create an array to store the noise
        let noiseArray: number[] = Array(numPoints).fill(0).map(() => randomNoise());

        // Smooth the noise array with a sliding window
        const windowSize: number = 50; // Size of the sliding window
        let smoothedNoiseArray: number[] = [];
        for (let i = 0; i < numPoints; i++) {
            let start: number = Math.max(0, i - windowSize / 2);
            let end: number = Math.min(numPoints - 1, i + windowSize / 2);
            let sum: number = 0;
            for (let j = start; j <= end; j++) {
                sum += noiseArray[j];
            }
            smoothedNoiseArray[i] = sum / (end - start + 1);
        }

        for (let i = 0; i < numPoints; i++) {
            // Add a point to the trajectory with smoothed noise
            const point = {
                latitude: baseLat + stepLat * i + smoothedNoiseArray[i],
                longitude: baseLng + stepLng * i + smoothedNoiseArray[i],
            };
            trajectory.push(point);

            // Randomly decide whether to generate redundant points
            if (Math.random() < 0.3) { // 30% chance to generate redundant points
                const numRedundant: number = Math.floor(Math.random() * 10) + 1; // Generate between 1 and 10 redundant points
                for (let j = 0; j < numRedundant; j++) {
                    // Add a redundant point with random offset
                    trajectory.push({
                        latitude: point.latitude + randomOffset(),
                        longitude: point.longitude + randomOffset(),
                    });
                }
            }
        }
        const originalLength: number = trajectory.length;
        const simplifiedTrajectory: { latitude: number, longitude: number }[] = douglasPeucker(trajectory, 8);
        const simplifiedLength: number = simplifiedTrajectory.length;

        // Assert that the simplified trajectory is shorter than the original trajectory
        expect(simplifiedLength).to.be.lessThan(originalLength);
    });
});
