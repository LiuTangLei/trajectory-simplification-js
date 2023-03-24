const radialDistance = (coordinates, tolerance) => {
    let lastPoint = coordinates[0];
    let simplified = [lastPoint];

    coordinates.forEach(point => {
        if (calculationDistance(lastPoint, point) >= tolerance) {
            simplified.push(point);
            lastPoint = point;
        }
    });

    return simplified;
};
