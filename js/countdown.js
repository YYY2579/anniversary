/* 纪念日倒计时
 * - 顶部显示已相爱 X 年
 * - 下方实时倒数到「下一个纪念日」
 * 起始日期读取自 config.js 的 CONFIG.startDate */
(function () {
    const el = document.getElementById('countdown-display');
    if (!el || typeof CONFIG === 'undefined') return;

    const start = new Date(CONFIG.startDate);
    let target = null;

    // 当前所处第几周年（1 起）：满一周年前为 1，满一周年后进入第 2 周年，以此类推
    function yearIndex(now) {
        const date = new Date(now);
        let y = date.getFullYear() - start.getFullYear();
        const ann = new Date(start);
        ann.setFullYear(start.getFullYear() + y);
        if (date >= ann) y += 1;
        return Math.max(1, y);
    }

    // 下一个纪念日（严格晚于当前时间，避免负倒计时）
    function nextAnniversary(now) {
        const date = new Date(now);
        let y = date.getFullYear() - start.getFullYear();
        if (new Date(start).setFullYear(start.getFullYear() + y) <= now) y++;
        return new Date(start).setFullYear(start.getFullYear() + y);
    }

    function tick() {
        const now = new Date().getTime();
        if (target === null || target <= now) target = nextAnniversary(now);

        const diff = Math.max(0, target - now);
        const d = Math.floor(diff / 864e5);
        const h = Math.floor((diff % 864e5) / 36e5);
        const m = Math.floor((diff % 36e5) / 6e4);
        const s = Math.floor((diff % 6e4) / 1e3);

        el.innerHTML = `
            <p class="cd-sum">我们正在共度第 <b>${yearIndex(new Date(now))}</b> 周年</p>
            <div class="cd-grid">
                <div class="cd-cell"><span class="cd-num">${d}</span><span class="cd-unit">天</span></div>
                <div class="cd-cell"><span class="cd-num">${h}</span><span class="cd-unit">时</span></div>
                <div class="cd-cell"><span class="cd-num">${m}</span><span class="cd-unit">分</span></div>
                <div class="cd-cell"><span class="cd-num">${s}</span><span class="cd-unit">秒</span></div>
            </div>
            <p class="cd-foot">距离下一个纪念日</p>`;
    }

    tick();
    setInterval(tick, 1000);
})();