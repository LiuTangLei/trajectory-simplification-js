const langSimplification = (coordinates, factor) => {
    let simplified = [coordinates[0]];
    let ref = coordinates[0];

    for (let i = 1; i < coordinates.length - 1; i++) {
        const a = calculationDistance(ref, coordinates[i + 1]);
        const b = calculationDistance(ref, coordinates[i]);
        const c = calculationDistance(coordinates[i], coordinates[i + 1]);

        const cosAlpha = (b * b + c * c - a * a) / (2 * b * c);
        const sinAlpha = Math.sqrt(1 - cosAlpha * cosAlpha);
        const d = b * sinAlpha;

        if (d > factor) {
            simplified.push(coordinates[i]);
            ref = coordinates[i];
        }
    }

    simplified.push(coordinates[coordinates.length - 1]);

    return simplified;
};
