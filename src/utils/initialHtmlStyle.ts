import { checkWebp } from './common'

const rem = () => {
  const { innerWidth, innerHeight } = window
  const fontSize = (Math.min(innerHeight, innerWidth, 1000) / 750) * 100
  if (fontSize === Number.parseFloat(document.documentElement.style.fontSize)) return;
  document.documentElement.style.fontSize = fontSize + 'px'

  window.rem2px = (r:string) => Number.parseFloat(r) * fontSize
  window.px2rem = (f:string) => Number.parseFloat(f) / fontSize
}

export function initialHtmlStyle () {
  const fontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  window.rem2px = (r:string) => Number.parseFloat(r) * fontSize
  window.px2rem = (f:string) => Number.parseFloat(f) / fontSize

  // 禁止缩放
  document.addEventListener('gesturestart', (event) => { event.preventDefault() })

  // 禁止双指放大
  let lastTouchEnd = 0;
  document.documentElement.addEventListener('touchend', function (event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // 禁止双指放大
  document.documentElement.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, false);

  // 重置 rem
  // window.addEventListener('resize', rem)

  // 监听屏幕旋转
  window.addEventListener('orientationchange', () => {
    // setTimeout(() => {
    //   window.location.reload()
    // }, 1000)
  })

  if (checkWebp()) {
    document.documentElement.className = 'webp'
  }
}
