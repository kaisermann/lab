export function degToRad(deg) {
  return deg * (Math.PI / 180);
}

export function radToDeg(rad) {
  return rad * (180 / Math.PI);
}

export function truncateBetween(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

export function getVectorModulus([x, y]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

export function getNormalizedVector([x, y]) {
  const mod = getVectorModulus([x, y]);
  return [x / mod, y / mod];
}
export function getDistanceBetweenPoints([x1, y1], [x2, y2]) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function signedDistanceToCircle([px, py], { center: [cx, cy], radius }) {
  return getDistanceBetweenPoints([cx, cy], [px, py]) - radius;
}
export function getDotProduct([x1, y1], [x2, y2]) {
  return x1 * x2 + y1 * y2;
}

export function getCrossProduct([x1, y1], [x2, y2]) {
  return x1 * y2 - x2 * y2;
}

export function getSegmentVector([x1, y1], [x2, y2]) {
  return [x2 - x1, y2 - y1];
}
