// js/home-stars.js
// 修复版：强制全屏分布

window.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('home-stars')
  if (!canvas) return

  const ctx = canvas.getContext('2d')

  let width = 0
  let height = 0
  let stars = []

  const STAR_COUNT = 320

  function resize() {
    const dpr = window.devicePixelRatio || 1
    
    // 【关键修改】直接读取窗口(window)的宽高，确保铺满全屏
    // 之前读取 canvas.clientWidth 可能会因为加载延迟导致读到默认的 300px
    width = window.innerWidth
    height = window.innerHeight

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  // 初始化时立即调整大小
  resize()

  // 监听窗口大小变化（比如拖动浏览器窗口时）
  window.addEventListener('resize', function () {
    resize()
    createStars() // 重新生成星星位置
  })

  function createStars() {
    stars = []
    const normalCount = Math.floor(STAR_COUNT * 0.75)
    const brightCount = STAR_COUNT - normalCount

    for (let i = 0; i < normalCount; i++) {
      stars.push(createStar({
        radiusMin: 0.7,
        radiusMax: 1.5,
        baseAlphaMin: 0.12,
        baseAlphaMax: 0.35,
        twinkleAmpMin: 0.35,
        twinkleAmpMax: 0.7,
        isBright: false,
      }))
    }

    for (let i = 0; i < brightCount; i++) {
      // 让亮星主要分布在屏幕中间偏下的位置（模拟银河）
      const biasY = 0.35 + Math.random() * 0.4 
      stars.push(createStar({
        radiusMin: 1.6,
        radiusMax: 2.6,
        baseAlphaMin: 0.25,
        baseAlphaMax: 0.5,
        twinkleAmpMin: 0.45,
        twinkleAmpMax: 0.85,
        isBright: true,
        biasY,
      }))
    }
  }

  function createStar(opts) {
    const {
      radiusMin, radiusMax,
      baseAlphaMin, baseAlphaMax,
      twinkleAmpMin, twinkleAmpMax,
      isBright,
      biasY,
    } = opts

    // 生成全屏随机坐标
    const x = Math.random() * width
    
    // 如果有 biasY 则偏向银河区域，否则全屏随机
    const y = biasY
      ? biasY * height + (Math.random() - 0.5) * height * 0.25
      : Math.random() * height

    const radius = radiusMin + Math.random() * (radiusMax - radiusMin)
    const baseAlpha = baseAlphaMin + Math.random() * (baseAlphaMax - baseAlphaMin)
    const twinkleAmp = twinkleAmpMin + Math.random() * (twinkleAmpMax - twinkleAmpMin)

    const color = pickStarColor(isBright)

    return {
      x,
      y,
      radius,
      baseAlpha,
      twinkleAmp,
      twinkleSpeed: 0.4 + Math.random() * 1.0,
      phase: Math.random() * Math.PI * 2,
      color,
      isBright,
    }
  }

  function pickStarColor(isBright) {
    const r = Math.random()
    if (isBright) {
      if (r < 0.6) return { r: 245, g: 248, b: 255 } 
      if (r < 0.9) return { r: 215, g: 225, b: 255 } 
      return { r: 255, g: 235, b: 210 }              
    }
    if (r < 0.55) return { r: 230, g: 235, b: 255 } 
    if (r < 0.82) return { r: 205, g: 215, b: 245 } 
    if (r < 0.95) return { r: 255, g: 235, b: 205 } 
    return { r: 255, g: 210, b: 210 }   
  }

  // 先创建一次星星
  createStars()

  let lastTime = 0

  function animate(time) {
    const t = time * 0.001
    const dt = lastTime ? (t - lastTime) : 0
    lastTime = t

    ctx.globalCompositeOperation = 'source-over'
    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'lighter'

    for (const star of stars) {
      star.phase += star.twinkleSpeed * dt
      let alpha = star.baseAlpha + Math.sin(star.phase) * star.twinkleAmp
      if (alpha < 0) alpha = 0
      if (alpha > 1) alpha = 1

      const r = star.radius
      const c = star.color

      const grad = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, r * 2.0
      )
      grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 1)`)
      grad.addColorStop(0.4, `rgba(${c.r}, ${c.g}, ${c.b}, 0.9)`)
      grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`)

      ctx.globalAlpha = alpha
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(star.x, star.y, r * 2.0, 0, Math.PI * 2)
      ctx.fill()

      if (star.isBright && r > 2.0) {
        ctx.globalAlpha = alpha * 0.6
        ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, 0.9)`
        ctx.lineWidth = 0.5
        const len = r * 3.2
        ctx.beginPath()
        ctx.moveTo(star.x - len, star.y); ctx.lineTo(star.x + len, star.y); ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(star.x, star.y - len); ctx.lineTo(star.x, star.y + len); ctx.stroke()
      }
    }
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
})

