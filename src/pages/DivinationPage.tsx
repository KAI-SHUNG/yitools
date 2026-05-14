import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ModeSelector from '../components/divination/ModeSelector'
import CoinToss from '../components/divination/CoinToss'
import ManualInput from '../components/divination/ManualInput'
import HexagramDisplay from '../components/divination/HexagramDisplay'
import { performDivination } from '../lib/yijing/divination'
import { getDateTimePillars } from '../lib/yijing/datetime'
import { YAO_CI } from '../data/yaoci'
import type { DivinationMode, DivinationResult } from '../types/yijing'

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return isMobile
}

export default function DivinationPage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [mode, setMode] = useState<DivinationMode>('coin')
  const [result, setResult] = useState<DivinationResult | null>(null)

  const handleComplete = (sums: number[]) => {
    const divResult = performDivination(sums)
    setResult(divResult)
  }

  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center p-4 sm:p-6">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center mb-6 sm:mb-8">
        <button
          onClick={() => result ? setResult(null) : navigate('/')}
          className="text-ink-gray hover:text-lake-green transition-colors duration-200 p-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl sm:text-2xl tracking-widest text-ink-black mx-auto pr-8">起卦</h1>
      </div>

      {/* Mode selector */}
      {!result && (
        <div className="mb-6">
          <ModeSelector mode={mode} onChange={(m) => { setMode(m); setResult(null); }} />
        </div>
      )}

      {/* Main card */}
      <div className={`bg-pure-white rounded-card shadow-card w-full flex flex-col items-center
        ${isMobile ? 'p-4' : 'p-8'} ${result ? 'max-w-4xl' : 'max-w-lg'}`}>
        {!result && mode === 'coin' && (
          <CoinToss onComplete={handleComplete} />
        )}

        {!result && mode === 'manual' && (
          <ManualInput onComplete={handleComplete} />
        )}

        {result && (() => {
          const dt = getDateTimePillars(result.timestamp)
          return (
          <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
            {/* 日期时间 */}
            <div className="text-center leading-loose text-xs sm:text-sm">
              <p className="text-ink-gray text-lg">日期 {dt.date}</p>
              <p className="text-ink-black">
                {dt.yearPillar} | <span className="text-red-600 font-bold">{dt.monthPillar}</span> | <span className="text-red-600 font-bold">{dt.dayPillar}</span> | {dt.hourPillar}
              </p>
              <p className="text-ink-black">
                旬空：<span className="text-red-600 font-bold">{dt.shunKong[0]}{dt.shunKong[1]}</span>
              </p>
            </div>

            {/* 本卦 + 变卦: stack on mobile, side by side on desktop */}
            <div className={`flex w-full justify-center
              ${result.changed
                ? 'flex-col sm:flex-row gap-6 sm:gap-12'
                : ''}`}>
              {/* 本卦 */}
              <div className="flex flex-col items-center">
                <h2 className="text-base sm:text-lg text-ink-gray tracking-wide mb-3">本卦</h2>
                <HexagramDisplay
                  yaos={result.original.yaos}
                  hexagramName={result.original.name}
                  najia={result.originalNajia}
                  liuChong={result.original.liuChong}
                  liuHe={result.original.liuHe}
                  compact={isMobile}
                />
                <p className="text-xs sm:text-sm text-ink-gray mt-3 max-w-xs text-center">{result.original.guaCi}</p>
              </div>

              {/* 变卦 */}
              {result.changed && (
                <div className="flex flex-col items-center">
                  <h2 className="text-base sm:text-lg text-ink-gray tracking-wide mb-3">变卦</h2>
                  <HexagramDisplay
                    yaos={result.changed.yaos}
                    hexagramName={result.changed.name}
                    najia={result.changedNajia}
                    showShiYing={false}
                    compact={isMobile}
                    highlightPositions={result.changingPositions}
                  />
                </div>
              )}
            </div>

            {/* 动爻信息 */}
            {result.changingPositions.length > 0 && (
              <p className="text-xs sm:text-sm text-lake-green">
                动爻：第 {result.changingPositions.join('、')} 爻
              </p>
            )}
          </div>
          )})()}
      </div>

      {/* 爻辞 section */}
      {result && (() => {
        const wenNum = result.original.wenNumber
        const yaoci = wenNum ? YAO_CI[wenNum] : null
        if (!yaoci || yaoci.every(y => !y)) return null
        const yaoPosNames = ['初', '二', '三', '四', '五', '上']
        const yaos = result.original.yaos
        // Display top to bottom: position 6(上) down to 1(初)
        const rows = [...yaos].reverse().map((yao, i) => {
          const posName = yaoPosNames[yao.position - 1]
          const gan = yao.polarity === 'yang' ? '九' : '六'
          const label = posName === '上' || posName === '初'
            ? `${posName}${gan}`
            : `${gan}${posName}`
          const text = yaoci[yao.position - 1]
          const isChanging = result.changingPositions.includes(yao.position)
          return { label, text, isChanging }
        })
        return (
          <div className="bg-pure-white rounded-card shadow-card w-full max-w-4xl mt-4 sm:mt-6 p-4 sm:p-8">
            <p className="text-ink-gray text-sm mb-3 tracking-wide">爻辞</p>
            <div className="flex flex-col gap-1.5">
              {rows.map(({ label, text, isChanging }) => (
                <div key={label} className={`flex gap-3 text-sm sm:text-base leading-relaxed ${isChanging ? 'text-lake-green font-bold' : 'text-ink-black'}`}>
                  <span className="shrink-0 w-10 text-right">{label}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
