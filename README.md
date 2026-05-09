# Trajectory Simplification JS

Trajectory Simplification JS is a small TypeScript library for simplifying ordered geographic trajectories. It keeps a focused set of algorithms with clear error semantics and removes the older experimental implementations that duplicated behavior or did not provide reliable guarantees.

All distances are measured in meters. Coordinates use latitude and longitude in degrees.

## Install

```bash
npm install trajectory-simplification-js
```

## Usage

```ts
import {douglasPeucker, radialDistance, visvalingamWhyatt, imaiIriSimplify} from 'trajectory-simplification-js';

const points = [
  {latitude: 48.8566, longitude: 2.3522, timestamp: 1},
  {latitude: 48.8570, longitude: 2.3530, timestamp: 2},
  {latitude: 48.8584, longitude: 2.3560, timestamp: 3},
];

const simplified = douglasPeucker(points, 25);
```

The returned array preserves the original coordinate objects, including custom fields such as `timestamp`, and always keeps the first and last point.

## Coordinate Type

```ts
interface Coordinate {
  latitude: number;
  longitude: number;
}
```

Input coordinates must contain at least two points. Latitude must be between `-90` and `90`, longitude must be between `-180` and `180`, and tolerances must be finite numbers greater than or equal to `0`.

## Algorithms

| Algorithm | Function | Tolerance | Best For | Notes |
| --- | --- | --- | --- | --- |
| Radial Distance | `radialDistance(points, tolerance)` | Distance in meters from the last kept point | Fast pre-filtering and dense GPS traces | Linear time, very fast, but does not bound perpendicular shape error. |
| Douglas-Peucker | `douglasPeucker(points, tolerance)` | Maximum point-to-segment distance in meters | General-purpose shape-preserving simplification | Good default choice when you need a clear distance error bound. |
| Visvalingam-Whyatt | `visvalingamWhyatt(points, areaTolerance)` | Triangle area in square meters | Removing visually insignificant detail | Uses a heap and linked neighbors so affected triangle areas are recalculated correctly. |
| Imai-Iri | `imaiIriSimplify(points, tolerance)` | Maximum point-to-segment distance in meters | Finding the shortest valid simplified path | Exact but more expensive; use for moderate-sized trajectories where minimal point count matters. |

## Choosing An Algorithm

Use `radialDistance` when performance is the main goal and approximate cleanup is enough. It is also useful as a first pass before Douglas-Peucker on very dense traces.

Use `douglasPeucker` as the default simplifier for most trajectories. It keeps points that exceed the configured distance from their replacement segment and preserves the original point order.

Use `visvalingamWhyatt` when visual smoothness matters more than a strict perpendicular distance bound. The tolerance is an area threshold, so values are not directly comparable to the meter-based algorithms.

Use `imaiIriSimplify` when you need the minimum number of points that still respects the distance tolerance. Its worst-case cost is higher because candidate links must be validated against intermediate points.

## Removed Implementations

The previous `Lang`, `Opheim`, `Sliding-Window`, `Priority-Queue`, and `Topological-Preserving-Simplification` files were removed during the refactor.

- `Lang` duplicated Douglas-Peucker-style behavior but could return unstable ordering.
- `Priority-Queue` duplicated Visvalingam-Whyatt but did not update neighboring triangle areas correctly and returned points out of order.
- `Topological-Preserving-Simplification` did not actually preserve topology and used an invalid cross-track calculation.
- `Opheim` and `Sliding-Window` did not expose a dependable simplification error guarantee for this package's API.

## Development

```bash
npm install
npm run check
```

`npm run check` builds the TypeScript output in `dist/` and runs the deterministic unit tests.

## License

MIT. See [LICENSE.md](LICENSE.md).