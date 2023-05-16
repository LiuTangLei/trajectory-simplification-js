// Helper function to convert degrees to radians
const degreeToRadian = (degree) => degree * Math.PI / 180.0;

// Calculates the Euclidean distance between two geographical points
const calculateDistanceBetweenPoints = (point1, point2) => {
    // Convert latitude and longitude from degrees to radians
    const radLat1 = degreeToRadian(point1.latitude);
    const radLat2 = degreeToRadian(point2.latitude);
    const radLon1 = degreeToRadian(point1.longitude);
    const radLon2 = degreeToRadian(point2.longitude);

    const deltaLat = radLat1 - radLat2;
    const deltaLon = radLon1 - radLon2;

    // Haversine formula
    const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLon / 2), 2)));

    // Return the distance in meters
    return s * 6370996.81;
};

// Calculates the perpendicular distance from a point to a line segment
const calculatePerpendicularDistance = (start, end, center) => {
    const a = Math.abs(calculateDistanceBetweenPoints(start, end));
    const b = Math.abs(calculateDistanceBetweenPoints(start, center));
    const c = Math.abs(calculateDistanceBetweenPoints(end, center));

    // Heron's formula for the area of a triangle
    const semiPerimeter = (a + b + c) / 2.0;
    const area = Math.sqrt(semiPerimeter * (semiPerimeter - a) * (semiPerimeter - b) * (semiPerimeter - c));

    // The perpendicular distance from center to the line segment (start, end) is twice the area divided by the base length a
    return 2.0 * area / a;
};

// Recursively compress the trajectory
const compressLine = (coordinate, start, end, dMax) => {
    // Initialize the result array
    let result = [];

    // We only proceed if the start index is less than the end index
    if (start < end) {
        let maxDist = 0;
        let currentIndex = 0;
        const startPoint = coordinate[start].point;
        const endPoint = coordinate[end].point;

        // Find the point with the greatest distance from the line segment (startPoint, endPoint)
        for (let i = start + 1; i < end; i++) {
            const currentDist = calculatePerpendicularDistance(startPoint, endPoint, coordinate[i].point);
            if (currentDist > maxDist) {
                maxDist = currentDist;
                currentIndex = i;
            }
        }

        // If the maximum distance is greater than the threshold, recursively simplify the trajectory
        if (maxDist >= dMax) {
            result.push(coordinate[currentIndex].point);

            // Concatenate the results of the recursive calls
            result = result.concat(
                compressLine(coordinate, start, currentIndex, dMax),
                compressLine(coordinate, currentIndex, end, dMax)
            );
        }
    }

    // Return the simplified trajectory
    return result;
};

/**
 * Simplifies a given trajectory using the Douglas-Peucker algorithm.
 * @param {Array} coordinate - The original trajectory coordinates.
 * @param {number} [dMax=10] - The maximum allowable perpendicular distance (in meters) from a point to the line segment connecting its neighboring points in the simplified trajectory.
 * @return {Array} - The simplified
 trajectory.

 @throws {Error} If the input coordinates array is null or has fewer than two points.
 */
const douglasPeucker = (coordinate, dMax = 10) => {
    if (!coordinate || coordinate.length < 2) {
        throw new Error("Invalid input: coordinates array must have at least two points.");
    }

// We create a new array of objects, adding the index and the original point to each coordinate
    const indexedCoordinates = coordinate.map((item, index) => ({index, point: item}));

// Initialize the result array with the first and last points
    let result = [indexedCoordinates[0].point, indexedCoordinates[indexedCoordinates.length - 1].point];

// Recursively simplify the trajectory
    result = result.concat(compressLine(indexedCoordinates, 0, indexedCoordinates.length - 1, dMax));

// Sort the result array by the original indices to maintain the trajectory's order
    const sortedResult = result.sort((a, b) => indexedCoordinates.find(item => item.point === a).index - indexedCoordinates.find(item => item.point === b).index);

// Return the simplified trajectory
    return sortedResult;
};

module.exports = {douglasPeucker};
