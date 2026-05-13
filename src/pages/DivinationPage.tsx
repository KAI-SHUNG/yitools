import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModeSelector from '../components/divination/ModeSelector'
import CoinToss from '../components/divination/CoinToss'
import ManualInput from '../components/divination/ManualInput'
import HexagramDisplay from '../components/divination/HexagramDisplay'
import { performDivination } from '../lib/yijing/divination'
import type { DivinationMode, DivinationResult } from '../types/yijing'

type PageState = 'mode-select' | 'input' | 'result'

export default function DivinationPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<DivinationMode>('coin')
  const [pageState, setPageState] = useState<PageState>('mode-select')
  const [result, setResult] = useState<DivinationResult | null>(null)

  const handleComplete = (sums: number[]) => {
    const divResult = performDivination(sums)
    setResult(divResult)
    setPageState('result')
  }

  const handleReset = () => {
    setResult(null)
    setPageState('mode-select')
  }

  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-ink-gray hover:text-lake-green transition-colors duration-200 p-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl tracking-widest text-ink-black mx-auto pr-8">起卦</h1>
      </div>

      {/* Main card */}
      <div className="bg-pure-white rounded-card shadow-card p-8 w-full max-w-lg">
        {pageState === 'mode-select' && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-ink-gray text-sm">请选择起卦方式</p>
            <ModeSelector mode={mode} onChange={setMode} />
            <button
              onClick={() => setPageState('input')}
              className="bg-lake-green text-pure-white px-8 py-3 rounded-card
                         hover:bg-lake-green-dark transition-colors duration-300
                         tracking-widest text-base"
            >
              开始
            </button>
          </div>
        )}

        {pageState === 'input' && mode === 'coin' && (
          <CoinToss onComplete={handleComplete} />
        )}

        {pageState === 'input' && mode === 'manual' && (
          <ManualInput onComplete={handleComplete} />
        )}

        {pageState === 'result' && result && (
          <div className="flex flex-col items-center gap-8">
            {/* 本卦 */}
            <div className="text-center">
              <h2 className="text-lg text-ink-gray tracking-wide mb-4">本卦</h2>
              <HexagramDisplay
                yaos={result.original.yaos}
                hexagramName={result.original.name}
              />
              <p className="text-sm text-ink-gray mt-3">{result.original.guaCi}</p>
            </div>

            {/* 变卦 */}
            {result.changed && (
              <div className="text-center">
                <h2 className="text-lg text-ink-gray tracking-wide mb-4">变卦</h2>
                <HexagramDisplay
                  yaos={result.changed.yaos}
                  hexagramName={result.changed.name}
                />
              </div>
            )}

            {/* 动爻信息 */}
            {result.changingPositions.length > 0 && (
              <p className="text-sm text-lake-green">
                动爻：第 {result.changingPositions.join('、')} 爻
              </p>
            )}

            {/* 重新起卦 */}
            <button
              onClick={handleReset}
              className="text-ink-gray hover:text-lake-green transition-colors
                         duration-200 tracking-wide"
            >
              重新起卦
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
