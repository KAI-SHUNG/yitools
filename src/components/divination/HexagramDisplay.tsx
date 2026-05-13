import type { Yao, NajiaData } from '../../types/yijing'

interface Props {
  yaos: Yao[]
  hexagramName?: string
  najia?: NajiaData | null
  liuChong?: boolean
  liuHe?: boolean
  showShiYing?: boolean  // false for 变卦
}

const LINE_WIDTH = 96

export default function HexagramDisplay({ yaos, hexagramName, najia, liuChong, liuHe, showShiYing = true }: Props) {
  const sorted = [...yaos].sort((a, b) => b.position - a.position)

  return (
    <div className="flex flex-col items-center">
      {/* Hexagram name */}
      {hexagramName && (
        <p className="text-ink-black text-lg tracking-widest font-medium mb-1">
          {hexagramName}
        </p>
      )}

      {/* Palace + 六冲/六合 (below name) */}
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
          const fuCangLine = najia?.fuCang?.[yao.position - 1]
          return (
            <div key={yao.position} className="flex items-center" style={{ minWidth: 320 }}>
              {/* Left: 伏藏 (if exists) + 六亲 + 地支五行 */}
              <div className="flex items-center gap-1.5 text-xs" style={{ width: 150, justifyContent: 'flex-end' }}>
                {fuCangLine ? (
                  <span className="text-ink-light">
                    {fuCangLine.liuQin}{fuCangLine.diZhi}{fuCangLine.wuXing}
                  </span>
                ) : (
                  <span className="text-ink-light" style={{ width: 60 }}></span>
                )}
                {lineNajia ? (
                  <>
                    <span className="text-ink-black font-bold">{lineNajia.liuQin}</span>
                    <span className="text-ink-black font-bold">{lineNajia.diZhi}{lineNajia.wuXing}</span>
                  </>
                ) : (
                  <span className="text-ink-light">--</span>
                )}
              </div>

              {/* Center: Yao line (always centered) */}
              <div className="relative flex items-center justify-center mx-3" style={{ width: LINE_WIDTH }}>
                <YaoLine polarity={yao.polarity} isChanging={yao.isChanging} />
              </div>

              {/* Right: 世/应 then ○/× */}
              <div className="flex items-center gap-2 text-xs" style={{ width: 60 }}>
                {showShiYing && lineNajia && (lineNajia.isShi || lineNajia.isYing) && (
                  <span className="text-lake-green font-bold">
                    {lineNajia.isShi ? '世' : '应'}
                  </span>
                )}
                {yao.isChanging && (
                  <span className="text-lake-green font-bold" style={{ fontSize: 14 }}>
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
