/* 纪念日倒计时
 * 始终倒计时到「下一个（明年的）周年纪念日」，例如当前是四周年期间，
 * 即显示"距离第 5 周年还有约 365 天"，并实时刷新天/时/分/秒。
 * 起始日期读取自 config.js 的 CONFIG.startDate。 */
(function () {
    const el = document.getElementById('countdown-display');
    if (!el || typeof CONFIG === 'undefined') return;

    const start = new Date(`${CONFIG.startDate}T00:00:00+08:00`); // 纪念日（固定中国时区）

    function tick() {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');

        // 目标 = 「明年的同一天」，固定中国时区（UTC+8），避免小时级残留与时区偏差
        const nextYear = now.getFullYear() + 1;
        const target = new Date(
            `${nextYear}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}T00:00:00+08:00`
        );
        const diff = Math.max(0, target - now);

        const d = Math.floor(diff / 864e5);
        const h = Math.floor((diff % 864e5) / 36e5);
        const m = Math.floor((diff % 36e5) / 6e4);
        const s = Math.floor((diff % 6e4) / 1e3);
        const nian = nextYear - start.getFullYear(); // 距离第几周年

        el.innerHTML = `
            <p class="cd-sum">距离第 <b>${nian}</b> 周年还有</p>
            <div class="cd-grid">
                <div class="cd-cell"><span class="cd-num">${d}</span><span class="cd-unit">天</span></div>
                <div class="cd-cell"><span class="cd-num">${h}</span><span class="cd-unit">时</span></div>
                <div class="cd-cell"><span class="cd-num">${m}</span><span class="cd-unit">分</span></div>
                <div class="cd-cell"><span class="cd-num">${s}</span><span class="cd-unit">秒</span></div>
            </div>`;
    }

    tick();
    setInterval(tick, 1000);
})();