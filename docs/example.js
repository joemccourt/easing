(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const { clamp, linear, inOutCubic, oscillator, freefall } = require('../src/easing.js');

let ani = window.requestAnimationFrame;

window.onload = () => {
    let canvas = document.getElementById('demo');
    let ctx = canvas.getContext('2d');
    canvas.style.setProperty('position', 'absolute');
    
    easingDemo(ctx, freefall);
}

const easingDemo = (ctx, easing) => {
    let duration = 10000;
    let p1 = {x: 150, y: 500};
    let p2 = {x: 1000, y: 120};
    let r = 20;
    let t0 = window.performance.now();

    const easingFrame = () => {
        ctx.clearRect(0, 0, 1200, 1200);

        ctx.strokeStyle = 'black';

        ctx.beginPath();
        ctx.moveTo(p1.x + r, p1.y);
        ctx.arc(p1.x, p1.y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p2.x + r, p2.y);
        ctx.arc(p2.x, p2.y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();

        let t = window.performance.now();
        let x0 = (t - t0) / duration;
        let x = clamp(x0);
        x = easing(x);
        // console.log(x0, x);

        let p = {
            x: p1.x * (1 - x) + p2.x * x,
            y: p1.y * (1 - x) + p2.y * x    
        };

        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(p.x + r, p.y);
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        if (x0 < 1) {
            ani(easingFrame);
        }
    };

    ani(easingFrame);
};

},{"../src/easing.js":2}],2:[function(require,module,exports){
const clamp = (x) => {
    return Math.max(0, Math.min(1, x));
};

const linear = (x) => {
    return x;
};

const inOutExp = (x, pow) => {
    x *= 2; // [0, 2]
    if (x < 1) {
        return Math.pow(x, pow) / 2; // [0, 0.5]
    }
    x = 2 - x; // [1, 0]
    return 1 - Math.pow(x, pow) / 2;
}

const inOutQuadratic = (x) => {
    return inOutExp(x, 2);
}

const inOutCubic = (x) => {
    return inOutExp(x, 3);
}

const oscillator = (x, damping = 1) => {
    // x *= 10;
    // alter time to finish roughtly at x == 1
    // xFinal ~= e-10
    // damping * 1 * k == 5
    if (x === 1) { return 1; }
    x *= 10 / damping;

    return 1 - Math.exp(-damping * x) * Math.cos(x);
};

// h = v0 * t + g / 2 * t * t
const freefall = (x, g = 5, coeff = 0.3) => {
    let maxBounces = 100; // safety against inf loops

    // h * c = (vC * v)^2 / 2g
    // sqrt(2 * g * c) / v0
    let v0 = g * Math.sqrt(2 / g);
    let vCoeff = Math.sqrt(2 * g * coeff) / v0;

    // speedup to finish roughly on time
    // sqrt(2/g) + 2 * v0 / g * (vCoeff + vCoeff^2 ... )
    x *= Math.sqrt(2 / g) + 2 * v0 / g * (1 / (1 - vCoeff));

    // return if not first hit yet
    if (g * x * x / 2 <= 1) {
        return g * x * x / 2;
    }

    // subtract time to first bounce
    x -= Math.sqrt(2 / g);

    // v = g * t = g * Math.sqrt(2 / g)
    v0 *= vCoeff;
    let h = 1 - v0 * x + g * x * x / 2;
    // v0 * x = g * x * x / 2

    // This is absurdly inefficient ;)
    while (h > 1 && maxBounces) {
        // 0 = v0 + g * t / 2
        x -= 2 * v0 / g;
        v0 *= vCoeff;
        h = 1 - v0 * x + g * x * x / 2;
        maxBounces--;
    }

    if (!maxBounces) {
        return 1;
    }

    return h;
};

module.exports = { clamp, linear, inOutExp, inOutQuadratic, inOutCubic, oscillator, freefall };

},{}]},{},[1])