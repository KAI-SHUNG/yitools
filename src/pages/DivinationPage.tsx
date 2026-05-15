import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ModeSelector from '../components/divination/ModeSelector'
import CoinToss from '../components/divination/CoinToss'
import ManualInput from '../components/divination/ManualInput'
import HexagramDisplay from '../components/divination/HexagramDisplay'
import UserMenu from '../components/auth/UserMenu'
import { performDivination } from '../lib/yijing/divination'
import { getDateTimePillars } from '../lib/yijing/datetime'
import { generateCopyText } from '../lib/yijing/copyText'
import DateTimePicker from '../components/divination/DateTimePicker'
import { YAO_CI } from '../data/yaoci'
import { useAuth } from '../hooks/useAuth'
import { getSupabase } from '../lib/supabase/client'
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
  const { user } = useAuth()
  const [mode, setMode] = useState<DivinationMode>('coin')
  const [result, setResult] = useState<DivinationResult | null>(null)
  const [question, setQuestion] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'no-question'>('idle')
  const [selectedTime, setSelectedTime] = useState(() => new Date())

  const handleComplete = (sums: number[]) => {
    const divResult = performDivination(sums)
    setResult(divResult)
    setSelectedTime(new Date())
    setSaveStatus('idle')
  }

  const handleSave = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!question.trim()) return
    if (!result) return

    const sb = getSupabase()
    if (!sb) { setSaveStatus('error'); return }
    setSaveStatus('saving')
    const { error } = await sb.from('divinations').insert({
      user_id: user.id,
      question: question.trim(),
      wen_number: result.original.wenNumber,
      changed_wen_number: result.changed?.wenNumber ?? null,
      changing_positions: result.changingPositions,
      divination_time: selectedTime.toISOString(),
    })
    setSaveStatus(error ? 'error' : 'saved')
  }

  const handleCopy = async () => {
    if (!question.trim()) {
      setCopyStatus('no-question')
      setTimeout(() => setCopyStatus('idle'), 2000)
      return
    }
    if (!result) return
    const text = generateCopyText({ ...result, timestamp: selectedTime }, question.trim())
    await navigator.clipboard.writeText(text)
    setCopyStatus('copied')
    setTimeout(() => setCopyStatus('idle'), 2000)
  }

  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center p-4 sm:p-6">
      {/* Header */}
      <div className="w-full max-w-2xl relative flex items-center justify-center mb-6 sm:mb-8">
        <button
          onClick={() => result ? setResult(null) : navigate('/')}
          className="absolute left-0 text-ink-gray hover:text-lake-green transition-colors duration-200 p-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl sm:text-2xl tracking-widest text-ink-black">起卦</h1>
        <div className="absolute right-0">
          <UserMenu />
        </div>
      </div>

      {/* 事项 input — 始终显示 */}
      <div className="mb-6 w-full max-w-lg flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="所问事项（如：近期事业如何）"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="w-full border border-gray-300 rounded-card px-4 py-2.5 text-sm sm:text-base
                     bg-pure-white focus:outline-none focus:border-lake-green placeholder:text-ink-light"
        />
        {!result && (
          <ModeSelector mode={mode} onChange={(m) => { setMode(m); setResult(null); }} />
        )}
      </div>

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
          const dt = getDateTimePillars(selectedTime)
          return (
          <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">

            {/* 起卦时间 */}
            <div className="flex flex-col items-center gap-2">
              <DateTimePicker value={selectedTime} onChange={setSelectedTime} />
              <button
                onClick={() => setSelectedTime(new Date())}
                className="text-xs text-lake-green hover:underline"
              >
                现在
              </button>
            </div>

            {/* 干支时间 */}
            <div className="text-center leading-loose text-base sm:text-lg">
              <p className="text-ink-gray">日期 {dt.date}</p>
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

            {/* 按钮行 */}
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                className={`px-6 py-2 rounded text-sm tracking-wide transition-all
                  ${saveStatus === 'saved'
                    ? 'bg-lake-green/20 text-lake-green cursor-default'
                    : 'bg-lake-green text-white hover:opacity-90 disabled:opacity-50'
                  }`}
              >
                {saveStatus === 'idle' && (user ? '保存记录' : '登录后保存')}
                {saveStatus === 'saving' && '保存中...'}
                {saveStatus === 'saved' && '已保存'}
                {saveStatus === 'error' && '保存失败，点击重试'}
              </button>

              <button
                onClick={handleCopy}
                className={`px-6 py-2 rounded text-sm tracking-wide transition-all border
                  ${copyStatus === 'no-question'
                    ? 'border-red-400 text-red-500 bg-red-50'
                    : copyStatus === 'copied'
                      ? 'border-lake-green/40 text-lake-green bg-lake-green/10'
                      : 'border-gray-300 text-ink-gray hover:border-lake-green hover:text-lake-green'
                  }`}
              >
                {copyStatus === 'idle' && '复制卦象'}
                {copyStatus === 'copied' && '已复制'}
                {copyStatus === 'no-question' && '请先填写事项'}
              </button>
            </div>
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
        const rows = [...yaos].reverse().map((yao) => {
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
