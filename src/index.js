import {
  getDistanceBetweenPoints,
  signedDistanceToCircle,
  truncateBetween,
  degToRad,
  getSegmentVector,
} from './utils.js';

const KEYS_PRESSED = {};
const MOUSE = {
  position: { x: null, y: false },
  isDown: false,
};

let animationRequest;
let canvasDiagonalLength;

const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

const obstacles = [
  { center: [500, 200], radius: 50, color: '#F08080' },
  { center: [800, 100], radius: 100, color: '#FFF176' },
  { center: [100, 300], radius: 80, color: '#D8BFD8' },
  { center: [150, 50], radius: 40, color: '#A5D6A7' },
  { center: [500, 800], radius: 120, color: '#880E4F' },
  { center: [190, 600], radius: 70, color: '#0097A7' },
];

const hero = {
  position: null,
  angle: null,
  directionVector: null,
  move() {
    let [nx, ny] = this.position;
    let delta = 5;
    if (KEYS_PRESSED['arrowup'] || KEYS_PRESSED['arrowdown']) {
      const [dx, dy] = this.directionVector;
      const forwardDelta = delta * (KEYS_PRESSED['arrowup'] ? 1 : -1);
      [nx, ny] = [nx + forwardDelta * dx, ny + forwardDelta * dy];
    } else {
      if (KEYS_PRESSED['w']) {
        ny = ny - delta;
      } else if (KEYS_PRESSED['s']) {
        ny = ny + delta;
      }

      if (KEYS_PRESSED['a']) {
        nx = nx - delta;
      } else if (KEYS_PRESSED['d']) {
        nx = nx + delta;
      }
    }

    nx = truncateBetween(nx, 0, canvas.width);
    ny = truncateBetween(ny, 0, canvas.height);

    this.updatePosition([nx, ny]);
  },
  rotate() {
    let delta = degToRad(1);
    if (MOUSE.isDown) {
      hero.updateAngle(getSegmentVector(this.position, MOUSE.position));
    } else if (KEYS_PRESSED['arrowright']) {
      hero.updateAngle(this.angle - delta);
    } else if (KEYS_PRESSED['arrowleft']) {
      hero.updateAngle(this.angle + delta);
    }
  },
  updateAngle(angle) {
    if (Array.isArray(angle)) {
      angle = Math.atan2(1, 0) - Math.atan2(angle[1], angle[0]);
    }
    this.angle = angle;
    this.directionVector = [Math.sin(angle), Math.cos(angle)];
  },
  updatePosition(newPoint) {
    const hasCollided = obstacles.some(
      ({ center: [x, y], radius }) =>
        getDistanceBetweenPoints([x, y], newPoint) <= radius,
    );

    if (hasCollided) {
      return;
    }

    this.position = newPoint;
  },
};

const ray = {
  segments: [],
  collidedObject: null,
  /** return tuple of [obstacle,distanceToIt] */
  getClosestObstacle(point) {
    return obstacles.reduce(
      (acc, circle) => {
        const distance = signedDistanceToCircle(point, circle);
        if (distance < acc[1]) {
          acc = [circle, distance];
        }
        return acc;
      },
      [null, Number.MAX_SAFE_INTEGER],
    );
  },
  getSegments(origin, directionVector) {
    this.segments = [];
    const u = directionVector;

    let [closestObstacle, distance] = this.getClosestObstacle(origin);
    let point = origin;
    this.segments.push([point, distance]);

    while (distance > 0.0001 && distance <= canvasDiagonalLength) {
      point = [point[0] + distance * u[0], point[1] + distance * u[1]];
      [closestObstacle, distance] = this.getClosestObstacle(point);
      this.segments.push([point, distance]);
    }

    this.collidedObject = distance < 0.1 ? closestObstacle : null;
  },
  getCollisionPoint() {
    return this.segments[this.segments.length - 1][0];
  },
  render() {
    ctx.lineWidth = 2;

    this.segments.forEach(([center, radius], i) => {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      if (this.collidedObject) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = this.collidedObject.color;
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
      }
      ctx.arc(...center, radius, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.arc(...center, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.beginPath();
    ctx.moveTo(...hero.position);
    ctx.lineTo(...this.getCollisionPoint());
    ctx.stroke();

    ctx.lineWidth = 1;
  },
};

const loop = () => {
  animationRequest = window.requestAnimationFrame(loop);

  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  hero.move();
  hero.rotate();

  ray.getSegments(hero.position, hero.directionVector);

  ctx.fillStyle = 'rgba(255,255,255,0.2)';

  obstacles.forEach(obstacle => {
    ctx.beginPath();
    // ctx.fillStyle = obstacle.color;
    ctx.arc(...obstacle.center, obstacle.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ray.render();
};

const init = () => {
  const isMovementKey = key =>
    key === 'w' ||
    key === 's' ||
    key === 'd' ||
    key === 'a' ||
    key === 'arrowleft' ||
    key === 'arrowright' ||
    key === 'arrowup' ||
    key === 'arrowdown';

  const updateCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasDiagonalLength = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
    return updateCanvasSize;
  };
  updateCanvasSize();

  window.addEventListener('resize', updateCanvasSize);
  window.addEventListener('keyup', e => {
    delete KEYS_PRESSED[e.key.toLowerCase()];
    if (e.key === ' ' || e.code === 'Space') {
      if (animationRequest) {
        cancelAnimationFrame(animationRequest);
        animationRequest = null;
      } else {
        animationRequest = requestAnimationFrame(loop);
      }
    }
  });
  window.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();

    KEYS_PRESSED[key] = true;
    if (isMovementKey(key)) {
      e.preventDefault();
    }
  });
  canvas.addEventListener('mousemove', e => {
    MOUSE.position = [e.clientX, e.clientY];
  });
  canvas.addEventListener('mouseup', e => {
    MOUSE.isDown = false;
  });
  canvas.addEventListener('mousedown', e => {
    MOUSE.isDown = true;
  });

  /** Start position and angle */
  hero.updatePosition([canvas.width / 2, canvas.height / 2]);
  hero.updateAngle(140);

  /** start loop */
  animationRequest = window.requestAnimationFrame(loop);
};

init();
