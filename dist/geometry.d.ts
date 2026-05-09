import type { Coordinate } from './types';
export declare const EARTH_RADIUS_METERS = 6371008.8;
export declare const validateCoordinates: <T extends Coordinate>(coordinates: readonly T[], minLength?: number) => void;
export declare const validateTolerance: (name: string, tolerance: number) => void;
export declare const haversineDistance: <T extends Coordinate>(start: T, end: T) => number;
export declare const pointToSegmentDistance: <T extends Coordinate>(point: T, start: T, end: T) => number;
export declare const triangleArea: <T extends Coordinate>(a: T, b: T, c: T) => number;
