const calculateTriangleArea = (a, b, c) => {
    const ab = calculationDistance(a, b);
    const bc = calculationDistance(b, c);
    const ca = calculationDistance(c, a);

    const s = (ab + bc + ca) / 2;
    const area = Math.sqrt(s * (s - ab) * (s - bc) * (s - ca));

    return area;
};

const visvalingamWhyatt = (coordinates, tolerance) => {
    while (true) {
        let minArea = Infinity;
        let minIndex = null;

        for (let i = 1; i < coordinates.length - 1; i++) {
            const area = calculateTriangleArea(coordinates[i - 1], coordinates[i], coordinates[i + 1]);

            if (area < minArea) {
                minArea = area;
                minIndex = i;
            }
        }

        if (minArea < tolerance) {
            coordinates.splice(minIndex, 1);
        } else {
            break;
        }
    }

    return coordinates;
};
