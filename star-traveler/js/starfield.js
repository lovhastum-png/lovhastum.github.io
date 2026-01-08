// js/starfield.js
// 最终修正版：纯黑背景 + 精准锁定 + 数据跳转

$(document).ready(function() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const $reticle = $('#targetReticle'); // 瞄准圈
  const $infoContent = $('#infoContent'); // 右侧报告区
  const $systemName = $('#systemName'); // 顶部状态栏：系统名
  const $distanceVal = $('#distanceVal'); // 顶部状态栏：距离

  let width, height;
  let stars = [];
  
  // 用于暂存当前选中的恒星数据，以便跨页面传递
  let currentMissionData = null; 

  // --- 1. 恒星生成配置 (哈佛光谱分类) ---
  const SPECTRAL_TYPES = [
    { type: 'O', color: '#9bb0ff', temp: '30,000+', probability: 0.01 }, // 蓝巨星
    { type: 'B', color: '#aabfff', temp: '10,000-30,000', probability: 0.05 },
    { type: 'A', color: '#cad7ff', temp: '7,500-10,000', probability: 0.1 },
    { type: 'F', color: '#f8f7ff', temp: '6,000-7,500', probability: 0.15 },
    { type: 'G', color: '#fff4ea', temp: '5,200-6,000', probability: 0.2 }, // 类太阳
    { type: 'K', color: '#ffd2a1', temp: '3,700-5,200', probability: 0.25 },
    { type: 'M', color: '#ffcc6f', temp: '2,400-3,700', probability: 0.24 }  // 红矮星
  ];

  function getRandomSpectral() {
    const r = Math.random();
    let sum = 0;
    for (let s of SPECTRAL_TYPES) {
      sum += s.probability;
      if (r <= sum) return s;
    }
    return SPECTRAL_TYPES[SPECTRAL_TYPES.length - 1];
  }

  // --- 2. 初始化与尺寸调整 ---
  function resize() {
    // 获取父容器(.space-panel)的真实尺寸，确保坐标对应准确
    const parent = document.querySelector('.space-panel');
    if(parent) {
      width = parent.clientWidth;
      height = parent.clientHeight;
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    
    canvas.width = width;
    canvas.height = height;
    generateStars();
    draw();
  }

  function generateStars() {
    stars = [];
    // 根据屏幕面积动态决定星星数量，避免过密或过疏
    const starCount = Math.floor((width * height) / 450); 

    for (let i = 0; i < starCount; i++) {
      const spectral = getRandomSpectral();
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        // O型星生成得更大一些
        size: Math.random() * 1.5 + (spectral.type === 'O' ? 1.5 : 0.5),
        color: spectral.color,
        spectral: spectral,
        alpha: Math.random() * 0.8 + 0.2, // 初始透明度
        id: Math.floor(Math.random() * 90000) + 10000 // 生成5位随机编号
      });
    }
  }

  // --- 3. 绘制循环 (已修复：回归纯黑背景) ---
  function draw() {
    // [关键修复] 使用纯黑色填充背景，去掉之前的渐变光晕
    ctx.fillStyle = "#000000"; 
    ctx.fillRect(0, 0, width, height);

    // 绘制星星
    ctx.globalCompositeOperation = 'source-over';

    stars.forEach(star => {
      // 简单的随机闪烁逻辑
      if (Math.random() < 0.01) star.alpha = Math.random() * 0.8 + 0.2;
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha;
      
      // 给星星加一点微弱的辉光
      ctx.shadowBlur = star.size * 2; 
      ctx.shadowColor = star.color;
      
      ctx.fill();
    });
    
    // 重置绘图状态，避免影响下一帧
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    
    requestAnimationFrame(draw);
  }

  // --- 4. 生成数据并更新右侧面板 ---
  function updateSidePanel(star) {
    // 随机生成该系统的科学数据
    const planetCount = Math.floor(Math.random() * 8); // 0-7颗行星
    const habits = ['极低', '低', '中等', '高', '理想'];
    const atmospheres = ['氮气/氧气', '二氧化碳/硫酸', '氢气/氦气', '稀薄/无大气', '甲烷/氨气'];
    
    const habitVal = habits[Math.floor(Math.random() * habits.length)];
    const atmVal = atmospheres[Math.floor(Math.random() * atmospheres.length)];
    const distVal = Math.floor(Math.random() * 5000 + 4); // 距离 4-5000 光年
    
    // [关键] 将数据存入全局变量，准备传给 detail.html
    currentMissionData = {
        id: `HIP-${star.id}`,
        type: star.spectral.type,
        temp: star.spectral.temp,
        dist: distVal,
        planets: planetCount,
        atmosphere: atmVal,
        habitability: habitVal,
        timestamp: new Date().toLocaleString()
    };

    // 更新顶部状态栏
    $systemName.text(currentMissionData.id);
    $distanceVal.text(distVal);

    // 构建右侧面板的 HTML
    let html = `
      <div class="card" style="border-top: 2px solid ${star.color}">
        <h2>恒星概览</h2>
        <p><strong>编号：</strong> ${currentMissionData.id}</p>
        <p><strong>光谱类型：</strong> ${currentMissionData.type}型 (${currentMissionData.temp} K)</p>
        <p class="muted">系统引力参数稳定，遥测信号良好。</p>
      </div>
      
      <div class="card" style="margin-top:15px;">
        <h2>探测报告</h2>
        <p><strong>行星数量：</strong> ${planetCount}</p>
    `;

    if (planetCount > 0) {
      html += `
        <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-top:10px;">
          <h3 style="font-size:14px; color:#38bdf8; margin-bottom:5px;">重点天体分析</h3>
          <ul style="font-size:12px; padding-left:20px; color:#ccc; line-height:1.8;">
            <li><strong>大气成分：</strong> ${atmVal}</li>
            <li><strong>宜居性评估：</strong> <span style="color:${habitVal==='高'||habitVal==='理想'?'#4ade80':'#f87171'}">${habitVal}</span></li>
          </ul>
        </div>
      `;
    } else {
      html += `<p class="muted">该星系主要由小行星带组成，未发现大质量行星。</p>`;
    }
    
    html += `</div>`;
    
    // 添加核心交互按钮
    html += `
       <button id="saveBtn" class="core-button" style="width:100%; margin-top:20px;">
         下载数据并归档
       </button>
    `;

    // 渲染到页面（先隐藏再淡入）
    $infoContent.hide().html(html).fadeIn();
    
    // [关键] 绑定按钮点击事件 -> 保存数据并跳转
    $('#saveBtn').on('click', function() {
        if(!currentMissionData) return;
        
        // 1. 保存当前数据到 LocalStorage
        localStorage.setItem('lastMissionData', JSON.stringify(currentMissionData));
        
        // 2. 更新历史记录列表
        let history = JSON.parse(localStorage.getItem('missionHistory') || '[]');
        history.unshift(currentMissionData);
        localStorage.setItem('missionHistory', JSON.stringify(history.slice(0, 10))); // 最多存10条

        // 3. 跳转到详情页
        window.location.href = 'detail.html';
    });
  }

  // --- 5. 点击交互逻辑 ---
  canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 寻找最近的星星
    let closest = null;
    let minDist = 30; // 点击感应半径，稍微大一点方便点击

    stars.forEach(star => {
      const dx = star.x - x;
      const dy = star.y - y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < minDist) {
        minDist = dist;
        closest = star;
      }
    });

    if (closest) {
      // 1. 移动瞄准圈
      // CSS中 .reticle 需要设置 transform: translate(-50%, -50%) 才能让圆心对准
      $reticle.show().css({
        left: closest.x + 'px', 
        top: closest.y + 'px'
      });
      
      // 2. 生成数据并更新面板
      updateSidePanel(closest);

    } else {
      // 点击空白处隐藏瞄准圈
      $reticle.hide();
    }
  });

  // 底部 "随机扫描" 按钮逻辑（模拟点击）
  $('#coreButton').click(function() {
     if(stars.length > 0) {
        const randomStar = stars[Math.floor(Math.random() * stars.length)];
        
        // 模拟选中
        $reticle.show().css({
            left: randomStar.x + 'px',
            top: randomStar.y + 'px'
        });
        
        updateSidePanel(randomStar);
     }
  });

  // 启动程序
  window.addEventListener('resize', resize);
  resize();
});