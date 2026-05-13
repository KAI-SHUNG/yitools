import type { Yao, NajiaData } from '../../types/yijing'

interface Props {
  yaos: Yao[]
  hexagramName?: string
  najia?: NajiaData | null
  liuChong?: boolean
  liuHe?: boolean
  showShiYing?: boolean
  compact?: boolean
}

export default function HexagramDisplay({ yaos, hexagramName, najia, liuChong, liuHe, showShiYing = true, compact = false }: Props) {
  const sorted = [...yaos].sort((a, b) => b.position - a.position)
  const lineWidth = compact ? 64 : 108
  const leftW = compact ? 110 : 190
  const rightW = compact ? 40 : 64
  const rowMinW = compact ? 230 : 380

  return (
    <div className="flex flex-col items-center">
      {hexagramName && (
        <p className={`text-ink-black tracking-widest font-medium mb-1 ${compact ? 'text-base' : 'text-xl'}`}>
          {hexagramName}
        </p>
      )}

      <div className={`flex items-center gap-2 mb-4 ${compact ? 'text-xs' : 'text-sm'}`}>
        {najia?.palace && (
          <span className="text-ink-gray">
            {najia.palace.name}
            {najia.palace.isYouHun ? '·游魂' : najia.palace.isGuiHun ? '·归魂' : ''}
          </span>
        )}
        {liuChong && <span className="text-orange-500">六冲</span>}
        {liuHe && <span className="text-lake-green">六合</span>}
      </div>

      <div className={`flex flex-col ${compact ? 'gap-1.5' : 'gap-3'}`} style={{ marginLeft: -(leftW - rightW) / 2 }}>
        {sorted.map((yao) => {
          const lineNajia = najia?.lines[yao.position - 1]
          const fuCangLine = najia?.fuCang?.[yao.position - 1]
          return (
            <div key={yao.position} className="flex items-center" style={{ minWidth: rowMinW }}>
              {/* Left: 伏藏 + 六亲 + 地支五行 */}
              <div className={`flex items-center whitespace-nowrap ${compact ? 'text-xs gap-0.5' : 'text-base gap-2'}`} style={{ width: leftW, justifyContent: 'flex-end' }}>
                {fuCangLine ? (
                  <span className="text-ink-light shrink-0">
                    {fuCangLine.liuQin}{fuCangLine.diZhi}{fuCangLine.wuXing}
                  </span>
                ) : (
                  <span className="text-ink-light shrink-0" style={{ width: compact ? 32 : 72 }}></span>
                )}
                {lineNajia ? (
                  <>
                    <span className="text-ink-black font-bold shrink-0">{lineNajia.liuQin}</span>
                    <span className="text-ink-black font-bold shrink-0">{lineNajia.diZhi}{lineNajia.wuXing}</span>
                  </>
                ) : (
                  <span className="text-ink-light">--</span>
                )}
              </div>

              {/* Center: Yao line */}
              <div className="relative flex items-center justify-center mx-2" style={{ width: lineWidth }}>
                <YaoLine polarity={yao.polarity} isChanging={yao.isChanging} lineWidth={lineWidth} />
              </div>

              {/* Right: 世/应 then ○/× */}
              <div className={`flex items-center ${compact ? 'gap-1.5 text-xs' : 'gap-2 text-base'}`} style={{ width: rightW }}>
                {showShiYing && lineNajia && (lineNajia.isShi || lineNajia.isYing) && (
                  <span className="text-lake-green font-bold">
                    {lineNajia.isShi ? '世' : '应'}
                  </span>
                )}
                {yao.isChanging && (
                  <span className="text-lake-green font-bold" style={{ fontSize: compact ? 12 : 16 }}>
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

function YaoLine({ polarity, isChanging, lineWidth }: { polarity: 'yang' | 'yin'; isChanging: boolean; lineWidth: number }) {
  const color = isChanging ? '#3a9e8f' : '#1a1a1a'
  const h = 6

  if (polarity === 'yang') {
    return (
      <div style={{ width: lineWidth, height: h, backgroundColor: color, borderRadius: 2 }} />
    )
  }
  const segWidth = (lineWidth - 16) / 2
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ width: segWidth, height: h, backgroundColor: color, borderRadius: 2 }} />
      <div style={{ width: segWidth, height: h, backgroundColor: color, borderRadius: 2 }} />
    </div>
  )
}
