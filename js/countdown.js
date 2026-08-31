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

    // 下一个纪念日：以「天」为单位判断——从纪念日当天起即视为已度过该周年，
    // 倒计时目标直接切到下一年（避免当天还显示几小时的误差）
    function nextAnniversary(now) {
        const date = new Date(now);
        const y = date.getFullYear() - start.getFullYear();
        const ann = new Date(start);
        ann.setFullYear(start.getFullYear() + y);

        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const annDay = new Date(ann.getFullYear(), ann.getMonth(), ann.getDate());
        const offset = annDay <= today ? 1 : 0;

        return new Date(start).setFullYear(start.getFullYear() + y + offset);
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