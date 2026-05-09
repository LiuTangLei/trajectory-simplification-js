import {triangleArea, validateCoordinates, validateTolerance} from './geometry';
import type {Coordinate} from './types';

export type {Coordinate} from './types';

interface LinkedCoordinate<T extends Coordinate> {
    index: number;
    point: T;
    previous?: LinkedCoordinate<T>;
    next?: LinkedCoordinate<T>;
    area: number;
    version: number;
    removed: boolean;
}

interface QueueItem<T extends Coordinate> {
    node: LinkedCoordinate<T>;
    area: number;
    version: number;
}

class MinHeap<T> {
    private readonly items: T[] = [];

    constructor(private readonly compare: (left: T, right: T) => number) {}

    get size(): number {
        return this.items.length;
    }

    push(item: T): void {
        this.items.push(item);
        this.bubbleUp(this.items.length - 1);
    }

    pop(): T | undefined {
        if (this.items.length === 0) {
            return undefined;
        }

        const root = this.items[0];
        const last = this.items.pop()!;
        if (this.items.length > 0) {
            this.items[0] = last;
            this.bubbleDown(0);
        }

        return root;
    }

    private bubbleUp(index: number): void {
        let currentIndex = index;
        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            if (this.compare(this.items[currentIndex], this.items[parentIndex]) >= 0) {
                break;
            }

            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
        }
    }

    private bubbleDown(index: number): void {
        let currentIndex = index;

        while (true) {
            const leftIndex = currentIndex * 2 + 1;
            const rightIndex = leftIndex + 1;
            let smallestIndex = currentIndex;

            if (leftIndex < this.items.length && this.compare(this.items[leftIndex], this.items[smallestIndex]) < 0) {
                smallestIndex = leftIndex;
            }

            if (rightIndex < this.items.length && this.compare(this.items[rightIndex], this.items[smallestIndex]) < 0) {
                smallestIndex = rightIndex;
            }

            if (smallestIndex === currentIndex) {
                break;
            }

            this.swap(currentIndex, smallestIndex);
            currentIndex = smallestIndex;
        }
    }

    private swap(leftIndex: number, rightIndex: number): void {
        const value = this.items[leftIndex];
        this.items[leftIndex] = this.items[rightIndex];
        this.items[rightIndex] = value;
    }
}

const queueNode = <T extends Coordinate>(heap: MinHeap<QueueItem<T>>, node: LinkedCoordinate<T>): void => {
    if (!node.previous || !node.next || node.removed) {
        return;
    }

    node.area = triangleArea(node.previous.point, node.point, node.next.point);
    node.version += 1;
    heap.push({node, area: node.area, version: node.version});
};

export const visvalingamWhyatt = <T extends Coordinate>(coordinates: readonly T[], areaTolerance = 1): T[] => {
    validateCoordinates(coordinates);
    validateTolerance('Visvalingam-Whyatt area', areaTolerance);

    if (coordinates.length <= 2) {
        return [...coordinates];
    }

    const nodes = coordinates.map<LinkedCoordinate<T>>((point, index) => ({
        index,
        point,
        area: Infinity,
        version: 0,
        removed: false,
    }));

    for (let index = 0; index < nodes.length; index++) {
        nodes[index].previous = nodes[index - 1];
        nodes[index].next = nodes[index + 1];
    }

    const heap = new MinHeap<QueueItem<T>>((left, right) => left.area - right.area);
    for (let index = 1; index < nodes.length - 1; index++) {
        queueNode(heap, nodes[index]);
    }

    while (heap.size > 0) {
        const item = heap.pop()!;
        const node = item.node;
        if (node.removed || node.version !== item.version) {
            continue;
        }

        if (item.area >= areaTolerance) {
            break;
        }

        node.removed = true;
        if (node.previous) {
            node.previous.next = node.next;
        }
        if (node.next) {
            node.next.previous = node.previous;
        }

        if (node.previous) {
            queueNode(heap, node.previous);
        }
        if (node.next) {
            queueNode(heap, node.next);
        }
    }

    return nodes.filter(node => !node.removed).map(node => node.point);
};

export default visvalingamWhyatt;
