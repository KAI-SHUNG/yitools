import type { DivinationMode } from '../../types/yijing'

interface Props {
  mode: DivinationMode
  onChange: (mode: DivinationMode) => void
}

export default function ModeSelector({ mode, onChange }: Props) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange('coin')}
        className={`px-6 py-3 rounded-card transition-all duration-300 text-base tracking-wide
          ${mode === 'coin'
            ? 'bg-lake-green text-pure-white shadow-card'
            : 'bg-pure-white text-ink-black shadow-card hover:shadow-card-hover'
          }`}
      >
        铜钱摇卦
      </button>
      <button
        onClick={() => onChange('manual')}
        className={`px-6 py-3 rounded-card transition-all duration-300 text-base tracking-wide
          ${mode === 'manual'
            ? 'bg-lake-green text-pure-white shadow-card'
            : 'bg-pure-white text-ink-black shadow-card hover:shadow-card-hover'
          }`}
      >
        手动输入
      </button>
    </div>
  )
}
