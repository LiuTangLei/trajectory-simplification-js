"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.douglasPeucker = void 0;
const geometry_1 = require("./geometry");
/**
 * Simplifies an ordered geographic trajectory using the Douglas-Peucker algorithm.
 *
 * @param coordinates The original trajectory coordinates.
 * @param tolerance Maximum point-to-segment distance in meters.
 * @returns A new array containing original coordinate objects in input order.
 */
const douglasPeucker = (coordinates, tolerance = 10) => {
    (0, geometry_1.validateCoordinates)(coordinates);
    (0, geometry_1.validateTolerance)('Douglas-Peucker', tolerance);
    if (coordinates.length <= 2) {
        return [...coordinates];
    }
    const keep = new Array(coordinates.length).fill(false);
    keep[0] = true;
    keep[coordinates.length - 1] = true;
    const stack = [[0, coordinates.length - 1]];
    while (stack.length > 0) {
        const [startIndex, endIndex] = stack.pop();
        if (endIndex <= startIndex + 1) {
            continue;
        }
        let maxDistance = -1;
        let maxIndex = -1;
        for (let index = startIndex + 1; index < endIndex; index++) {
            const distance = (0, geometry_1.pointToSegmentDistance)(coordinates[index], coordinates[startIndex], coordinates[endIndex]);
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
exports.douglasPeucker = douglasPeucker;
exports.default = exports.douglasPeucker;
