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

// Calculate the area of a triangle
const calculateTriangleArea = <T extends Coordinate>(a: T, b: T, c: T): number => {
  const ab = calculateDistance(a, b);
  const bc = calculateDistance(b, c);
  const ca = calculateDistance(c, a);

  const s = (ab + bc + ca) / 2;
  return Math.sqrt(s * (s - ab) * (s - bc) * (s - ca));
};

const visvalingamWhyatt = <T extends Coordinate>(coordinates: T[], tolerance: number): T[] => {
  // Continue until only two coordinates are left, or the minimum area is greater than or equal to the tolerance
  while (coordinates.length > 2) {
    let minArea = Infinity;
    let minIndex: number | null = null;

    // Iterate through each point (excluding the first and last points) and calculate the triangle area
    for (let i = 1; i < coordinates.length - 1; i++) {
      const area = calculateTriangleArea(coordinates[i - 1], coordinates[i], coordinates[i + 1]);

      // Update the minimum area and its index if a smaller area is found
      if (area < minArea) {
        minArea = area;
        minIndex = i;
      }
    }

    // Remove the point with the smallest area if it's less than the tolerance
    if (minArea < tolerance) {
      coordinates.splice(minIndex as number, 1);
    } else {
      break;
    }
  }

  return coordinates;
};

export default { visvalingamWhyatt };
