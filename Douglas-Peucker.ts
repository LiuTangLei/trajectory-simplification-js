interface Coordinate {
    latitude: number;
    longitude: number;
}

// Add an extra field 'index' for the IndexedCoordinate interface to keep track of the original index
interface IndexedCoordinate<T> extends Coordinate {
    index: number;
    point: T;
}

// Helper function to convert degrees to radians
const degreeToRadian = (degree: number): number => degree * Math.PI / 180.0;

// Calculates the Euclidean distance between two geographical points
const calculateDistanceBetweenPoints = <T extends Coordinate>(point1: T, point2: T): number => {
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
const calculatePerpendicularDistance = (a: number, b: number, c: number): number => {
    const semiPerimeter = (a + b + c) / 2.0;
    const area = Math.sqrt(semiPerimeter * (semiPerimeter - a) * (semiPerimeter - b) * (semiPerimeter - c));

    return 2.0 * area / a;
};

// Recursively compress the trajectory
const compressLine = <T extends Coordinate>(coordinate: IndexedCoordinate<T>[], start: number, end: number, dMax: number, result: T[]): void => {
    // Initialize the result array
    if (start < end) {
        let maxDist = 0;
        let currentIndex = 0;
        const startPoint = coordinate[start];
        const endPoint = coordinate[end];

        const a = calculateDistanceBetweenPoints(startPoint, endPoint);

        for (let i = start + 1; i < end; i++) {
            const b = calculateDistanceBetweenPoints(startPoint, coordinate[i]);
            const c = calculateDistanceBetweenPoints(endPoint, coordinate[i]);
            const currentDist = calculatePerpendicularDistance(a, b, c);
            if (currentDist > maxDist) {
                maxDist = currentDist;
                currentIndex = i;
            }
        }

        if (maxDist >= dMax) {
            result.push(coordinate[currentIndex].point);
            compressLine(coordinate, start, currentIndex, dMax, result);
            compressLine(coordinate, currentIndex, end, dMax, result);
        }
    }
};

/**

 Simplifies a given trajectory using the Douglas-Peucker algorithm.

 @param {Array<T extends Coordinate>} coordinate - The original trajectory coordinates.

 @param {number} [dMax=10] - The maximum allowable perpendicular distance (in meters) from a point to the line segment connecting its neighboring points in the simplified trajectory.

 @return {Array<T extends Coordinate>} - The simplified trajectory.

 @throws {Error} If the input coordinates array is null or has fewer than two points.

 @warning If the coordinate objects have an 'index' property, it will be overwritten in this function.
 */
export const douglasPeucker = <T extends Coordinate>(coordinate: T[], dMax: number = 10): T[] => {
    if (!coordinate || coordinate.length < 2) {
        throw new Error("Invalid input: coordinates array must have at least two points.");
    }

    // Create a new array of IndexedCoordinate, adding the index and the original point to each coordinate
    const indexedCoordinates: IndexedCoordinate<T>[] = coordinate.map((item, index) => ({...item, index, point: item}));

    // Initialize the result array with the first and last points
    let result: T[] = [indexedCoordinates[0].point, indexedCoordinates[indexedCoordinates.length - 1].point];

    // Recursively simplify the trajectory
    compressLine(indexedCoordinates, 0, indexedCoordinates.length - 1, dMax, result);
    return result;
};
