// Define interface for geographic coordinates.
interface Coordinate {
    latitude: number;
    longitude: number;
}

// Extend Coordinate to include an index for original order and an area for the associated triangle.
interface IndexedCoordinate extends Coordinate {
    index: number;
    area: number; // Changed to mandatory to simplify handling
}

// Earth's radius in meters.
const EARTH_RADIUS = 6370996.81;

// Helper function to convert degrees to radians.
const degreeToRadian = (degree: number): number => degree * Math.PI / 180.0;

// Function to calculate the distance between two points on the Earth's surface.
const calculateDistance = (point1: Coordinate, point2: Coordinate): number => {
    const radLat1 = degreeToRadian(point1.latitude);
    const radLat2 = degreeToRadian(point2.latitude);
    const radLon1 = degreeToRadian(point1.longitude);
    const radLon2 = degreeToRadian(point2.longitude);

    const a = radLat1 - radLat2;
    const b = radLon1 - radLon2;

    const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    return s * EARTH_RADIUS;
};

// Function to calculate the area of a triangle formed by three points.
const calculateTriangleArea = (a: Coordinate, b: Coordinate, c: Coordinate): number => {
    const ab = calculateDistance(a, b);
    const bc = calculateDistance(b, c);
    const ca = calculateDistance(c, a);

    const s = (ab + bc + ca) / 2;
    return Math.sqrt(s * (s - ab) * (s - bc) * (s - ca));
};

// Function to perform the Visvalingam-Whyatt simplification on a set of geographic coordinates.
export const visvalingamWhyatt = (coordinates: Coordinate[], tolerance: number): Coordinate[] => {
    if (coordinates.length <= 2) return coordinates; // No simplification needed for 2 or fewer points

    let indexedCoordinates: IndexedCoordinate[] = coordinates.map((coord, index) => ({
        ...coord,
        index,
        area: index === 0 || index === coordinates.length - 1 ? Infinity : calculateTriangleArea(coordinates[index - 1], coord, coordinates[index + 1]),
    }));

    // Sort by area initially to prepare for efficient removal
    indexedCoordinates.sort((a, b) => a.area - b.area);

    while (indexedCoordinates.length > 2 && indexedCoordinates[0].area < tolerance) {
        const current = indexedCoordinates.shift()!; // Remove the point with the smallest area

        // Update areas of neighbors
        for (let i = 0; i < indexedCoordinates.length; i++) {
            if (indexedCoordinates[i].index === current.index - 1 || indexedCoordinates[i].index === current.index + 1) {
                // Find neighbors in the original array
                const prevIndex = i > 0 ? i - 1 : i;
                const nextIndex = i < indexedCoordinates.length - 1 ? i + 1 : i;

                // Recalculate areas for affected neighbors
                indexedCoordinates[i].area = calculateTriangleArea(
                    indexedCoordinates[prevIndex],
                    indexedCoordinates[i],
                    indexedCoordinates[nextIndex]
                );
            }
        }

        // Sort again after updating areas
        indexedCoordinates.sort((a, b) => a.area - b.area);
    }

    // Filter out removed points and restore original order
    return indexedCoordinates
        .filter(coord => coord.area >= tolerance)
        .sort((a, b) => a.index - b.index)
        .map(({ latitude, longitude }) => ({ latitude, longitude }));
};
