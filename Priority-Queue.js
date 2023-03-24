class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;

        for (let i = 0; i < this.elements.length; i++) {
            if (priority > this.elements[i].priority) {
                this.elements.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        if (!added) {
            this.elements.push(queueElement);
        }
    }

    dequeue() {
        return this.elements.shift().element;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

const topologicalPreservingSimplification = (coordinates, tolerance) => {
    const keep = new Set([0, coordinates.length - 1]);
    const queue = new PriorityQueue();

    for (let i = 1; i < coordinates.length - 1; i++) {
        const distance = distToSegment(coordinates[i - 1], coordinates[i + 1], coordinates[i]);
        queue.enqueue(i, -distance);
    }

    while (!queue.isEmpty()) {
        const currentIndex = queue.dequeue();
        const currentDistance = -distToSegment(coordinates[currentIndex - 1], coordinates[currentIndex + 1], coordinates[currentIndex]);

        if (currentDistance < tolerance) {
            break;
        }

        keep.add(currentIndex);

        let i = currentIndex - 1;
        while (i > 0 && !keep.has(i)) {
            const distance = distToSegment(coordinates[i - 1], coordinates[i + 1], coordinates[i]);
            queue.enqueue(i, -distance);
            i--;
        }

        i = currentIndex + 1;
        while (i < coordinates.length - 1 && !keep.has(i)) {
            const distance = distToSegment(coordinates[i - 1], coordinates[i + 1], coordinates[i]);
            queue.enqueue(i, -distance);
            i++;
        }
    }

    const simplified = [];
    for (let i = 0; i < coordinates.length; i++) {
        if (keep.has(i)) {
            simplified.push(coordinates[i]);
        }
    }

    return simplified;
};
