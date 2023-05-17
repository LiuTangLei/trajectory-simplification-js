const EARTH_RADIUS = 6370996.81;

// Calculate the distance between two points
const calculateDistance = (point1, point2) => {
    const { latitude: lat1, longitude: lng1 } = point1;
    const { latitude: lat2, longitude: lng2 } = point2;
    const radLat1 = lat1 * Math.PI / 180.0;
    const radLat2 = lat2 * Math.PI / 180.0;
    const a = radLat1 - radLat2;
    const b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);
    const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    return s * EARTH_RADIUS;
};

// Radial-Distance Algorithm
const radialDistance = (coordinates, tolerance) => {
    // The result array, initialized with the first coordinate
    const simplifiedCoordinates = [coordinates[0]];

    // Set the previous point as the first point in the coordinates array
    let previousPoint = coordinates[0];

    // Iterate through the coordinates (excluding the first and last points)
    for (let i = 1; i < coordinates.length - 1; i++) {
        // Calculate the distance between the current point and the previous point
        const distance = calculateDistance(previousPoint, coordinates[i]);

        // If the distance is greater than or equal to the tolerance, add the current point to the result array and update the previous point
        if (distance >= tolerance) {
            simplifiedCoordinates.push(coordinates[i]);
            previousPoint = coordinates[i];
        }
    }

    // Add the last coordinate to the result array
    simplifiedCoordinates.push(coordinates[coordinates.length - 1]);

    return simplifiedCoordinates;
};

export default { radialDistance };
