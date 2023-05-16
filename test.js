const trajectory1 = require('./Douglas-Peucker.js').default;

let trajectory = [];
let baseLat = 48.8566; // Starting latitude (Paris)
let baseLng = 2.3522; // Starting longitude (Paris)

const latEnd = 41.9028; // Ending latitude (Rome)
const lngEnd = 12.4964; // Ending longitude (Rome)

const numPoints = 1234; // Number of points to generate
const stepLat = (latEnd - baseLat) / numPoints; // Step size for latitude
const stepLng = (lngEnd - baseLng) / numPoints; // Step size for longitude

// Function to generate a random offset in degrees
const randomOffset = () => (Math.random() * 8 / 111000) * (Math.random() < 0.5 ? 1 : -1);

// Function to generate a random noise
const randomNoise = () => Math.random() * 0.02 - 0.01; // Generate noise between -0.01 to 0.01

// Create an array to store the noise
let noiseArray = Array(numPoints).fill(0).map(() => randomNoise());

// Smooth the noise array with a sliding window
const windowSize = 50; // Size of the sliding window
let smoothedNoiseArray = [];
for (let i = 0; i < numPoints; i++) {
    let start = Math.max(0, i - windowSize / 2);
    let end = Math.min(numPoints - 1, i + windowSize / 2);
    let sum = 0;
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
        const numRedundant = Math.floor(Math.random() * 10) + 1; // Generate between 1 and 10 redundant points
        for (let j = 0; j < numRedundant; j++) {
            // Add a redundant point with random offset
            trajectory.push({
                latitude: point.latitude + randomOffset(),
                longitude: point.longitude + randomOffset(),
            });
        }
    }
}

console.log(trajectory.length);

const trajectory2 = trajectory1.douglasPeucker(trajectory,8);

console.log(trajectory2.length);
