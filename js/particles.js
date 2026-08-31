/* 封面爱心/星光粒子背景
 * - 挂载在 <canvas id="particles"> 上（位于封面 HERO 内）
 * - 移动端自动降低粒子数；检测到 prefers-reduced-motion 时完全停用，保证低端机流畅 */
(function () {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    let w = 0, h = 0;
    let particles = [];
    let rafId = null;

    // 粒子数量：桌面 90 / 移动 55；开启减弱动效时为 0
    const MAX = reduceMotion ? 0 : (isMobile ? 55 : 90);

    function resize() {
        w = canvas.width = canvas.clientWidth || 1;
        h = canvas.height = canvas.clientHeight || 1;
    }

    function makeParticle() {
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            r: 0.8 + Math.random() * 1.6,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -(0.15 + Math.random() * 0.4),
            tw: Math.random() * Math.PI * 2,
            type: Math.random() < 0.22 ? 'heart' : 'dot' // 少量爱心 + 大量星光
        };
    }

    // 绘制一颗小爱心
    function drawHeart(x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.7);
        ctx.bezierCurveTo(x, y, x - size, y - size * 0.3, x, y - size);
        ctx.bezierCurveTo(x + size, y - size * 0.3, x, y, x, y + size * 0.7);
        ctx.fill();
    }

    function step() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
            p.y += p.vy;
            p.x += p.vx;
            p.tw += 0.02;

            // 越界回绕，形成循环上浮
            if (p.y < -24) { p.y = h + 24; p.x = Math.random() * w; }
            if (p.x < -24) p.x = w + 24;
            if (p.x > w + 24) p.x = -24;

            const fade = 0.4 + 0.3 * Math.sin(p.tw);
            ctx.globalAlpha = p.a * fade;
            ctx.fillStyle = '#e88d67';

            if (p.type === 'heart') drawHeart(p.x, p.y, p.r * 1.8);
            else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
        }
        rafId = requestAnimationFrame(step);
    }

    resize();
    window.addEventListener('resize', resize);

    if (reduceMotion) {
        ctx.clearRect(0, 0, w, h);
        return; // 不启动动画
    }

    if (!particles.length) {
        particles = Array.from({ length: MAX }, makeParticle);
    }
    step();
})();