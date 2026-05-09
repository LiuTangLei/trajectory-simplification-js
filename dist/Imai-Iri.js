"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imaiIriSimplify = void 0;
const geometry_1 = require("./geometry");
const isValidLink = (coordinates, startIndex, endIndex, tolerance) => {
    if (endIndex <= startIndex + 1) {
        return true;
    }
    const start = coordinates[startIndex];
    const end = coordinates[endIndex];
    for (let index = startIndex + 1; index < endIndex; index++) {
        if ((0, geometry_1.pointToSegmentDistance)(coordinates[index], start, end) > tolerance) {
            return false;
        }
    }
    return true;
};
const reconstructPath = (previous) => {
    const path = [];
    for (let current = previous.length - 1; current !== -1; current = previous[current]) {
        path.push(current);
    }
    return path.reverse();
};
const imaiIriSimplify = (coordinates, tolerance = 10) => {
    (0, geometry_1.validateCoordinates)(coordinates);
    (0, geometry_1.validateTolerance)('Imai-Iri', tolerance);
    if (coordinates.length <= 2) {
        return [...coordinates];
    }
    const shortestSegmentCount = new Array(coordinates.length).fill(Infinity);
    const previous = new Array(coordinates.length).fill(-1);
    shortestSegmentCount[0] = 0;
    for (let startIndex = 0; startIndex < coordinates.length - 1; startIndex++) {
        if (!Number.isFinite(shortestSegmentCount[startIndex])) {
            continue;
        }
        for (let endIndex = startIndex + 1; endIndex < coordinates.length; endIndex++) {
            const candidateSegmentCount = shortestSegmentCount[startIndex] + 1;
            if (candidateSegmentCount >= shortestSegmentCount[endIndex]) {
                continue;
            }
            if (isValidLink(coordinates, startIndex, endIndex, tolerance)) {
                shortestSegmentCount[endIndex] = candidateSegmentCount;
                previous[endIndex] = startIndex;
            }
        }
    }
    return reconstructPath(previous).map(index => coordinates[index]);
};
exports.imaiIriSimplify = imaiIriSimplify;
exports.default = exports.imaiIriSimplify;
