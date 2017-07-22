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
