/* 背景音乐开关
 * - 固定在页面右下角，手动点击后播放/暂停（不自动播放，兼容移动端浏览器限制）
 * - 播放状态记忆在 localStorage，刷新后保持
 * - config.js 的 MUSIC.src 为空时，点击仅提示"暂未添加背景音乐"，不会报错 */
(function () {
    const btn = document.getElementById('music-toggle');
    const tip = document.getElementById('music-tip');
    if (!btn || typeof CONFIG === 'undefined' || !CONFIG.MUSIC) return;

    const src = CONFIG.MUSIC.src;
    const audio = new Audio();
    let playing = false;

    if (src) {
        audio.src = src;
        audio.loop = true;
        audio.preload = 'auto';
    }

    function updateBtn() {
        btn.classList.toggle('playing', playing);
        btn.textContent = playing ? '♪ 暂停音乐' : '♪ 播放音乐';
    }

    function showTip(msg) {
        if (!tip) return;
        tip.textContent = msg;
        tip.classList.add('show');
        clearTimeout(showTip._t);
        showTip._t = setTimeout(() => tip.classList.remove('show'), 2600);
    }

    // 记忆上次播放状态
    if (localStorage.getItem('anniversary-music') === '1' && src) {
        audio.play().then(() => {
            playing = true;
            updateBtn();
        }).catch(() => { /* 用户尚未交互，静默忽略 */ });
    }

    btn.addEventListener('click', () => {
        if (!src) { showTip('暂未添加背景音乐，请在 config.js 的 MUSIC.src 中指定'); return; }
        if (playing) {
            audio.pause();
            playing = false;
        } else {
            audio.play()
                .then(() => { playing = true; })
                .catch(() => showTip('播放失败，请稍后再试'));
        }
        updateBtn();
        localStorage.setItem('anniversary-music', playing ? '1' : '0');
    });

    audio.addEventListener('error', () => showTip('未找到背景音乐文件，请检查 assets/audio/'));
    updateBtn();
})();