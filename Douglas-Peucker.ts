import {pointToSegmentDistance, validateCoordinates, validateTolerance} from './geometry';
import type {Coordinate} from './types';

export type {Coordinate} from './types';

/**
 * Simplifies an ordered geographic trajectory using the Douglas-Peucker algorithm.
 *
 * @param coordinates The original trajectory coordinates.
 * @param tolerance Maximum point-to-segment distance in meters.
 * @returns A new array containing original coordinate objects in input order.
 */
export const douglasPeucker = <T extends Coordinate>(coordinates: readonly T[], tolerance = 10): T[] => {
    validateCoordinates(coordinates);
    validateTolerance('Douglas-Peucker', tolerance);

    if (coordinates.length <= 2) {
        return [...coordinates];
    }

    const keep = new Array<boolean>(coordinates.length).fill(false);
    keep[0] = true;
    keep[coordinates.length - 1] = true;

    const stack: Array<[number, number]> = [[0, coordinates.length - 1]];

    while (stack.length > 0) {
        const [startIndex, endIndex] = stack.pop()!;
        if (endIndex <= startIndex + 1) {
            continue;
        }

        let maxDistance = -1;
        let maxIndex = -1;

        for (let index = startIndex + 1; index < endIndex; index++) {
            const distance = pointToSegmentDistance(coordinates[index], coordinates[startIndex], coordinates[endIndex]);
            if (distance > maxDistance) {
                maxDistance = distance;
                maxIndex = index;
            }
        }

        if (maxIndex !== -1 && maxDistance > tolerance) {
            keep[maxIndex] = true;
            stack.push([startIndex, maxIndex], [maxIndex, endIndex]);
        }
    }

    return coordinates.filter((_, index) => keep[index]);
};

export default douglasPeucker;
