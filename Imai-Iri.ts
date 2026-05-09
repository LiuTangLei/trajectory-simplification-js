import {pointToSegmentDistance, validateCoordinates, validateTolerance} from './geometry';
import type {Coordinate} from './types';

export type {Coordinate} from './types';

const isValidLink = <T extends Coordinate>(coordinates: readonly T[], startIndex: number, endIndex: number, tolerance: number): boolean => {
    if (endIndex <= startIndex + 1) {
        return true;
    }

    const start = coordinates[startIndex];
    const end = coordinates[endIndex];

    for (let index = startIndex + 1; index < endIndex; index++) {
        if (pointToSegmentDistance(coordinates[index], start, end) > tolerance) {
            return false;
        }
    }

    return true;
};

const reconstructPath = (previous: number[]): number[] => {
    const path: number[] = [];

    for (let current = previous.length - 1; current !== -1; current = previous[current]) {
        path.push(current);
    }

    return path.reverse();
};

export const imaiIriSimplify = <T extends Coordinate>(coordinates: readonly T[], tolerance = 10): T[] => {
    validateCoordinates(coordinates);
    validateTolerance('Imai-Iri', tolerance);

    if (coordinates.length <= 2) {
        return [...coordinates];
    }

    const shortestSegmentCount = new Array<number>(coordinates.length).fill(Infinity);
    const previous = new Array<number>(coordinates.length).fill(-1);
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

export default imaiIriSimplify;