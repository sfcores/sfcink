// ==================== 动态星空背景粒子系统 ====================
const bgStars = [];
const maxBgStars = 50; 

function initBackgroundStars() {
    bgStars.length = 0; 
    for (let i = 0; i < maxBgStars; i++) {
        bgStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.3 + 0.4,
            speedX: -(Math.random() * 0.12 + 0.04), // 浪漫的深空左滑漂移
            baseAlpha: Math.random() * 0.5 + 0.1,
            blinkSpeed: Math.random() * 0.02 + 0.01,
            angle: Math.random() * Math.PI
        });
    }
}

function drawDynamicBackground() {
    for (let i = 0; i < bgStars.length; i++) {
        let p = bgStars[i];
        p.x += p.speedX;
        if (p.x < 0) p.x = canvas.width; // 循环出界处理

        p.angle += p.blinkSpeed;
        let currentAlpha = p.baseAlpha + Math.sin(p.angle) * 0.15;
        if (currentAlpha < 0) currentAlpha = 0;

        ctx.fillStyle = `rgba(0, 243, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ==================== 核心恒星系统渲染流 ====================
function drawStarSystem(vis) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxRadius = canvas.width / 2;
    
    const baseRadius = maxRadius * 0.4 * (vis.scale || 1.0); 
    const oblateness = vis.oblateness || 0.0;

    const radiusX = baseRadius;
    const radiusY = baseRadius * (1 - oblateness);

    // 1. 广域深邃辐射流
    let glow3 = ctx.createRadialGradient(cx, cy, radiusY * 0.8, cx, cy, radiusY * 2.5);
    glow3.addColorStop(0, 'rgba(0, 47, 167, 0.2)');
    glow3.addColorStop(0.4, 'rgba(0, 47, 167, 0.08)');
    glow3.addColorStop(1, 'rgba(0, 47, 167, 0)');
    ctx.fillStyle = glow3;
    ctx.save();
    ctx.scale(1, radiusY / radiusX);
    ctx.beginPath(); ctx.arc(cx, cy * (radiusX / radiusY), radiusX * 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // 2. 高能日冕层
    let glow2 = ctx.createRadialGradient(cx, cy, radiusY * 0.9, cx, cy, radiusY * 1.6);
    glow2.addColorStop(0, vis.glow_color || 'rgba(0, 70, 255, 0.4)');
    glow2.addColorStop(0.5, 'rgba(0, 47, 167, 0.2)');
    glow2.addColorStop(1, 'rgba(0, 47, 167, 0)');
    ctx.fillStyle = glow2;
    ctx.save();
    ctx.scale(1, radiusY / radiusX);
    ctx.beginPath(); ctx.arc(cx, cy * (radiusX / radiusY), radiusX * 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // 3. 2D不透明核心实体层
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);
    
    let bodyGrad = ctx.createRadialGradient(cx - radiusX*0.15, cy - radiusY*0.15, radiusY * 0.05, cx, cy, radiusY);
    bodyGrad.addColorStop(0, vis.core_color_center || '#ffffff');
    bodyGrad.addColorStop(0.3, vis.core_color_mid || '#e8f0ff');
    bodyGrad.addColorStop(0.85, vis.core_color_edge || '#a5c2ff');
    bodyGrad.addColorStop(1, 'rgba(0, 47, 167, 0.8)'); 
    
    ctx.fillStyle = bodyGrad;
    ctx.shadowColor = varColorToHex(vis.core_color_edge);
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.restore();

    // 4. 科幻HUD扫描圈
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath(); 
    ctx.ellipse(cx, cy, radiusX * 1.3, radiusY * 1.3, 0, 0, Math.PI * 2);
    ctx.stroke();
}

// 辅助函数
function varColorToHex(color) {
    return color && color.startsWith('#') ? color : '#00f3ff';
}

// ==================== 整合动画主循环引擎 ====================
function animationEngineLoop() {
    // 擦除画布并铺设深黑色基底
    ctx.fillStyle = '#01030a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 渲染星空流动
    drawDynamicBackground();
    
    // 覆盖绘制当前活跃的恒星
    if (window.currentActiveConfig) {
        drawStarSystem(window.currentActiveConfig);
    }
    
    requestAnimationFrame(animationEngineLoop);
}