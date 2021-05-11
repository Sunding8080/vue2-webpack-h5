import TWEEN from '@tweenjs/tween.js'
import dayjs from 'dayjs'

// 获取元素的样式值
export function getStyle(el, attr) {
  if (typeof window.getComputedStyle !== 'undefined') {
    return window.getComputedStyle(el, null)[attr]
  }
  if (typeof el.currentStyle !== 'undefined') {
    return el.currentStyle[attr]
  }
  return ''
}

// 分割数组
export function getChunkList(list, len) {
  const result = []
  for (let i = 0; i < list.length; i += len) {
    result.push(list.slice(i, i + len))
  }
  return result
}

// 对象深拷贝
export function deepExtend(...rest) {
  const out = rest[0] || {}
  for (let i = 1; i < rest.length; i++) {
    const obj = rest[i]
    Object.keys(obj).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object') {
          if (obj[key] instanceof Array === true) {
            out[key] = obj[key].slice(0)
          } else {
            out[key] = this.deepExtend(out[key], obj[key])
          }
        } else {
          out[key] = obj[key]
        }
      }
    })
  }
  return out
}

// 平滑滚动
export function tweenTo({ target, scrollTop, targetTop = 0, duration = 300 }) {
  return new Promise((resolve) => {
    function execScrollTop(y) {
      if (target) {
        target.scrollTop = y
      } else {
        document.documentElement.scrollTop = y
        document.body.scrollTop = y
      }
    }

    scrollTop = scrollTop || document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
    if (window.scrollTween) {
      window.scrollTween.stop()
    }

    window.scrollTween = new TWEEN.Tween({ y: scrollTop })
      .to({ y: targetTop }, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(({ y }) => {
        execScrollTop(parseInt(y, 10))
      })
      .onComplete(() => {
        execScrollTop(targetTop)
      })
      .start()

    function animate() {
      if (TWEEN.update()) {
        requestAnimationFrame(animate)
      }
    }
    animate()

    setTimeout(() => resolve(), duration)
  })
}

// 按字符占位计算字符串长度
export function getStringLength(str = '') {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    len += str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94 ? 2 : 1
  }
  return len
}

// 轮询判断直到为 true 才回调
export function intervalCondition(option) {
  return new Promise((resolve, reject) => {
    // 配置默认值
    if (typeof option !== 'object') {
      option = { condition: option || (() => true) }
    }
    option.interval = option.interval || 300
    option.timeout = option.timeout || 10000

    // 条件满足直接回调
    if (option.condition()) {
      resolve()
      return
    }

    // 轮询判断条件
    const interval = setInterval(() => {
      if (option.condition()) {
        clearInterval(interval)
        setTimeout(() => {
          resolve()
        }, 0)
      }
    }, option.interval)

    // 超时回调异常
    if (option.timeout >= 0) {
      setTimeout(() => {
        clearInterval(interval)
        reject()
      }, option.timeout)
    }
  })
}

// 获取某周内,周一到该天的时间范围
export function getThisWeek(date, formater) {
  let weekFirstDate
  let weekEndDate
  let today = date ? dayjs(date) : dayjs()
  const day = today.$d.getDay()
  formater = formater || 'YYYY/MM/DD'

  switch (day) {
    case 1:
      weekFirstDate = today.format(formater)
      weekEndDate = today.add(6, 'day').format(formater)
      break
    case 2:
      weekFirstDate = today.add(-1, 'day').format(formater)
      weekEndDate = today.add(5, 'day').format(formater)
      break
    case 3:
      weekFirstDate = today.add(-2, 'day').format(formater)
      weekEndDate = today.add(4, 'day').format(formater)
      break
    case 4:
      weekFirstDate = today.add(-3, 'day').format(formater)
      weekEndDate = today.add(3, 'day').format(formater)
      break
    case 5:
      weekFirstDate = today.add(-4, 'day').format(formater)
      weekEndDate = today.add(2, 'day').format(formater)
      break
    case 6:
      weekFirstDate = today.add(-5, 'day').format(formater)
      weekEndDate = today.add(1, 'day').format(formater)
      break
    case 0:
      weekFirstDate = today.add(-6, 'day').format(formater)
      weekEndDate = today.format(formater)
      break
    default:
      break
  }

  today = today.format(formater)
  return {
    today,
    weekFirstDate,
    weekEndDate,
  }
}

// 获取某月的天数
export function getDays(year, month) {
  month -= 1
  const days = [31, 28, 31, 30, 31, 30, 31, 30, 30, 31, 30, 31]
  if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
    days[1] = 29
  }
  return days[month]
}

// 获取某月内, 1号到该天的时间范围
export function getThisMonth(date, formater) {
  formater = formater || 'YYYY/MM/DD'
  let today = date ? dayjs(date) : dayjs()
  const year = today.$d.getFullYear()
  const month = today.$d.getMonth() + 1

  const monthFirstDate = dayjs(`${year}/${month}/1`).format(formater)
  const monthEndDate = dayjs(`${year}/${month}/${getDays(year, month)}`).format(formater)
  today = today.format(formater)

  return {
    monthFirstDate,
    monthEndDate,
    today,
  }
}

// 获取某个季度的时间范围
export function getThisQuarter(date, formater) {
  formater = formater || 'YYYY/MM/DD'
  let today = date ? dayjs(date) : dayjs()
  const year = today.$d.getFullYear()
  const month = today.$d.getMonth() + 1

  let startMonth
  let endMonth

  const num = month % 3 // 获取当前月数

  switch (num) {
    case 0:
      startMonth = month - 2
      endMonth = month
      break
    case 1:
      startMonth = month
      endMonth = month + 2
      break
    case 2:
      startMonth = month - 1
      endMonth = month + 1
      break
    default:
      break
  }

  const quarterFirstDate = dayjs(`${year}/${startMonth}/1`).format(formater)
  const quarterEndDate = dayjs(`${year}/${endMonth}/${getDays(year, endMonth)}`).format(formater)
  today = today.format(formater)

  return {
    today,
    quarterFirstDate,
    quarterEndDate,
  }
}
