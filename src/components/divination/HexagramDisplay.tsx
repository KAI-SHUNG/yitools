import type { Yao, NajiaData } from '../../types/yijing'

interface Props {
  yaos: Yao[]
  hexagramName?: string
  najia?: NajiaData | null
  liuChong?: boolean
  liuHe?: boolean
}

const LINE_WIDTH = 96

export default function HexagramDisplay({ yaos, hexagramName, najia, liuChong, liuHe }: Props) {
  const sorted = [...yaos].sort((a, b) => b.position - a.position)

  return (
    <div className="flex flex-col items-center">
      {/* Hexagram name + palace + 六冲/六合 */}
      {hexagramName && (
        <p className="text-ink-black text-lg tracking-widest font-medium mb-1">
          {hexagramName}
        </p>
      )}
      <div className="flex items-center gap-2 mb-4">
        {najia?.palace && (
          <span className="text-ink-gray text-xs">
            {najia.palace.name}
            {najia.palace.isYouHun ? '·游魂' : najia.palace.isGuiHun ? '·归魂' : ''}
          </span>
        )}
        {liuChong && <span className="text-orange-500 text-xs">六冲</span>}
        {liuHe && <span className="text-lake-green text-xs">六合</span>}
      </div>

      {/* Lines */}
      <div className="flex flex-col gap-2.5">
        {sorted.map((yao) => {
          const lineNajia = najia?.lines[yao.position - 1]
          return (
            <div key={yao.position} className="flex items-center" style={{ minWidth: 200 }}>
              {/* Left: Na Jia label */}
              <div className="flex items-center gap-1 text-xs" style={{ width: 100, justifyContent: 'flex-end' }}>
                {lineNajia ? (
                  <>
                    <span className="text-ink-gray w-8 text-right">{lineNajia.liuQin}</span>
                    <span className="text-ink-black w-12 text-right">
                      {lineNajia.diZhi}{lineNajia.wuXing}
                    </span>
                    {(lineNajia.isShi || lineNajia.isYing) && (
                      <span className="text-lake-green font-bold w-4 text-center">
                        {lineNajia.isShi ? '世' : '应'}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-ink-light">--</span>
                )}
              </div>

              {/* Center: Yao line (centered) */}
              <div className="relative flex items-center justify-center mx-2" style={{ width: LINE_WIDTH + 24 }}>
                <YaoLine polarity={yao.polarity} isChanging={yao.isChanging} />
                {yao.isChanging && (
                  <span
                    className="absolute text-lake-green font-bold"
                    style={{ right: 0, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}
                  >
                    {yao.polarity === 'yang' ? '○' : '×'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function YaoLine({ polarity, isChanging }: { polarity: 'yang' | 'yin'; isChanging: boolean }) {
  const color = isChanging ? '#3a9e8f' : '#1a1a1a'

  if (polarity === 'yang') {
    return (
      <div style={{ width: LINE_WIDTH, height: 6, backgroundColor: color, borderRadius: 2 }} />
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
