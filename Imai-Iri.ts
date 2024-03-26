interface Coordinate {
  latitude: number;
  longitude: number;
}

const isValidLink = (coordinates: Coordinate[], startIndex: number, endIndex: number, epsilon: number): boolean => {
  // Calculate the distance using the Haversine formula to consider the Earth's curvature
  const start = coordinates[startIndex];
  const end = coordinates[endIndex];
  const distance = haversineDistance(start, end);

  // If the distance is within epsilon, the link is considered valid
  return distance <= epsilon;
};

const haversineDistance = (start: Coordinate, end: Coordinate): number => {
  const R = 6370996.81; // Earth's radius in meters
  const phi1 = start.latitude * Math.PI/180;
  const phi2 = end.latitude * Math.PI/180;
  const deltaPhi = (end.latitude - start.latitude) * Math.PI/180;
  const deltaLambda = (end.longitude - start.longitude) * Math.PI/180;

  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

// 假设其他函数和类型定义保持不变

const findShortestPath = (graph: boolean[][], n: number): number[] => {
  // 初始化动态规划数组和前驱节点数组
  const dp = new Array(n).fill(Infinity);
  const prev = new Array(n).fill(-1);
  dp[0] = 0;

  // 更新dp数组和前驱节点
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (graph[i][j] && dp[i] + 1 < dp[j]) {
        dp[j] = dp[i] + 1;
        prev[j] = i;
      }
    }
  }

  // 从终点回溯至起点构建路径
  let current = n - 1;
  const path = [];
  while (current !== -1) {
    path.push(current);
    current = prev[current];
  }
  path.reverse();

  return path.length > 1 ? path : []; // 如果路径有效（长度大于1），则返回路径，否则返回空数组
};

// Converts the polyline into a sequence of segments and applies the Imai-Iri simplification.
// The function calculates valid links and finds the shortest path that represents the original polyline within the given epsilon.
export const imaiIriSimplify = (coordinates: Coordinate[], epsilon: number): Coordinate[] => {
  const n: number = coordinates.length;
  if (n < 2) throw new Error("Invalid input: coordinates array must have at least two points.");

  // Initialize a graph to represent valid links between points
  const graph: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));

  // Populate the graph with valid links
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isValidLink(coordinates, i, j, epsilon)) {
        graph[i][j] = true;
      }
    }
  }

  // Find the shortest path through the graph of valid links
  const pathIndices: number[] = findShortestPath(graph, n);

  // Reconstruct the simplified polyline
  return pathIndices.map(index => coordinates[index]);
};