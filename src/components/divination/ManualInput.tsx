import { useState } from 'react'
import type { LinePolarity } from '../../types/yijing'

interface Props {
  onComplete: (sums: number[]) => void
}

interface LineState {
  polarity: LinePolarity
  isChanging: boolean
}

const POSITION_LABELS = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']

export default function ManualInput({ onComplete }: Props) {
  const [lines, setLines] = useState<LineState[]>(
    Array.from({ length: 6 }, () => ({ polarity: 'yang' as LinePolarity, isChanging: false }))
  )

  const updateLine = (index: number, patch: Partial<LineState>) => {
    setLines(prev => {
      const next = [...prev]
      next[index] = { ...next[index], ...patch }
      return next
    })
  }

  const handleConfirm = () => {
    const sums = lines.map(line => {
      if (line.polarity === 'yang') return line.isChanging ? 9 : 7
      return line.isChanging ? 6 : 8
    })
    onComplete(sums)
  }

  // Display top to bottom (position 5 down to 0)
  const displayOrder = [...lines].map((line, i) => ({ ...line, index: i })).reverse()

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-ink-gray text-sm">请设置每一爻的属性</p>

      <div className="flex flex-col gap-3 w-full">
        {displayOrder.map(({ polarity, isChanging, index }) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-warm-white rounded-card px-4 py-3"
          >
            <span className="text-ink-gray text-sm w-10">{POSITION_LABELS[index]}</span>

            {/* Polarity toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => updateLine(index, { polarity: 'yang' })}
                className={`px-3 py-1 rounded-lg text-sm transition-all duration-200
                  ${polarity === 'yang'
                    ? 'bg-lake-green text-pure-white'
                    : 'bg-pure-white text-ink-black border border-ink-light'
                  }`}
              >
                阳
              </button>
              <button
                onClick={() => updateLine(index, { polarity: 'yin' })}
                className={`px-3 py-1 rounded-lg text-sm transition-all duration-200
                  ${polarity === 'yin'
                    ? 'bg-lake-green text-pure-white'
                    : 'bg-pure-white text-ink-black border border-ink-light'
                  }`}
              >
                阴
              </button>
            </div>

            {/* Changing line checkbox */}
            <label className="flex items-center gap-1.5 ml-auto cursor-pointer">
              <input
                type="checkbox"
                checked={isChanging}
                onChange={(e) => updateLine(index, { isChanging: e.target.checked })}
                className="w-4 h-4 accent-lake-green"
              />
              <span className="text-ink-gray text-sm">动爻</span>
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        className="bg-lake-green text-pure-white px-8 py-3 rounded-card mt-2
                   hover:bg-lake-green-dark transition-colors duration-300
                   tracking-widest text-base"
      >
        确认
      </button>
    </div>
  )
}
