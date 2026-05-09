import {haversineDistance, validateCoordinates, validateTolerance} from './geometry';
import type {Coordinate} from './types';

export type {Coordinate} from './types';

/**
 * Simplifies a given set of geographic coordinates using the Radial-Distance algorithm.
 * This algorithm retains points based on distance from the last point kept in the simplified path.
 *
 * @param {Array<T extends Coordinate>} coordinates - The original list of geographic coordinates.
 * @param {number} tolerance - The radial distance tolerance in meters. Points further away than
 *                             this distance from the previous point in the simplified path are included.
 * @return {Array<T extends Coordinate>} - The simplified list of geographic coordinates.
 * @throws {Error} - If the input coordinates are invalid or tolerance is negative.
 */
export const radialDistance = <T extends Coordinate>(coordinates: readonly T[], tolerance = 10): T[] => {
    validateCoordinates(coordinates);
    validateTolerance('Radial Distance', tolerance);

    if (coordinates.length <= 2) {
        return [...coordinates];
    }

    const simplifiedCoordinates: T[] = [coordinates[0]];
    let previousKeptPoint = coordinates[0];

    for (let index = 1; index < coordinates.length - 1; index++) {
        const point = coordinates[index];
        if (haversineDistance(previousKeptPoint, point) >= tolerance) {
            simplifiedCoordinates.push(point);
            previousKeptPoint = point;
        }
    }

    const lastPoint = coordinates[coordinates.length - 1];
    if (simplifiedCoordinates[simplifiedCoordinates.length - 1] !== lastPoint) {
        simplifiedCoordinates.push(lastPoint);
    }

    return simplifiedCoordinates;
};

export default radialDistance;
