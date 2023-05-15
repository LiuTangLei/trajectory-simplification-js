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

const opheimSimplification = <T extends Coordinate>(coordinates: T[], minTolerance: number, maxTolerance: number): T[] => {
    let simplifiedCoordinates: T[] = [coordinates[0]];
    let anchorIndex = 0;

    for (let i = 1; i < coordinates.length - 1; i++) {
        const distanceToAnchor = calculateDistance(coordinates[anchorIndex], coordinates[i]);
        const distanceToNext = calculateDistance(coordinates[i], coordinates[i + 1]);

        if (distanceToAnchor >= minTolerance && distanceToAnchor <= maxTolerance && distanceToNext >= minTolerance && distanceToNext <= maxTolerance) {
            simplifiedCoordinates.push(coordinates[i]);
            anchorIndex = i;
        }
    }

    simplifiedCoordinates.push(coordinates[coordinates.length - 1]);

    return simplifiedCoordinates;
};

export default { opheimSimplification };
