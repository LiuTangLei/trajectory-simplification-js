interface Coordinate {
    latitude: number;
    longitude: number;
}

type IndexedCoordinate<T> = T & {
    index: number;
};

// Calculate the distance between two points
const calculationDistance = <T extends Coordinate>(point1: T, point2: T): number => {
    const lat1 = point1.latitude;
    const lat2 = point2.latitude;
    const lng1 = point1.longitude;
    const lng2 = point2.longitude;
    const radLat1 = lat1 * Math.PI / 180.0;
    const radLat2 = lat2 * Math.PI / 180.0;
    const a = radLat1 - radLat2;
    const b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);
    const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    return s * 6370996.81;
};

// Calculate the distance between point pX and the line determined by points pA and pB
const distToSegment = <T extends Coordinate>(start: T, end: T, center: T): number => {
    const a = Math.abs(calculationDistance(start, end));
    const b = Math.abs(calculationDistance(start, center));
    const c = Math.abs(calculationDistance(end, center));
    const p = (a + b + c) / 2.0;
    const s = Math.sqrt(Math.abs(p * (p - a) * (p - b) * (p - c)));
    return s * 2.0 / a;
};

// Recursively compress the trajectory
const compressLine = <T extends Coordinate>(coordinate: IndexedCoordinate<T>[], result: T[], start: number, end: number, dMax: number): T[] => {
    if (start < end) {
        let maxDist = 0;
        let currentIndex = 0;
        const startPoint = coordinate[start];
        const endPoint = coordinate[end];

        for (let i = start + 1; i < end; i++) {
            const currentDist = distToSegment(startPoint, endPoint, coordinate[i]);
            if (currentDist > maxDist) {
                maxDist = currentDist;
                currentIndex = i;
            }
        }

        if (maxDist >= dMax) {
            // Add the current point to the filtered array
            result.push(coordinate[currentIndex]);

            // Split the original line segment into two segments with the current point as the center and recursively process them separately
            compressLine(coordinate, result, start, currentIndex, dMax);
            compressLine(coordinate, result, currentIndex, end, dMax);
        }
    }

    return result;
};

/**
 * Simplifies a given trajectory using the Douglas-Peucker algorithm.
 * @param {Array<T extends Coordinate>} coordinate - Original trajectory.
 * @param {number} [dMax=10] - Maximum allowable distance error.
 * @return {Array<T extends Coordinate>} - Simplified trajectory.
 * @warning If the coordinate objects have an 'index' property, please replace the 'index' used in this method with a non-conflicting name.
 */
const douglasPeucker = <T extends Coordinate>(coordinate: T[], dMax: number = 10): T[] => {
    if (!coordinate || !(coordinate.length > 2)) {
        return null;
    }

    // Map the original coordinates array to include the index
    const indexedCoordinates: IndexedCoordinate<T>[] = coordinate.map((item, index) => ({...item, index}));

    let result: T[] = compressLine(indexedCoordinates, [], 0, indexedCoordinates.length - 1, dMax);
    result.push(indexedCoordinates[0]);
    result.push(indexedCoordinates[indexedCoordinates.length - 1]);

    // Sort the results array based on the original indices
    let resultLatLng: T[] = result.sort((a: IndexedCoordinate<T>, b: IndexedCoordinate<T>) => {
        if (a.index < b.index) {
            return -1;
        } else if (a.index > b.index) {
            return 1;
        }
        return 0;
    });

    // Remove the index property from the result
    resultLatLng.forEach((item: IndexedCoordinate<T>) => {
        delete item.index;
    });

    return resultLatLng;
};

export default {douglasPeucker};