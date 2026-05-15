import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import UserMenu from '../components/auth/UserMenu'
import HexagramDisplay from '../components/divination/HexagramDisplay'
import { useAuth } from '../hooks/useAuth'
import { getSupabase } from '../lib/supabase/client'
import { reconstructDivination } from '../lib/yijing/divination'
import { getDateTimePillars } from '../lib/yijing/datetime'
import { generateCopyText } from '../lib/yijing/copyText'
import DateTimePicker from '../components/divination/DateTimePicker'
import { YAO_CI } from '../data/yaoci'
import type { DivinationResult } from '../types/yijing'

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return isMobile
}

interface Record {
  id: string
  question: string
  wen_number: number
  changed_wen_number: number | null
  changing_positions: number[]
  divination_time: string
  created_at: string
}

export default function HistoryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { user, loading } = useAuth()
  const [record, setRecord] = useState<Record | null>(null)
  const [result, setResult] = useState<DivinationResult | null>(null)
  const [fetching, setFetching] = useState(true)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'no-question'>('idle')
  const [editingQuestion, setEditingQuestion] = useState(false)
  const [questionDraft, setQuestionDraft] = useState('')
  const [savingQuestion, setSavingQuestion] = useState(false)

  const handleCopy = async () => {
    if (!record?.question?.trim()) {
      setCopyStatus('no-question')
      setTimeout(() => setCopyStatus('idle'), 2000)
      return
    }
    if (!result) return
    const text = generateCopyText(result, record.question.trim())
    await navigator.clipboard.writeText(text)
    setCopyStatus('copied')
    setTimeout(() => setCopyStatus('idle'), 2000)
  }

  const handleSaveQuestion = async () => {
    if (!record || !questionDraft.trim()) return
    const sb = getSupabase()
    if (!sb) return
    setSavingQuestion(true)
    const { error } = await sb.from('divinations')
      .update({ question: questionDraft.trim() })
      .eq('id', record.id)
      .eq('user_id', user!.id)
    if (!error) {
      setRecord({ ...record, question: questionDraft.trim() })
      setEditingQuestion(false)
    }
    setSavingQuestion(false)
  }

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login')
      return
    }
    const sb = getSupabase()
    if (!sb) { setFetching(false); return }
    sb.from('divinations')
      .select('id, question, wen_number, changed_wen_number, changing_positions, divination_time, created_at')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setRecord(data)
          const r = reconstructDivination(
            data.wen_number,
            data.changing_positions,
            new Date(data.divination_time),
            data.changed_wen_number,
          )
          setResult(r)
        }
        setFetching(false)
      })
  }, [id, user, loading, navigate])

  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center p-4 sm:p-6">
      {/* Header */}
      <div className="w-full max-w-2xl relative flex items-center justify-center mb-6 sm:mb-8">
        <button
          onClick={() => navigate('/history')}
          className="absolute left-0 text-ink-gray hover:text-lake-green transition-colors duration-200 p-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl sm:text-2xl tracking-widest text-ink-black">历史详情</h1>
        <div className="absolute right-0">
          <UserMenu />
        </div>
      </div>

      {/* Content */}
      <div className={`bg-pure-white rounded-card shadow-card w-full flex flex-col items-center
        ${isMobile ? 'p-4' : 'p-8'} max-w-4xl`}>
        {fetching ? (
          <p className="text-ink-gray">加载中...</p>
        ) : !record || !result ? (
          <div className="text-center">
            <p className="text-ink-gray mb-4">记录不存在</p>
            <button onClick={() => navigate('/history')} className="text-lake-green hover:underline">返回历史</button>
          </div>
        ) : (() => {
          const dt = getDateTimePillars(result.timestamp)
          return (
            <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
              {/* 事项 — 可编辑 */}
              {editingQuestion ? (
                <div className="flex items-center gap-2 w-full max-w-md">
                  <input
                    type="text"
                    value={questionDraft}
                    onChange={e => setQuestionDraft(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-card px-3 py-1.5 text-sm bg-pure-white focus:outline-none focus:border-lake-green"
                    autoFocus
                  />
                  <button onClick={handleSaveQuestion} disabled={savingQuestion} className="px-3 py-1.5 rounded text-sm bg-lake-green text-white hover:opacity-90 disabled:opacity-50">
                    {savingQuestion ? '...' : '保存'}
                  </button>
                  <button onClick={() => setEditingQuestion(false)} className="px-3 py-1.5 rounded text-sm text-ink-gray hover:text-ink-black">
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setQuestionDraft(record.question); setEditingQuestion(true); }}
                  className="text-ink-black text-base sm:text-lg font-medium tracking-wide hover:text-lake-green transition-colors"
                  title="点击编辑事项"
                >
                  {record.question || '（无事项，点击添加）'}
                </button>
              )}

              {/* 起卦时间 */}
              <div className="flex flex-col items-center gap-2">
                <DateTimePicker value={new Date(record.divination_time)} />
                <p className="text-xs text-ink-light">
                  入库 {new Date(record.created_at).toLocaleString('zh-CN')}
                </p>
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

              {/* 本卦 + 变卦 */}
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

              {/* 复制按钮 */}
              <button
                onClick={handleCopy}
                className={`mt-2 px-6 py-2 rounded text-sm tracking-wide transition-all border
                  ${copyStatus === 'no-question'
                    ? 'border-red-400 text-red-500 bg-red-50'
                    : copyStatus === 'copied'
                      ? 'border-lake-green/40 text-lake-green bg-lake-green/10'
                      : 'border-gray-300 text-ink-gray hover:border-lake-green hover:text-lake-green'
                  }`}
              >
                {copyStatus === 'idle' && '复制卦象'}
                {copyStatus === 'copied' && '已复制'}
                {copyStatus === 'no-question' && '事项为空，无法复制'}
              </button>
            </div>
          )
        })()}
      </div>

      {/* 爻辞 section */}
      {result && (() => {
        const wenNum = result.original.wenNumber
        const yaoci = wenNum ? YAO_CI[wenNum] : null
        if (!yaoci || yaoci.every(y => !y)) return null
        const yaoPosNames = ['初', '二', '三', '四', '五', '上']
        const yaos = result.original.yaos
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
