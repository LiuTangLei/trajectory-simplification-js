// 计算两点之间的距离
const calculationDistance = (point1, point2) => {
    const lat1 = point1.latitude;
    const lat2 = point2.latitude;
    const lng1 = point1.longitude;
    const lng2 = point2.longitude;
    const radLat1 = lat1 * Math.PI / 180.0;
    const radLat2 = lat2 * Math.PI / 180.0;
    const a = radLat1 - radLat2;
    const b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);
    const s = Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2))) * 2;
    return s * 6370996.81;
};
// 计算点pX到点pA和pB所确定的直线的距离
const distToSegment = (start, end, center) => {
    const a = Math.abs(calculationDistance(start, end));
    const b = Math.abs(calculationDistance(start, center));
    const c = Math.abs(calculationDistance(end, center));
    const p = (a + b + c) / 2.0;
    const s = Math.sqrt(Math.abs(p * (p - a) * (p - b) * (p - c)));
    return s * 2.0 / a;
};
// 递归方式压缩轨迹
const compressLine = (coordinate, result, start, end, dMax) => {
    if (start < end) {
        let maxDist = 0;
        let currentIndex = 0;
        const startPoint = coordinate[start];
        const endPoint = coordinate[end];
        for (let i = start + 1; i < end; i++) {
            const currentDist = distToSegment(startPoint, endPoint, coordinate[i]);
            if (currentDist > maxDist) {
                maxDist = currentDist;
                currentIndex = i;
            }
        }
        if (maxDist >= dMax) {
            // 将当前点加入到过滤数组中
            result.push(coordinate[currentIndex]);
            // 将原来的线段以当前点为中心拆成两段，分别进行递归处理
            compressLine(coordinate, result, start, currentIndex, dMax);
            compressLine(coordinate, result, currentIndex, end, dMax);
        }
    }
    return result;
};

/**
 *
 * @param coordinate 原始轨迹Array<{latitude,longitude}>
 * @param dMax 允许最大距离误差
 * @return douglasResult 抽稀后的轨迹
 *
 */
const douglasPeucker = (coordinate, dMax = 10) => {
    if (!coordinate || !(coordinate.length > 2)) {
        return null;
    }
    coordinate.forEach((item, index) => {
        item.douglasPeuckerId = index;
    });
    const result = compressLine(coordinate, [], 0, coordinate.length - 1, dMax);
    result.push(coordinate[0]);
    result.push(coordinate[coordinate.length - 1]);
    const resultLatLng = result.sort((a, b) => {
        if (a.douglasPeuckerId < b.douglasPeuckerId) {
            return -1;
        } else if (a.douglasPeuckerId > b.douglasPeuckerId) {
            return 1;
        }
        return 0;
    });
    resultLatLng.forEach(item => {
        delete item.douglasPeuckerId;
    });
    return resultLatLng;
};

export default { douglasPeucker };
