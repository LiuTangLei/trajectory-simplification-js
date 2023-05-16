interface Coordinate {
    latitude: number;
    longitude: number;
}

const EARTH_RADIUS = 6371000; // Radius of the Earth in meters

// Convert degree to radian
const toRadians = (degree: number): number => degree * Math.PI / 180.0;

// Haversine formula to calculate the distance between two points
const calculateDistance = <T extends Coordinate>(point1: T, point2: T): number => {
    const { latitude: lat1, longitude: lng1 } = point1;
    const { latitude: lat2, longitude: lng2 } = point2;

    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS * c; // Return distance in meters
};

/**
 * Simplifies a given trajectory using the Radial-Distance algorithm.
 *
 * @param {Array<T extends Coordinate>} coordinates - The original trajectory coordinates.
 * @param {number} tolerance - The maximum allowable radial distance (in meters) from a point to the line segment connecting its neighboring points in the simplified trajectory.
 *
 * @return {Array<T extends Coordinate>} - The simplified trajectory.
 *
 * @throws {Error} If the input coordinates array is null or has fewer than two points.
 */
const radialDistance = <T extends Coordinate>(coordinates: T[], tolerance: number): T[] => {
    if (!coordinates || coordinates.length < 2) {
        throw new Error("Invalid input: coordinates array must have at least two points.");
    }

    const simplifiedCoordinates: T[] = [coordinates[0]]; // Start with the first point
    let previousPoint = coordinates[0];

    for (let i = 1; i < coordinates.length - 1; i++) {
        const distance = calculateDistance(previousPoint, coordinates[i]);
        // If the distance is greater than or equal to the tolerance, add the point to the result
        if (distance >= tolerance) {
            simplifiedCoordinates.push(coordinates[i]);
            previousPoint = coordinates[i]; // Update the previous point
        }
    }

    // Always include the last point
    simplifiedCoordinates.push(coordinates[coordinates.length - 1]);

    return simplifiedCoordinates;
};

export default { radialDistance };
