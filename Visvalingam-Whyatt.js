// Calculate the distance between two points
const calculationDistance = (point1, point2) => {
  let lat1 = point1.latitude;
  let lat2 = point2.latitude;
  let lng1 = point1.longitude;
  let lng2 = point2.longitude;
  let radLat1 = lat1 * Math.PI / 180.0;
  let radLat2 = lat2 * Math.PI / 180.0;
  let a = radLat1 - radLat2;
  let b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  return s * 6370996.81;
};


// Calculate the area of a triangle
const calculateTriangleArea = (a, b, c) => {
  const ab = calculationDistance(a, b);
  const bc = calculationDistance(b, c);
  const ca = calculationDistance(c, a);

  const s = (ab + bc + ca) / 2;
  const area = Math.sqrt(s * (s - ab) * (s - bc) * (s - ca));

  return area;
};

const visvalingamWhyatt = (coordinates, tolerance) => {
  // Continue until only two coordinates are left, or the minimum area is greater than or equal to the tolerance
  while (coordinates.length > 2) {
    let minArea = Infinity;
    let minIndex = null;

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
      coordinates.splice(minIndex, 1);
    } else {
      break;
    }
  }

  return coordinates;
};
