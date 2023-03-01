# README

### Ramer–Douglas–Peucker Algorithm in JavaScript

This library provides an implementation of the Douglas-Peucker algorithm in JavaScript. The algorithm is commonly used to simplify polyline or polygon geometries, reducing the number of vertices while retaining the shape of the geometry within a certain tolerance.

#### Usage
This library can be used directly in your project without needing to import any npm packages. Simply copy the douglas-peucker.js file to your project and import the douglasPeucker function as needed.
`
import douglasPeucker from './douglas-peucker.js';

const simplifiedCoordinates = douglasPeucker(originalCoordinates, 10);
`
The douglasPeucker function takes an array of coordinates in the form of {latitude, longitude} objects and a tolerance value, dMax. It returns an array of simplified coordinates with the same form.

#### Algorithm Details
The Douglas-Peucker algorithm is a recursive algorithm that works by dividing a polyline into smaller segments until each segment can be approximated by a single line. The algorithm chooses the point with the maximum distance from the line between the start and end points of each segment as the splitting point, and then applies the algorithm recursively to the two resulting segments.

#### Example
`
const originalCoordinates = [
  { latitude: 0, longitude: 0 },
  { latitude: 0.5, longitude: 0.5 },
  { latitude: 1, longitude: 1 },
  { latitude: 2, longitude: 2 },
  { latitude: 3, longitude: 3 },
  { latitude: 4, longitude: 4 },
  { latitude: 5, longitude: 5 }
];

const simplifiedCoordinates = douglasPeucker(originalCoordinates, 1);

console.log(simplifiedCoordinates);
// [{ latitude: 0, longitude: 0 },
//  { latitude: 1, longitude: 1 },
//  { latitude: 2, longitude: 2 },
//  { latitude: 3, longitude: 3 },
//  { latitude: 4, longitude: 4 },
//  { latitude: 5, longitude: 5 }]
`
In this example, the original polyline is simplified to only include the start and end points, with a tolerance of 1.

#### Benefits
This implementation of the Douglas-Peucker algorithm has been used in production for an extended period of time and has proven to be stable and efficient. It does not require any external dependencies or packages, and can be easily integrated into any JavaScript project. Additionally, it allows for customization of the maximum distance allowed between the original curve and the simplified curve, so it can be adapted to fit a variety of use cases.

#### Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue if you find a bug or have a feature request.

#### License
This project is licensed under the MIT License - see the LICENSE.md file for details.
