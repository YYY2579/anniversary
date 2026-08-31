// --- 核心逻辑 ---
// 所有私人数据（昵称/日期/照片/里程碑等）统一读取自 js/config.js 的全局变量：
//   CONFIG / photoData / MILESTONES / WISHES / ENDING_TEXT / MUSIC

// 1. 初始化日期显示
function initDateDisplay() {
    // 设置页面头部显示的日期
    const displayElement = document.getElementById('start-date-display');
    if (displayElement) {
        const dateObj = new Date(CONFIG.startDate);
        // 格式化为：2024.05.03
        const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
        displayElement.textContent = `${dateStr} - FOREVER`;
    }

    // 设置底部年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
}

// 2. 计算天数（保留你的逻辑，稍微精简）
function updateDaysCounter() {
    const start = new Date(CONFIG.startDate);
    const now = new Date();
    const diff = now - start;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // 增加数字跳动效果（可选优化）
    document.getElementById('days-counter').textContent = days;
}

// 3. 生成时间轴
function generateTimeline() {
    const timeline = document.getElementById('timeline');
    const currentYear = new Date().getFullYear();
    
    // 提取数据中的年份
    const photoYears = photoData.map(p => p.year);
    // 最少显示到开始那一年
    let maxYear = Math.max(currentYear, ...photoYears);
    let minYear = Math.min(...photoYears);

    // 排序照片数据
    const sorted = photoData.slice().sort((a, b) => a.year - b.year);

    let html = '';

    // 渲染已有的数据节点（仅展示有意义的内容）
    sorted.forEach((item) => {
        const hasImage = item.image && item.image !== '';
        
        // 图片 HTML（本地占位图缺失时自动渲染为中性占位）
        const imgHtml = hasImage 
            ? `<img src="${item.image}" alt="${item.title}" class="timeline-image" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg=='">` 
            : '';

        html += `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h3 class="timeline-year">${item.year}</h3>
                    <p class="timeline-date">${item.title}</p>
                    ${imgHtml}
                    <p class="timeline-description">${item.description}</p>
                </div>
            </div>
        `;
    });

    // 总是添加一个“未来”的卡片，增加互动感
    const nextYear = Math.max(...photoYears) + 1;
    html += `
        <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content" style="background: rgba(255,255,255,0.4); border-style: dashed;">
                <h3 class="timeline-year">${nextYear}</h3>
                <p class="timeline-description" style="color: #999; font-style: italic;">
                    期待我们要去写的未来...
                </p>
            </div>
        </div>
    `;

    timeline.innerHTML = html;
    
    // 触发滚动动画观察器
    observeTimelineItems();
}

// 4. 滚动动画监听器 (新增功能：让元素滑入)
function observeTimelineItems() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 动画只触发一次，进入视野后取消观察
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 // 元素出现 10% 时触发
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
}

// 5. 通用滚动淡入（用于里程碑/心愿等区块）；减少同类型 observer 数量
function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
}

// 6. 渲染回忆里程碑
function renderMilestones() {
    const el = document.getElementById('milestones');
    if (!el) return;
    el.innerHTML = MILESTONES.map((m) => `
        <div class="milestone-card reveal">
            <span class="milestone-step">${m.step}</span>
            <h3 class="milestone-title">${m.title}</h3>
            <p class="milestone-text">${m.text}</p>
        </div>
    `).join('');
}

// 7. 渲染留言 / 心愿
function renderWishes() {
    const el = document.getElementById('wishes');
    if (!el) return;
    el.innerHTML = WISHES.map((w) => `
        <div class="wish-item reveal">
            <span class="wish-heart">&#9829;</span>
            <p>${w}</p>
        </div>
    `).join('');
}

// 8. 渲染结尾祝福语（并替换封面文案里的昵称占位）
function renderEnding() {
    const el = document.getElementById('ending-text');
    if (el) el.textContent = ENDING_TEXT;

    // 封面文案插入双方昵称（config.js 中修改）
    const heroNames = document.getElementById('hero-names');
    if (heroNames && CONFIG.names) {
        heroNames.textContent = `${CONFIG.names.him} & ${CONFIG.names.her}`;
    }
    const heroHeading = document.getElementById('hero-heading');
    if (heroHeading && CONFIG.heroHeading) {
        heroHeading.textContent = CONFIG.heroHeading;
    }
}

// --- 启动 ---
document.addEventListener('DOMContentLoaded', () => {
    initDateDisplay();
    updateDaysCounter();
    renderMilestones();
    renderWishes();
    renderEnding();
    initReveal();

    // 封面背景图（config.js 中配置）
    const coverEl = document.getElementById('hero-cover');
    if (coverEl && CONFIG.cover) coverEl.style.backgroundImage = `url('${CONFIG.cover}')`;

    // 生成时间线（照片数据来自 config.js 的全局 photoData）
    generateTimeline();

    // 每天自动刷新一次天数
    setInterval(updateDaysCounter, 1000 * 60 * 60);
});
