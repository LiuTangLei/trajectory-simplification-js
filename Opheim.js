const opheimSimplification = (coordinates, minLength, maxLength) => {
    let simplified = [coordinates[0]];
    let lastIndex = 0;

    for (let i = 1; i < coordinates.length - 1; i++) {
        const currentDist = calculationDistance(coordinates[lastIndex], coordinates[i]);

        if (currentDist < minLength) continue;

        if (currentDist > maxLength || distToSegment(coordinates[lastIndex], coordinates[i + 1], coordinates[i]) > minLength) {
            simplified.push(coordinates[i]);
            lastIndex = i;
        }
    }

    simplified.push(coordinates[coordinates.length - 1]);

    return simplified;
};
