import type { Yao } from '../../types/yijing'

interface Props {
  yaos: Yao[]
  hexagramName?: string
}

const LINE_WIDTH = 96 // px

export default function HexagramDisplay({ yaos, hexagramName }: Props) {
  const sorted = [...yaos].sort((a, b) => b.position - a.position)

  return (
    <div className="flex flex-col items-center gap-3">
      {sorted.map((yao) => (
        <div key={yao.position} className="flex items-center justify-center">
          <YaoLine polarity={yao.polarity} isChanging={yao.isChanging} />
          {yao.isChanging && (
            <span className="ml-3 w-2 h-2 rounded-full bg-lake-green flex-shrink-0" />
          )}
        </div>
      ))}
      {hexagramName && (
        <p className="text-ink-black text-lg tracking-widest mt-2 font-medium">
          {hexagramName}
        </p>
      )}
    </div>
  )
}

function YaoLine({ polarity, isChanging }: { polarity: 'yang' | 'yin'; isChanging: boolean }) {
  const color = isChanging ? '#3a9e8f' : '#1a1a1a'

  if (polarity === 'yang') {
    return (
      <div
        style={{ width: LINE_WIDTH, height: 6, backgroundColor: color, borderRadius: 2 }}
      />
    )
  }
  const segWidth = (LINE_WIDTH - 16) / 2
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ width: segWidth, height: 6, backgroundColor: color, borderRadius: 2 }} />
      <div style={{ width: segWidth, height: 6, backgroundColor: color, borderRadius: 2 }} />
    </div>
  )
}
