import type {Coordinate} from './types';

export const EARTH_RADIUS_METERS = 6371008.8;

const MIN_SEGMENT_LENGTH_METERS = 1e-9;

const toRadians = (degree: number): number => degree * Math.PI / 180;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const normalizeLongitudeDelta = (delta: number): number => ((delta + 540) % 360) - 180;

export const validateCoordinates = <T extends Coordinate>(coordinates: readonly T[], minLength = 2): void => {
    if (!Array.isArray(coordinates) || coordinates.length < minLength) {
        throw new Error(`Invalid input: coordinates array must contain at least ${minLength} points.`);
    }

    coordinates.forEach((coordinate, index) => {
        if (!Number.isFinite(coordinate.latitude) || !Number.isFinite(coordinate.longitude)) {
            throw new Error(`Invalid coordinate at index ${index}: latitude and longitude must be finite numbers.`);
        }

        if (coordinate.latitude < -90 || coordinate.latitude > 90) {
            throw new Error(`Invalid coordinate at index ${index}: latitude must be between -90 and 90 degrees.`);
        }

        if (coordinate.longitude < -180 || coordinate.longitude > 180) {
            throw new Error(`Invalid coordinate at index ${index}: longitude must be between -180 and 180 degrees.`);
        }
    });
};

export const validateTolerance = (name: string, tolerance: number): void => {
    if (!Number.isFinite(tolerance) || tolerance < 0) {
        throw new Error(`Invalid ${name}: tolerance must be a finite number greater than or equal to 0.`);
    }
};

export const haversineDistance = <T extends Coordinate>(start: T, end: T): number => {
    const startLatitude = toRadians(start.latitude);
    const endLatitude = toRadians(end.latitude);
    const latitudeDelta = toRadians(end.latitude - start.latitude);
    const longitudeDelta = toRadians(end.longitude - start.longitude);

    const haversine = Math.sin(latitudeDelta / 2) ** 2
        + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;

    return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const initialBearing = <T extends Coordinate>(start: T, end: T): number => {
    const startLatitude = toRadians(start.latitude);
    const endLatitude = toRadians(end.latitude);
    const longitudeDelta = toRadians(end.longitude - start.longitude);

    const y = Math.sin(longitudeDelta) * Math.cos(endLatitude);
    const x = Math.cos(startLatitude) * Math.sin(endLatitude)
        - Math.sin(startLatitude) * Math.cos(endLatitude) * Math.cos(longitudeDelta);

    return Math.atan2(y, x);
};

export const pointToSegmentDistance = <T extends Coordinate>(point: T, start: T, end: T): number => {
    const segmentLength = haversineDistance(start, end);
    if (segmentLength <= MIN_SEGMENT_LENGTH_METERS) {
        return haversineDistance(point, start);
    }

    const startToPoint = haversineDistance(start, point);
    if (startToPoint <= MIN_SEGMENT_LENGTH_METERS) {
        return 0;
    }

    const angularStartToPoint = startToPoint / EARTH_RADIUS_METERS;
    const bearingStartToPoint = initialBearing(start, point);
    const bearingStartToEnd = initialBearing(start, end);
    const bearingDelta = bearingStartToPoint - bearingStartToEnd;

    const crossTrackAngle = Math.asin(clamp(Math.sin(angularStartToPoint) * Math.sin(bearingDelta), -1, 1));
    const alongTrackDistance = Math.atan2(
        Math.sin(angularStartToPoint) * Math.cos(bearingDelta),
        Math.cos(angularStartToPoint),
    ) * EARTH_RADIUS_METERS;

    if (alongTrackDistance <= 0) {
        return startToPoint;
    }

    if (alongTrackDistance >= segmentLength) {
        return haversineDistance(point, end);
    }

    return Math.abs(crossTrackAngle * EARTH_RADIUS_METERS);
};

export const triangleArea = <T extends Coordinate>(a: T, b: T, c: T): number => {
    const referenceLatitude = toRadians((a.latitude + b.latitude + c.latitude) / 3);
    const bX = EARTH_RADIUS_METERS * toRadians(normalizeLongitudeDelta(b.longitude - a.longitude)) * Math.cos(referenceLatitude);
    const bY = EARTH_RADIUS_METERS * toRadians(b.latitude - a.latitude);
    const cX = EARTH_RADIUS_METERS * toRadians(normalizeLongitudeDelta(c.longitude - a.longitude)) * Math.cos(referenceLatitude);
    const cY = EARTH_RADIUS_METERS * toRadians(c.latitude - a.latitude);

    return Math.abs((bX * cY - cX * bY) / 2);
};