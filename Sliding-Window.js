const toRadians = (degrees) => {
    return degrees * Math.PI / 180;
};

const calculateAngle = (a, b, c) => {
    const ab = calculationDistance(a, b);
    const bc = calculationDistance(b, c);
    const ac = calculationDistance(a, c);

    const cosAngle = (ab * ab + bc * bc - ac * ac) / (2 * ab * bc);
    const angle = Math.acos(cosAngle) * 180 / Math.PI;

    return angle;
};

const slidingWindowSimplification = (coordinates, distanceTolerance, angleTolerance) => {
    let simplified = [coordinates[0]];
    let windowStart = 0;

    for (let i = 1; i < coordinates.length - 1; i++) {
        const distance = calculationDistance(coordinates[windowStart], coordinates[i]);
        const angle = calculateAngle(coordinates[windowStart], coordinates[i], coordinates[i + 1]);

        if (distance < distanceTolerance || angle > angleTolerance) {
            continue;
        }

        simplified.push(coordinates[i]);
        windowStart = i;
    }

    simplified.push(coordinates[coordinates.length - 1]);

    return simplified;
};
