"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visvalingamWhyatt = void 0;
const geometry_1 = require("./geometry");
class MinHeap {
    constructor(compare) {
        this.compare = compare;
        this.items = [];
    }
    get size() {
        return this.items.length;
    }
    push(item) {
        this.items.push(item);
        this.bubbleUp(this.items.length - 1);
    }
    pop() {
        if (this.items.length === 0) {
            return undefined;
        }
        const root = this.items[0];
        const last = this.items.pop();
        if (this.items.length > 0) {
            this.items[0] = last;
            this.bubbleDown(0);
        }
        return root;
    }
    bubbleUp(index) {
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
    bubbleDown(index) {
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
    swap(leftIndex, rightIndex) {
        const value = this.items[leftIndex];
        this.items[leftIndex] = this.items[rightIndex];
        this.items[rightIndex] = value;
    }
}
const queueNode = (heap, node) => {
    if (!node.previous || !node.next || node.removed) {
        return;
    }
    node.area = (0, geometry_1.triangleArea)(node.previous.point, node.point, node.next.point);
    node.version += 1;
    heap.push({ node, area: node.area, version: node.version });
};
const visvalingamWhyatt = (coordinates, areaTolerance = 1) => {
    (0, geometry_1.validateCoordinates)(coordinates);
    (0, geometry_1.validateTolerance)('Visvalingam-Whyatt area', areaTolerance);
    if (coordinates.length <= 2) {
        return [...coordinates];
    }
    const nodes = coordinates.map((point, index) => ({
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
    const heap = new MinHeap((left, right) => left.area - right.area);
    for (let index = 1; index < nodes.length - 1; index++) {
        queueNode(heap, nodes[index]);
    }
    while (heap.size > 0) {
        const item = heap.pop();
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
exports.visvalingamWhyatt = visvalingamWhyatt;
exports.default = exports.visvalingamWhyatt;
