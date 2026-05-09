"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triangleArea = exports.pointToSegmentDistance = exports.haversineDistance = exports.validateTolerance = exports.validateCoordinates = exports.EARTH_RADIUS_METERS = void 0;
exports.EARTH_RADIUS_METERS = 6371008.8;
const MIN_SEGMENT_LENGTH_METERS = 1e-9;
const toRadians = (degree) => degree * Math.PI / 180;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const normalizeLongitudeDelta = (delta) => ((delta + 540) % 360) - 180;
const validateCoordinates = (coordinates, minLength = 2) => {
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
exports.validateCoordinates = validateCoordinates;
const validateTolerance = (name, tolerance) => {
    if (!Number.isFinite(tolerance) || tolerance < 0) {
        throw new Error(`Invalid ${name}: tolerance must be a finite number greater than or equal to 0.`);
    }
};
exports.validateTolerance = validateTolerance;
const haversineDistance = (start, end) => {
    const startLatitude = toRadians(start.latitude);
    const endLatitude = toRadians(end.latitude);
    const latitudeDelta = toRadians(end.latitude - start.latitude);
    const longitudeDelta = toRadians(end.longitude - start.longitude);
    const haversine = Math.sin(latitudeDelta / 2) ** 2
        + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;
    return exports.EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};
exports.haversineDistance = haversineDistance;
const initialBearing = (start, end) => {
    const startLatitude = toRadians(start.latitude);
    const endLatitude = toRadians(end.latitude);
    const longitudeDelta = toRadians(end.longitude - start.longitude);
    const y = Math.sin(longitudeDelta) * Math.cos(endLatitude);
    const x = Math.cos(startLatitude) * Math.sin(endLatitude)
        - Math.sin(startLatitude) * Math.cos(endLatitude) * Math.cos(longitudeDelta);
    return Math.atan2(y, x);
};
const pointToSegmentDistance = (point, start, end) => {
    const segmentLength = (0, exports.haversineDistance)(start, end);
    if (segmentLength <= MIN_SEGMENT_LENGTH_METERS) {
        return (0, exports.haversineDistance)(point, start);
    }
    const startToPoint = (0, exports.haversineDistance)(start, point);
    if (startToPoint <= MIN_SEGMENT_LENGTH_METERS) {
        return 0;
    }
    const angularStartToPoint = startToPoint / exports.EARTH_RADIUS_METERS;
    const bearingStartToPoint = initialBearing(start, point);
    const bearingStartToEnd = initialBearing(start, end);
    const bearingDelta = bearingStartToPoint - bearingStartToEnd;
    const crossTrackAngle = Math.asin(clamp(Math.sin(angularStartToPoint) * Math.sin(bearingDelta), -1, 1));
    const alongTrackDistance = Math.atan2(Math.sin(angularStartToPoint) * Math.cos(bearingDelta), Math.cos(angularStartToPoint)) * exports.EARTH_RADIUS_METERS;
    if (alongTrackDistance <= 0) {
        return startToPoint;
    }
    if (alongTrackDistance >= segmentLength) {
        return (0, exports.haversineDistance)(point, end);
    }
    return Math.abs(crossTrackAngle * exports.EARTH_RADIUS_METERS);
};
exports.pointToSegmentDistance = pointToSegmentDistance;
const triangleArea = (a, b, c) => {
    const referenceLatitude = toRadians((a.latitude + b.latitude + c.latitude) / 3);
    const bX = exports.EARTH_RADIUS_METERS * toRadians(normalizeLongitudeDelta(b.longitude - a.longitude)) * Math.cos(referenceLatitude);
    const bY = exports.EARTH_RADIUS_METERS * toRadians(b.latitude - a.latitude);
    const cX = exports.EARTH_RADIUS_METERS * toRadians(normalizeLongitudeDelta(c.longitude - a.longitude)) * Math.cos(referenceLatitude);
    const cY = exports.EARTH_RADIUS_METERS * toRadians(c.latitude - a.latitude);
    return Math.abs((bX * cY - cX * bY) / 2);
};
exports.triangleArea = triangleArea;
