interface Coordinate {
    latitude: number; // Latitude of a coordinate
    longitude: number; // Longitude of a coordinate
}

const EARTH_RADIUS = 6370996.81; // Earth's radius in meters
const DEGREES_TO_RADIANS = Math.PI / 180; // Conversion factor for degrees to radians

// Function to calculate the distance between two geographic coordinates
const calculateDistance = (point1: Coordinate, point2: Coordinate): number => {
    const a = (point1.latitude - point2.latitude) * DEGREES_TO_RADIANS; // Difference in latitudes, converted to radians
    const b = (point1.longitude - point2.longitude) * DEGREES_TO_RADIANS; // Difference in longitudes, converted to radians
    const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(point1.latitude * DEGREES_TO_RADIANS) * Math.cos(point2.latitude * DEGREES_TO_RADIANS) * Math.pow(Math.sin(b / 2), 2))); // Calculating the distance using Haversine formula

    return s * EARTH_RADIUS; // Converting the result to meters
};

// Function to calculate the angle between three geographic coordinates
const angleBetweenThreePoints = (p1: Coordinate, p2: Coordinate, p3: Coordinate): number => {
    const vector1 = { x: p2.longitude - p1.longitude, y: p2.latitude - p1.latitude }; // Vector from point 1 to point 2
    const vector2 = { x: p3.longitude - p2.longitude, y: p3.latitude - p2.latitude }; // Vector from point 2 to point 3

    const angle = Math.atan2(vector1.x * vector2.y - vector1.y * vector2.x, vector1.x * vector2.x + vector1.y * vector2.y); // Calculating the angle between the vectors

    return angle * (180 / Math.PI); // Converting the angle to degrees
};

// Opheim line simplification algorithm to reduce the number of points in a geographic path
const opheimSimplification = (coordinates: Coordinate[], minTolerance: number, maxTolerance: number, angleTolerance: number): Coordinate[] => {
    if (coordinates.length < 3) {
        return coordinates; // If less than 3 points, return as is
    }

    const simplifiedCoordinates: Coordinate[] = [coordinates[0]]; // The result array starts with the first coordinate
    let anchorIndex = 0; // Index of the last point added to the result

    for (let i = 1; i < coordinates.length - 1; i++) {
        const distanceToAnchor = calculateDistance(coordinates[anchorIndex], coordinates[i]); // Distance from the anchor point to current point
        const distanceToNext = calculateDistance(coordinates[i], coordinates[i + 1]); // Distance from the current point to the next point
        const angle = angleBetweenThreePoints(coordinates[anchorIndex], coordinates[i], coordinates[i + 1]); // Angle between the three points

        // Check if the distances and angle meet the tolerances
        if ((distanceToAnchor > minTolerance && distanceToAnchor < maxTolerance) &&
            (distanceToNext > minTolerance && distanceToNext < maxTolerance) &&
            Math.abs(angle) < angleTolerance) {
            simplifiedCoordinates.push(coordinates[i]); // If conditions are met, add the current point to the result
            anchorIndex = i; // Update the anchor index
        }
    }

    simplifiedCoordinates.push(coordinates[coordinates.length - 1]); // Add the last coordinate
    return simplifiedCoordinates; // Return the simplified path
};

export default { opheimSimplification };
