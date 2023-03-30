interface Coordinate {
    latitude: number;
    longitude: number;
}

const EARTH_RADIUS = 6370996.81;

// Calculate the distance between two points
const calculateDistance = <T extends Coordinate>(point1: T, point2: T): number => {
    const { latitude: lat1, longitude: lng1 } = point1;
    const { latitude: lat2, longitude: lng2 } = point2;
    const radLat1 = lat1 * Math.PI / 180.0;
    const radLat2 = lat2 * Math.PI / 180.0;
    const a = radLat1 - radLat2;
    const b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);
    const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    return s * EARTH_RADIUS;
};

// Calculate the cross-track distance from point C to the line segment A-B
const crossTrackDistance = <T extends Coordinate>(a: T, b: T, c: T): number => {
    const d1 = calculateDistance(a, c);
    const d2 = calculateDistance(a, b);
    const angle1 = Math.acos(Math.sin(d1 / EARTH_RADIUS) * Math.sin(d2 / EARTH_RADIUS));
    const angle2 = Math.asin(Math.sin(d1 / EARTH_RADIUS) * Math.sin(angle1));
    return Math.abs(EARTH_RADIUS * angle2);
};

// Topological Preserving Simplification Algorithm
const tps = <T extends Coordinate>(coordinates: T[], tolerance: number): T[] => {
    // Initialize the result array with the first coordinate
    const simplifiedCoordinates: T[] = [coordinates[0]];

    // Set the previous point as the first point in the coordinates array
    let previousPoint = coordinates[0];
    let maxCrossTrackDistance = 0;
    let maxDistancePoint: T | null = null;

    // Iterate through the coordinates (excluding the first and last points)
    for (let i = 1; i < coordinates.length - 1; i++) {
        // Calculate the cross-track distance from the current point to the line segment formed by the previous point and the next point
        const distance = crossTrackDistance(previousPoint, coordinates[i + 1], coordinates[i]);

        // Update the maximum cross-track distance and the corresponding point if the current distance is greater
        if (distance > maxCrossTrackDistance) {
            maxCrossTrackDistance = distance;
            maxDistancePoint = coordinates[i];
        }

        // If the maximum cross-track distance is greater than or equal to the tolerance, add the point with the maximum distance to the result array
        if (maxCrossTrackDistance >= tolerance) {
            simplifiedCoordinates.push(maxDistancePoint as T);
            previousPoint = maxDistancePoint as T;
            maxCrossTrackDistance = 0;
            maxDistancePoint = null;
        }
    }

    // Add the last coordinate to the result array
    simplifiedCoordinates.push(coordinates[coordinates.length - 1]);

    return simplifiedCoordinates;
};

export default { tps };
