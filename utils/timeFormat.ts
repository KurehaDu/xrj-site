/**
 * 格式化时间
 * 使用原生JavaScript实现，避免额外依赖
 */
export function timeFormat(
  date: number | string | Date = Date.now(), 
  pattern: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  let targetDate: Date

  if (typeof date === 'number') {
    if (date.toString().length === 10) {
      date *= 1000
    }
    targetDate = new Date(date)
  } else if (typeof date === 'string') {
    targetDate = new Date(date)
  } else {
    targetDate = date
  }

  if (isNaN(targetDate.getTime())) {
    return 'Invalid Date'
  }

  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  const hours = String(targetDate.getHours()).padStart(2, '0')
  const minutes = String(targetDate.getMinutes()).padStart(2, '0')
  const seconds = String(targetDate.getSeconds()).padStart(2, '0')
  const milliseconds = String(targetDate.getMilliseconds()).padStart(3, '0')

  return pattern
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('SSS', milliseconds)
} 