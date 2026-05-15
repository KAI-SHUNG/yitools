const SHICHEN = [
  { label: '子时', sub: '23-1', hour: 23 },
  { label: '丑时', sub: '1-3', hour: 1 },
  { label: '寅时', sub: '3-5', hour: 3 },
  { label: '卯时', sub: '5-7', hour: 5 },
  { label: '辰时', sub: '7-9', hour: 7 },
  { label: '巳时', sub: '9-11', hour: 9 },
  { label: '午时', sub: '11-13', hour: 11 },
  { label: '未时', sub: '13-15', hour: 13 },
  { label: '申时', sub: '15-17', hour: 15 },
  { label: '酉时', sub: '17-19', hour: 17 },
  { label: '戌时', sub: '19-21', hour: 19 },
  { label: '亥时', sub: '21-23', hour: 21 },
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function hourToShichenIndex(hour: number): number {
  if (hour === 23) return 0
  return Math.floor((hour + 1) / 2)
}

const SELECT_CLS = 'border border-gray-300 rounded-card px-2 py-1.5 text-sm bg-pure-white focus:outline-none focus:border-lake-green'

interface Props {
  value: Date
  onChange?: (date: Date) => void
}

export default function DateTimePicker({ value, onChange }: Props) {
  const year = value.getFullYear()
  const month = value.getMonth() + 1
  const day = value.getDate()
  const shichenIdx = hourToShichenIndex(value.getHours())

  const maxDay = daysInMonth(year, month)
  const days = Array.from({ length: maxDay }, (_, i) => i + 1)

  const set = (y: number, m: number, d: number, h: number) => {
    onChange?.(new Date(y, m - 1, d, h))
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      <select value={year} onChange={e => set(+e.target.value, month, Math.min(day, daysInMonth(+e.target.value, month)), SHICHEN[shichenIdx].hour)} className={SELECT_CLS}>
        {YEARS.map(y => <option key={y} value={y}>{y}年</option>)}
      </select>
      <select value={month} onChange={e => set(year, +e.target.value, Math.min(day, daysInMonth(year, +e.target.value)), SHICHEN[shichenIdx].hour)} className={SELECT_CLS}>
        {MONTHS.map(m => <option key={m} value={m}>{m}月</option>)}
      </select>
      <select value={day} onChange={e => set(year, month, +e.target.value, SHICHEN[shichenIdx].hour)} className={SELECT_CLS}>
        {days.map(d => <option key={d} value={d}>{d}日</option>)}
      </select>
      <select value={shichenIdx} onChange={e => set(year, month, day, SHICHEN[+e.target.value].hour)} className={SELECT_CLS}>
        {SHICHEN.map((s, i) => <option key={i} value={i}>{s.label}({s.sub})</option>)}
      </select>
    </div>
  )
}
