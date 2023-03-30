interface Coordinate {
    latitude: number;
    longitude: number;
}

const EARTH_RADIUS = 6370996.81;

// Calculate the distance between two points
const calculateDistance = <T extends Coordinate>(point1: T, point2: T): number => {
    const { latitude: lat1, longitude: lng1 } = point1;
    const { latitude: lat2, longitude: lng2 } = point2;

    const radLat1 = lat1 * Math.PI / 180.0;
    const radLat2 = lat2 * Math.PI / 180.0;
    const a = radLat1 - radLat2;
    const b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);
    const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));

    return s * EARTH_RADIUS;
};

// Calculate the area of a triangle
const calculateTriangleArea = <T extends Coordinate>(a: T, b: T, c: T): number => {
    const ab = calculateDistance(a, b);
    const bc = calculateDistance(b, c);
    const ca = calculateDistance(c, a);

    const s = (ab + bc + ca) / 2;
    return Math.sqrt(s * (s - ab) * (s - bc) * (s - ca));
};

// Calculate the priority of a point based on the area of the triangle it forms with its neighbors
const calculatePriority = <T extends Coordinate>(point: T, prevPoint: T, nextPoint: T) => {
    return calculateTriangleArea(prevPoint, point, nextPoint);
};

// Priority Queue implementation
class PriorityQueue<T> {
    private _elements: T[];
    private _comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
        this._elements = [];
        this._comparator = comparator;
    }

    enq(element: T) {
        this._elements.push(element);
        this._elements.sort(this._comparator);
    }

    deq(): T | undefined {
        return this._elements.pop();
    }

    size(): number {
        return this._elements.length;
    }
}

const priorityQueueSimplification = <T extends Coordinate>(coordinates: T[], tolerance: number): T[] => {
    // Initialize the priority queue with a custom comparator for triangle area
    const priorityQueue = new PriorityQueue<{ index: number; priority: number }>((a, b) => b.priority - a.priority);

    // Insert all the points (excluding the first and last points) into the priority queue with their priorities
    for (let i = 1; i < coordinates.length - 1; i++) {
        const priority = calculatePriority(coordinates[i], coordinates[i - 1], coordinates[i + 1]);
        priorityQueue.enq({ index: i, priority });
    }

    const simplifiedCoordinates: T[] = [coordinates[0]];

    // Remove points from the priority queue and add them to the simplified coordinates if their priority is greater than or equal to the tolerance
    while (priorityQueue.size() > 0) {
        const { index, priority } = priorityQueue.deq()!;
        if (priority >= tolerance) {
            simplifiedCoordinates.push(coordinates[index]);
        }
    }

    // Add the last coordinate
    simplifiedCoordinates.push(coordinates[coordinates.length - 1]);

    return simplifiedCoordinates;
};

export default { priorityQueueSimplification };
