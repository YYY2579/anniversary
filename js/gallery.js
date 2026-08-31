// --- 数据配置 ---
// 相册数据统一读取自 js/config.js 的全局 photoData（结构：year/title/image/description）。
// 替换照片：把文件放入 assets/images/，并修改 config.js 中 photoData 的 image 字段即可。

// 缓存已完全加载的原图 URL
const loadedImages = new Set();

// --- 渲染照片流 ---
function renderGallery() {
    const stream = document.getElementById('photoStream');
    stream.innerHTML = ''; 

    if (!photoData || photoData.length === 0) {
        stream.innerHTML = '<p class="subtitle">暂无照片回忆</p>';
        return;
    }

    photoData.forEach((photo, index) => {
        const card = document.createElement('div');
        card.className = 'photo-item fade-in';
        card.style.animationDelay = `${index * 0.05}s`;
        card.setAttribute('data-index', index);

        // 使用照片（本地图，无独立缩略图时直接用原图）
        const imgSrc = photo.image || photo.src;
        
        card.innerHTML = `
            <img src="${imgSrc}" class="blur" alt="${photo.title}" loading="lazy">
            <div class="photo-info">
                <div class="photo-title">${photo.title}</div>
                <div class="photo-desc">${photo.description}</div>
            </div>
        `;

        stream.appendChild(card);

        // 缩略图加载优化
        const img = card.querySelector('img');
        const handleLoad = () => {
            img.classList.add('loaded');
            img.classList.remove('blur');
        };

        if (img.complete) {
            handleLoad();
        } else {
            img.onload = handleLoad;
            img.onerror = () => {
                img.classList.remove('blur'); // 即使失败也移除模糊
            }
        }
    });

    initLightbox();
}

// --- 灯箱功能 ---
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop'); // 背景层
    const titleEl = document.getElementById('lightboxTitle');
    const descEl = document.getElementById('lightboxDescription');
    const counterEl = document.getElementById('lightboxCounter');
    const loader = document.getElementById('lightboxLoader');
    
    let currentIndex = 0;
    let currentLoadId = 0; // 用于解决快速切换时的竞争条件

    // 打开灯箱
    window.openLightbox = (index) => {
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // 关闭灯箱
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        // 延迟清理，避免闪烁
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxBackdrop.src = '';
        }, 300);
    }

    // 核心更新逻辑
    function updateLightboxContent() {
        const photo = photoData[currentIndex];
        const loadId = ++currentLoadId; // 标记当前请求ID
        
        // 更新文字信息
        titleEl.textContent = photo.title;
        descEl.textContent = photo.description;
        counterEl.textContent = `${currentIndex + 1} / ${photoData.length}`;

        // 1. 设置背景层（用已缓存的原图或照片本身快速显示，填满背景）
        lightboxBackdrop.src = loadedImages.has(photo.image) ? photo.image : (photo.image || photo.src);

        // 2. 检查缓存：如果原图已经下载过
        if (loadedImages.has(photo.image)) {
            // 直接显示原图，无模糊，无Loading
            lightboxImg.src = photo.image;
            lightboxImg.classList.remove('blur-loading');
            loader.classList.remove('show');
            return;
        }

        // 3. 原图未缓存：执行平滑加载流程
        
        // 步骤 A: 先显示占位图，并加模糊
        lightboxImg.setAttribute('data-src', photo.image);
        lightboxImg.src = photo.image;
        lightboxImg.classList.add('blur-loading');
        loader.classList.add('show'); // 显示"加载中"

        // 步骤 B: 后台加载高清原图
        const fullImg = new Image();
        fullImg.src = photo.image;
        
        fullImg.onload = () => {
            // 只有当用户还停留在当前图片时，才执行替换
            if (loadId === currentLoadId) {
                lightboxImg.src = photo.image; // 替换为高清图
                lightboxImg.classList.remove('blur-loading'); // 移除模糊
                loader.classList.remove('show'); // 隐藏Loading
                loadedImages.add(photo.image); // 标记为已缓存
                
                // 顺便更新背景为高清图（可选，让背景也更清晰）
                lightboxBackdrop.src = photo.image;
            }
        };

        fullImg.onerror = () => {
            if (loadId === currentLoadId) {
                loader.querySelector('span').innerText = '加载失败';
                lightboxImg.classList.remove('blur-loading'); // 失败也移除模糊，至少看个缩略图
            }
        };
    }

    // 事件绑定
    document.querySelectorAll('.photo-item').forEach(item => {
        item.addEventListener('click', () => {
            openLightbox(parseInt(item.dataset.index));
        });
    });

    document.getElementById('lightboxClose').onclick = closeLightbox;
    
    // 点击背景不关闭（防止误触），或者你可以改为关闭
    // document.querySelector('.lightbox-overlay').onclick = closeLightbox;
    
    document.getElementById('lightboxPrev').onclick = (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + photoData.length) % photoData.length;
        updateLightboxContent();
    };
    
    document.getElementById('lightboxNext').onclick = (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % photoData.length;
        updateLightboxContent();
    };

    // 键盘支持
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
        if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
    });
}

// 启动
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderGallery, 100);
});