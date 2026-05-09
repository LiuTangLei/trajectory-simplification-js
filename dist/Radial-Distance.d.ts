import type { Coordinate } from './types';
export type { Coordinate } from './types';
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
export declare const radialDistance: <T extends Coordinate>(coordinates: readonly T[], tolerance?: number) => T[];
export default radialDistance;
