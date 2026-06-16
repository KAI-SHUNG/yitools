import type { Yao, LiuShen, NajiaData } from '../../types/yijing'

interface Props {
  yaos: Yao[]
  hexagramName?: string
  najia?: NajiaData | null
  liuShen?: LiuShen[]           // 六神, indexed by position 0-5
  liuChong?: boolean
  liuHe?: boolean
  showShiYing?: boolean
  showFuCang?: boolean
  compact?: boolean
  highlightPositions?: number[]
}

export default function HexagramDisplay({ yaos, hexagramName, najia, liuShen, liuChong, liuHe, showShiYing = true, showFuCang = true, compact = false, highlightPositions = [] }: Props) {
  const sorted = [...yaos].sort((a, b) => b.position - a.position)
  const lineWidth = compact ? 64 : 108
  const leftW = compact ? 110 : 190
  const rightW = compact ? 40 : 64
  const liuShenW = compact ? 28 : 36
  const rowMinW = compact ? 250 : 410

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

      <div className={`flex flex-col ${compact ? 'gap-1.5' : 'gap-3'}`}>
        {sorted.map((yao) => {
          const lineNajia = najia?.lines[yao.position - 1]
          const fuCangLine = showFuCang ? najia?.fuCang?.[yao.position - 1] : undefined
          const isHighlighted = highlightPositions.includes(yao.position)
          const shen = liuShen?.[yao.position - 1]
          const highlightColor = isHighlighted ? 'text-lake-green' : ''

          return (
            <div key={yao.position}>
              {/* Main row: 六神 | 六亲+地支 | 爻线 | 世应 ○× */}
              <div className="flex items-center" style={{ minWidth: rowMinW }}>
                {/* 六神 */}
                <span
                  className={`${compact ? 'text-xs' : 'text-sm'} text-ink-gray shrink-0 ${highlightColor}`}
                  style={{ width: liuShenW }}
                >
                  {shen ?? ''}
                </span>

                {/* 六亲 + 地支五行 */}
                <div className={`flex items-center whitespace-nowrap ${compact ? 'text-xs gap-0.5' : 'text-base gap-2'}`} style={{ width: leftW, justifyContent: 'flex-end' }}>
                  {lineNajia ? (
                    <>
                      <span className={`font-bold shrink-0 ${highlightColor || 'text-ink-black'}`}>{lineNajia.liuQin}</span>
                      <span className={`font-bold shrink-0 ${highlightColor || 'text-ink-black'}`}>{lineNajia.diZhi}{lineNajia.wuXing}</span>
                    </>
                  ) : (
                    <span className="text-ink-light">--</span>
                  )}
                </div>

                {/* 爻线 */}
                <div className="relative flex items-center justify-center mx-2" style={{ width: lineWidth }}>
                  <YaoLine polarity={yao.polarity} isChanging={yao.isChanging} lineWidth={lineWidth} highlight={isHighlighted} />
                </div>

                {/* 世应 + ○× */}
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

              {/* 伏藏: below main row, small red */}
              {fuCangLine && (
                <div
                  className="text-red-500 leading-none"
                  style={{ fontSize: compact ? 10 : 11, paddingLeft: liuShenW + leftW + lineWidth + 16 }}
                >
                  伏 {fuCangLine.liuQin}{fuCangLine.diZhi}{fuCangLine.wuXing}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function YaoLine({ polarity, isChanging, lineWidth, highlight }: { polarity: 'yang' | 'yin'; isChanging: boolean; lineWidth: number; highlight?: boolean }) {
  const color = isChanging || highlight ? '#3a9e8f' : '#1a1a1a'
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
