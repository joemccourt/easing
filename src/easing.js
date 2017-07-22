const clamp = (x, min, max) => {
    return Math.max(min, Math.min(max, x));
};

const linear = (x) => {
    return x;
};

export default { linear };
