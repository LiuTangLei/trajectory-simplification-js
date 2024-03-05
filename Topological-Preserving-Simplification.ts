interface Coordinate {
    latitude: number;
    longitude: number;
}

const EARTH_RADIUS = 6370996.81; // Earth's radius in meters, used for distance calculations.

/**
 * Calculates the great-circle distance between two points on the Earth's surface.
 * Uses the Haversine formula to ensure accurate results even over long distances.
 * 
 * @param point1 First geographic coordinate.
 * @param point2 Second geographic coordinate.
 * @returns The distance between the two points in meters.
 */
const calculateDistance = <T extends Coordinate>(point1: T, point2: T): number => {
    const radLat1 = point1.latitude * Math.PI / 180.0;
    const radLat2 = point2.latitude * Math.PI / 180.0;
    const deltaLat = radLat1 - radLat2;
    const deltaLon = (point1.longitude - point2.longitude) * Math.PI / 180.0;

    const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS * c;
};

/**
 * Calculates the cross-track distance from a point to a line segment defined by two points.
 * This distance is the shortest path from the point to the line segment.
 * 
 * @param a Start point of the line segment.
 * @param b End point of the line segment.
 * @param c The point from which to calculate the distance to the line segment.
 * @returns The cross-track distance in meters.
 */
const crossTrackDistance = <T extends Coordinate>(a: T, b: T, c: T): number => {
    const distanceAC = calculateDistance(a, c);
    const bearingAC = calculateDistance(a, b);
    const bearingAB = Math.acos(Math.sin(distanceAC / EARTH_RADIUS) * Math.sin(bearingAC / EARTH_RADIUS));

    const distance = Math.asin(Math.sin(distanceAC / EARTH_RADIUS) * Math.sin(bearingAB)) * EARTH_RADIUS;
    return Math.abs(distance);
};

/**
 * Performs Topological Preserving Simplification on a set of geographic coordinates.
 * Simplifies a polyline by removing points that are within a tolerance of a straight line
 * between subsequent points, while preserving the topological characteristics of the polyline.
 * 
 * @param coordinates Array of geographic coordinates to simplify.
 * @param tolerance The distance tolerance for simplification. Points with a cross-track distance
 *                  less than this tolerance to the line segment between two points are removed.
 * @returns A simplified array of geographic coordinates.
 */
const tps = <T extends Coordinate>(coordinates: T[], tolerance: number): T[] => {
    if (coordinates.length < 3) return coordinates; // No simplification needed if less than 3 points.

    const simplifiedCoordinates: T[] = [coordinates[0]]; // Initialize with the first coordinate.

    let previousPoint = coordinates[0]; // Start with the first point as the previous point.

    // Iterate through coordinates, excluding the first and last.
    for (let i = 1; i < coordinates.length - 1; i++) {
        const currentPoint = coordinates[i];
        const nextPoint = coordinates[i + 1];

        // Calculate the cross-track distance from the current point to the line segment previous-next.
        const distance = crossTrackDistance(previousPoint, nextPoint, currentPoint);

        // If the distance is above the tolerance, the point is significant and should be kept.
        if (distance >= tolerance) {
            simplifiedCoordinates.push(currentPoint);
            previousPoint = currentPoint; // Update the previous point for the next iteration.
        }
    }

    simplifiedCoordinates.push(coordinates[coordinates.length - 1]); // Always include the last coordinate.

    return simplifiedCoordinates;
};

export default { tps };
