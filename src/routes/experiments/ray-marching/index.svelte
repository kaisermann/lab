<script>
  import { onMount } from 'svelte';

  import { OBSTACLES } from './consts.js';
  import InputHelper from '../../../components/InputHelper.svelte';

  let mouse = {};
  let keys = {};

  import {
    getDistanceBetweenPoints,
    signedDistanceToCircle,
    clamp,
    degToRad,
    radToDeg,
    getSegmentVector,
    getDistanceBetweenPointRect,
  } from '../../../modules/math.js';

  const MAX_STEPS = 250;

  let canvas;
  let canvasWidth;
  let canvasHeight;
  let canvasDiagonalLength;

  $: ctx = canvas && canvas.getContext('2d');
  $: {
    if (canvas) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }
    canvasDiagonalLength = Math.hypot(canvasWidth, canvasHeight);
  }

  const eye = {
    position: null,
    angle: null,
    directionVector: null,
    move() {
      let [nx, ny] = this.position;
      const delta = 5;

      if (keys.arrowup || keys.arrowdown) {
        const [dx, dy] = this.directionVector;
        const forwardDelta = delta * (keys.arrowup ? 1 : -1);

        [nx, ny] = [nx + forwardDelta * dx, ny + forwardDelta * dy];
      } else {
        if (keys.w) {
          ny -= delta;
        } else if (keys.s) {
          ny += delta;
        }

        if (keys.a) {
          nx -= delta;
        } else if (keys.d) {
          nx += delta;
        }
      }

      nx = clamp(0, nx, canvasWidth);
      ny = clamp(0, ny, canvasHeight);

      this.updatePosition([nx, ny]);
    },
    rotate() {
      const delta = degToRad(1);

      if (mouse.isDown) {
        eye.updateAngle(getSegmentVector(this.position, mouse.position));
      } else if (keys.arrowright) {
        eye.updateAngle(this.angle - delta);
      } else if (keys.arrowleft) {
        eye.updateAngle(this.angle + delta);
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
      const hasCollided = OBSTACLES.some((obstacle) => {
        if (obstacle.radius) {
          const { center, radius } = obstacle;

          return getDistanceBetweenPoints(center, newPoint) <= radius;
        }

        if (obstacle.size) {
          return getDistanceBetweenPointRect(newPoint, obstacle) <= 0;
        }
      });

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
      return OBSTACLES.reduce(
        (acc, obstacle) => {
          const distance = obstacle.radius
            ? signedDistanceToCircle(point, obstacle)
            : getDistanceBetweenPointRect(point, obstacle);

          if (distance < acc[1]) {
            acc = [obstacle, distance];
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

      for (
        let i = 0;
        distance > 0.0001 && distance <= canvasDiagonalLength && i < MAX_STEPS;
        i++
      ) {
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
      ctx.moveTo(...eye.position);
      ctx.lineTo(...this.getCollisionPoint());
      ctx.stroke();

      ctx.lineWidth = 1;
    },
  };

  const loop = () => {
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    eye.move();
    eye.rotate();

    ray.getSegments(eye.position, eye.directionVector);

    ctx.fillStyle = 'rgba(255,255,255,0.2)';

    OBSTACLES.forEach((o) => {
      ctx.beginPath();
      // ctx.fillStyle = obstacle.color;
      if (o.radius) {
        ctx.arc(...o.center, o.radius, 0, Math.PI * 2);
      } else if (o.size) {
        ctx.fillRect(...o.origin, ...o.size);
      }

      ctx.fill();
    });

    ctx.font = '18px monospace';

    if (mouse.position && eye.angle) {
      ctx.fillText(
        `mouse: [${mouse.position[0]},${mouse.position[1]}]  angle: ${radToDeg(
          eye.angle,
        ).toFixed(0)}º`,
        5,
        18,
      );
    }

    ray.render();
    window.requestAnimationFrame(loop);
  };

  onMount(() => {
    eye.updatePosition([20, 20]);
    eye.updateAngle(0);

    window.requestAnimationFrame(loop);
  });
</script>

<style>
  canvas {
    width: 100vw;
    height: 100vh;
  }
</style>

<div bind:offsetHeight={canvasHeight} bind:offsetWidth={canvasWidth}>
  <canvas bind:this={canvas} />
</div>

<InputHelper bind:mouse bind:keys />
