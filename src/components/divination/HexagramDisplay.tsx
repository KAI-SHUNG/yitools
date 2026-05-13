import type { Yao } from '../../types/yijing'

interface Props {
  yaos: Yao[]
  hexagramName?: string
}

export default function HexagramDisplay({ yaos, hexagramName }: Props) {
  // Render from top (position 6) to bottom (position 1)
  const sorted = [...yaos].sort((a, b) => b.position - a.position)

  return (
    <div className="flex flex-col items-center gap-3">
      {sorted.map((yao) => (
        <div key={yao.position} className="flex items-center w-32">
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
  const color = isChanging ? 'bg-lake-green' : 'bg-ink-black'

  if (polarity === 'yang') {
    return <div className={`w-24 h-1.5 ${color} rounded-sm`} />
  }
  // Broken line: two shorter segments with a gap
  return (
    <div className="flex gap-3">
      <div className={`w-10 h-1.5 ${color} rounded-sm`} />
      <div className={`w-10 h-1.5 ${color} rounded-sm`} />
    </div>
  )
}
