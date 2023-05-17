// Earth's radius in meters.
const EARTH_RADIUS = 6370996.81;

// Helper function to convert degrees to radians.
const degreeToRadian = function (degree) {
    return degree * Math.PI / 180.0;
};

// Function to calculate the distance between two points on the Earth's surface.
const calculateDistance = function (point1, point2) {
    // Convert coordinates to radians.
    const radLat1 = degreeToRadian(point1.latitude);
    const radLat2 = degreeToRadian(point2.latitude);
    const radLon1 = degreeToRadian(point1.longitude);
    const radLon2 = degreeToRadian(point2.longitude);

    // Calculate the differences.
    const a = radLat1 - radLat2;
    const b = radLon1 - radLon2;

    // Use the Haversine formula to calculate the great-circle distance.
    const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));

    // Return the distance in meters.
    return s * EARTH_RADIUS;
};

// Function to calculate the area of a triangle formed by three points.
const calculateTriangleArea = function (a, b, c) {
    // Calculate the sides of the triangle.
    const ab = calculateDistance(a, b);
    const bc = calculateDistance(b, c);
    const ca = calculateDistance(c, a);

    // Use Heron's formula to calculate the area of the triangle.
    const s = (ab + bc + ca) / 2;
    return Math.sqrt(s * (s - ab) * (s - bc) * (s - ca));
};

// Function to perform the Visvalingam-Whyatt simplification on a set of geographic coordinates.
const visvalingamWhyatt = function (coordinates, tolerance) {
    // Initialize IndexedCoordinate objects.
    let indexedCoordinates = coordinates.map((coord, index) => ({
        ...coord,
        index,
    }));

    // Calculate areas for all points except the endpoints.
    for (let i = 1; i < indexedCoordinates.length - 1; i++) {
        indexedCoordinates[i].area = calculateTriangleArea(indexedCoordinates[i - 1], indexedCoordinates[i], indexedCoordinates[i + 1]);
    }

    // Iteratively remove the point with the smallest area, until the smallest area exceeds the tolerance.
    while (indexedCoordinates.length > 2) {
        // Find the point with the smallest area.
        const minAreaPoint = indexedCoordinates.slice(1, -1).reduce((prev, curr) => (prev.area < curr.area) ? prev : curr);

        // If the smallest area is larger than the tolerance, stop simplifying.
        if (minAreaPoint.area >= tolerance) {
            break;
        }

        // Remove the point with the smallest area from the coordinates.
        const index = indexedCoordinates.indexOf(minAreaPoint);

        indexedCoordinates.splice(index, 1);
        // Update the areas of the two neighboring points.
        if (index > 1) {
            indexedCoordinates[index - 1].area = calculateTriangleArea(indexedCoordinates[index - 2], indexedCoordinates[index - 1], indexedCoordinates[index]);
        }

        if (index < indexedCoordinates.length - 1) {
            indexedCoordinates[index].area = calculateTriangleArea(indexedCoordinates[index - 1], indexedCoordinates[index], indexedCoordinates[index + 1]);
        }
    }

// Return the simplified coordinates in their original order.
    return indexedCoordinates.sort((a, b) => a.index - b.index);
};

export default {visvalingamWhyatt};
