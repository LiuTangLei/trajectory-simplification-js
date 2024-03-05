interface Coordinate {
    latitude: number;
    longitude: number;
}

const EARTH_RADIUS = 6371000; // Radius of the Earth in meters, used in distance calculations

// Converts a degree measurement to radians
const toRadians = (degree: number): number => degree * Math.PI / 180.0;

// Implements the Haversine formula to calculate the great-circle distance between two points on the Earth
const calculateDistance = <T extends Coordinate>(point1: T, point2: T): number => {
    const { latitude: lat1, longitude: lng1 } = point1;
    const { latitude: lat2, longitude: lng2 } = point2;

    const dLat = toRadians(lat2 - lat1); // Delta latitude in radians
    const dLng = toRadians(lng2 - lng1); // Delta longitude in radians

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS * c; // Returns the distance in meters
};

/**
 * Simplifies a given set of geographic coordinates using the Radial-Distance algorithm.
 * This algorithm retains points based on a specified distance tolerance from the path connecting
 * the points, effectively reducing the number of points in a path while preserving its shape.
 *
 * @param {Array<T extends Coordinate>} coordinates - The original list of geographic coordinates.
 * @param {number} tolerance - The radial distance tolerance in meters. Points further away than
 *                             this distance from the previous point in the simplified path are included.
 * @return {Array<T extends Coordinate>} - The simplified list of geographic coordinates.
 * @throws {Error} - If the input coordinates array is null or contains fewer than two points.
 */
const radialDistance = <T extends Coordinate>(coordinates: T[], tolerance: number): T[] => {
    if (!coordinates || coordinates.length < 2) {
        throw new Error("Invalid input: coordinates array must have at least two points.");
    }

    const simplifiedCoordinates: T[] = [coordinates[0]]; // Start with the first point
    let previousPoint = coordinates[0]; // Initialize the previous point

    for (let i = 1; i < coordinates.length; i++) {
        const distance = calculateDistance(previousPoint, coordinates[i]);
        // Include the point if its distance from the previous point is greater than or equal to the tolerance
        if (distance >= tolerance) {
            simplifiedCoordinates.push(coordinates[i]);
            previousPoint = coordinates[i]; // Update the previous point for subsequent comparisons
        }
    }

    // Always include the last point to ensure the path's end is preserved
    simplifiedCoordinates.push(coordinates[coordinates.length - 1]);

    return simplifiedCoordinates;
};

export default { radialDistance };
