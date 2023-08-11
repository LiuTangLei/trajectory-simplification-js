interface Coordinate {
    latitude: number;
    longitude: number;
}

const toRadians = (degree: number): number => degree * Math.PI / 180.0;
const EARTH_RADIUS = 6370996.81;

const calculateDistance = (point1: Coordinate, point2: Coordinate): number => {
    const { latitude: lat1, longitude: lng1 } = point1;
    const { latitude: lat2, longitude: lng2 } = point2;
    const radLat1 = toRadians(lat1);
    const radLat2 = toRadians(lat2);
    const a = radLat1 - radLat2;
    const b = toRadians(lng1) - toRadians(lng2);
    const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    return s * EARTH_RADIUS;
};

const slidingWindow = (coordinates: Coordinate[], windowSize: number, tolerance: number): Coordinate[] => {
    const simplifiedCoordinates: Coordinate[] = [coordinates[0]];

    for (let i = 0; i < coordinates.length - windowSize; i += windowSize) {
        let maxDistance = 0;
        let indexWithMaxDistance = i;

        for (let j = i; j < i + windowSize && j < coordinates.length; j++) { // Add a condition to make sure we don't go out of bounds
            const distance = calculateDistance(coordinates[i], coordinates[j]);
            if (distance > maxDistance) {
                maxDistance = distance;
                indexWithMaxDistance = j;
            }
        }

        if (maxDistance > tolerance) {
            simplifiedCoordinates.push(coordinates[indexWithMaxDistance]);
        }
    }

    // Check the last window
    let maxDistance = 0;
    let indexWithMaxDistance = coordinates.length - windowSize;

    for (let j = coordinates.length - windowSize; j < coordinates.length; j++) {
        const distance = calculateDistance(coordinates[coordinates.length - windowSize], coordinates[j]);
        if (distance > maxDistance) {
            maxDistance = distance;
            indexWithMaxDistance = j;
        }
    }

    if (maxDistance > tolerance) {
        simplifiedCoordinates.push(coordinates[indexWithMaxDistance]);
    }

    simplifiedCoordinates.push(coordinates[coordinates.length - 1]);

    return simplifiedCoordinates;
};

export default { slidingWindow };

