// export const EPS = 0.0000001;

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

export function degToRad(deg) {
  return deg * (Math.PI / 180);
}

export function getDistanceBetweenPoints([x1, y1], [x2, y2]) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function signedDistanceToCircle([px, py], { center: [cx, cy], radius }) {
  return getDistanceBetweenPoints([cx, cy], [px, py]) - radius;
}

// function segmentToGeneralForm([[x1, y1], [x2, y2]]) {
//   const a = y1 - y2;
//   const b = x2 - x1;
//   const c = x2 * y1 - x1 * y2;
//   return [a, b, c];
// }

// // Checks if a point 'pt' is inside the rect defined by (x1,y1), (x2,y2)
// function isPointInRectangle([px, py], [x1, y1, x2, y2]) {
//   const x = Math.min(x1, x2);
//   const y = Math.min(y1, y2);
//   const X = Math.max(x1, x2);
//   const Y = Math.max(y1, y2);
//   return x - EPS <= px && px <= X + EPS && y - EPS <= py && py <= Y + EPS;
// }

// export function getLineCircleIntersection(circle, [a, b, c]) {
//   const [cx, cy, r] = circle;

//   // Solve for the variable x with the formulas: ax + by = c (equation of line)
//   // and (x-X)^2 + (y-Y)^2 = r^2 (equation of circle where X,Y are known) and expand to obtain quadratic:
//   // (a^2 + b^2)x^2 + (2abY - 2ac + - 2b^2X)x + (b^2X^2 + b^2Y^2 - 2bcY + c^2 - b^2r^2) = 0
//   // Then use quadratic formula X = (-b +- sqrt(a^2 - 4ac))/2a to find the
//   // roots of the equation (if they exist) and this will tell us the intersection points

//   // In general a quadratic is written as: Ax^2 + Bx + C = 0
//   // (a^2 + b^2)x^2 + (2abY - 2ac + - 2b^2X)x + (b^2X^2 + b^2Y^2 - 2bcY + c^2 - b^2r^2) = 0
//   var A = a ** 2 + b ** 2;
//   var B = 2 * a * b * cy - 2 * a * c - 2 * b ** 2 * cx;
//   var C =
//     b ** 2 * cx ** 2 +
//     b ** 2 * cy ** 2 -
//     2 * b * c * cy +
//     c * c -
//     b ** 2 * r ** 2;

//   // Use quadratic formula x = (-b +- sqrt(a^2 - 4ac))/2a to find the
//   // roots of the equation (if they exist).

//   var D = B * B - 4 * A * C;
//   var x1, y1, x2, y2;

//   // Handle vertical line case with b = 0
//   if (Math.abs(b) < EPS) {
//     // Line equation is ax + by = c, but b = 0, so x = c/a
//     x1 = c / a;

//     // No intersection
//     if (Math.abs(cx - x1) > r) return [];

//     // Vertical line is tangent to circle
//     if (Math.abs(x1 - r - cx) < EPS || Math.abs(x1 + r - cx) < EPS)
//       return [[x1, cy]];

//     var dx = Math.abs(x1 - cx);
//     var dy = Math.sqrt(r * r - dx * dx);

//     // Vertical line cuts through circle
//     return [[x1, cy + dy], [x1, cy - dy]];

//     // Line is tangent to circle
//   } else if (Math.abs(D) < EPS) {
//     x1 = -B / (2 * A);
//     y1 = (c - a * x1) / b;

//     return [[x1, y1]];

//     // No intersection
//   } else if (D < 0) {
//     return [];
//   } else {
//     D = Math.sqrt(D);

//     x1 = (-B + D) / (2 * A);
//     y1 = (c - a * x1) / b;

//     x2 = (-B - D) / (2 * A);
//     y2 = (c - a * x2) / b;

//     return [[x1, y1], [x2, y2]];
//   }
// }

// export function getSegmentCircleIntersection(segment, circle) {
//   const lineGeneralForm = segmentToGeneralForm(segment);
//   const lineIntersections = getLineCircleIntersection(circle, lineGeneralForm);

//   if (lineIntersections.length === 0) return [];

//   const [[x1, y1], [x2, y2]] = segment;
//   return lineIntersections.filter(point =>
//     isPointInRectangle(point, [x1, y1, x2, y2]),
//   );
// }
