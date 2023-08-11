interface Coordinate {
    latitude: number;
    longitude: number;
}

// Lang line simplification algorithm
const langSimplification = (coordinates: Coordinate[], tolerance: number): Coordinate[] => {
    if (coordinates.length < 3) {
        return coordinates; // If less than 3 points, return as is
    }

    const simplifiedCoordinates: Coordinate[] = []; // The result array for simplified coordinates
    let startIndex = 0; // Starting index of the current segment
    let endIndex = coordinates.length - 1; // Ending index of the current segment

    const stack: [number, number][] = []; // Stack for storing segments to be processed
    stack.push([startIndex, endIndex]); // Initially push the whole array into the stack

    while (stack.length > 0) {
        const [start, end] = stack.pop()!; // Pop the current segment from the stack
        let maxDist = 0; // Max distance of a point from the line between start and end points
        let index = 0; // Index of the point with max distance

        const dx = coordinates[end].longitude - coordinates[start].longitude; // Difference in longitude between start and end points
        const dy = coordinates[end].latitude - coordinates[start].latitude; // Difference in latitude between start and end points

        // Iterate through the points in the current segment to find the point with max distance from the line
        for (let i = start + 1; i < end; i++) {
            const numerator = (dy * coordinates[i].longitude) - (dx * coordinates[i].latitude) + (coordinates[start].longitude * coordinates[end].latitude) - (coordinates[end].longitude * coordinates[start].latitude);
            const denominator = Math.sqrt(dx * dx + dy * dy);
            const dist = Math.abs(numerator / denominator); // Perpendicular distance of point from the line

            if (dist > maxDist) {
                index = i; // Update the index of the point with max distance
                maxDist = dist; // Update max distance
            }
        }

        // If max distance is greater than tolerance, the point is significant and the segment is split
        if (maxDist > tolerance) {
            stack.push([start, index]); // Push the left segment into the stack
            stack.push([index, end]); // Push the right segment into the stack
        } else {
            // If max distance is less than or equal to tolerance, add the start point to the result
            if (simplifiedCoordinates.indexOf(coordinates[start]) === -1) {
                simplifiedCoordinates.push(coordinates[start]);
            }
            // If processing the last segment, add the end point to the result
            if (stack.length === 0) {
                simplifiedCoordinates.push(coordinates[end]);
            }
        }
    }

    return simplifiedCoordinates; // Return the simplified path
};

export default { langSimplification };
