import type { Coordinate } from './types';
export type { Coordinate } from './types';
/**
 * Simplifies an ordered geographic trajectory using the Douglas-Peucker algorithm.
 *
 * @param coordinates The original trajectory coordinates.
 * @param tolerance Maximum point-to-segment distance in meters.
 * @returns A new array containing original coordinate objects in input order.
 */
export declare const douglasPeucker: <T extends Coordinate>(coordinates: readonly T[], tolerance?: number) => T[];
export default douglasPeucker;
