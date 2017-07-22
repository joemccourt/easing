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
