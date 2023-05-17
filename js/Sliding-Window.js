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

// Sliding-Window Algorithm
const slidingWindow = (coordinates, tolerance) => {
    let startIndex = 0;
    let endIndex = 2;

    const simplifiedCoordinates = [coordinates[startIndex]];

    while (endIndex < coordinates.length) {
        let maxDistance = 0;

        for (let i = startIndex + 1; i < endIndex; i++) {
            const distance = calculateDistance(coordinates[startIndex], coordinates[i]);
            if (distance > maxDistance) {
                maxDistance = distance;
            }
        }

        if (maxDistance > tolerance) {
            simplifiedCoordinates.push(coordinates[endIndex - 1]);
            startIndex = endIndex - 1;
        }

        endIndex++;
    }

    simplifiedCoordinates.push(coordinates[endIndex - 1]);

    return simplifiedCoordinates;
};

export default { slidingWindow };
