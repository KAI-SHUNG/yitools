import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import UserMenu from '../components/auth/UserMenu'
import { useAuth } from '../hooks/useAuth'
import { getSupabase } from '../lib/supabase/client'
import { HEXAGRAM_DATA } from '../lib/yijing/hexagrams'

interface DivinationRecord {
  id: string
  question: string
  wen_number: number
  changed_wen_number: number | null
  changing_positions: number[]
  divination_time: string
  created_at: string
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [records, setRecords] = useState<DivinationRecord[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login')
      return
    }
    const sb = getSupabase()
    if (!sb) { setFetching(false); return }
    sb.from('divinations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRecords(data ?? [])
        setFetching(false)
      })
  }, [user, loading, navigate])

  const hexName = (wenNum: number) =>
    HEXAGRAM_DATA.find(h => h.wenNumber === wenNum)?.fullName ?? `第${wenNum}卦`

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center p-4 sm:p-6">
      {/* Header */}
      <div className="w-full max-w-2xl relative flex items-center justify-center mb-6 sm:mb-8">
        <button
          onClick={() => navigate('/')}
          className="absolute left-0 text-ink-gray hover:text-lake-green transition-colors duration-200 p-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl sm:text-2xl tracking-widest text-ink-black">历史记录</h1>
        <div className="absolute right-0">
          <UserMenu />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-2xl">
        {fetching ? (
          <p className="text-center text-ink-gray">加载中...</p>
        ) : records.length === 0 ? (
          <div className="text-center">
            <p className="text-ink-gray mb-4">暂无记录</p>
            <Link to="/divination" className="text-lake-green hover:underline">去起卦</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {records.map(r => (
              <Link key={r.id} to={`/history/${r.id}`}
                className="bg-pure-white rounded-card shadow-card p-4 sm:p-5 hover:shadow-lg transition-shadow cursor-pointer">
                <p className="text-ink-black font-medium text-sm sm:text-base mb-1">{r.question}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-ink-gray">
                  <span>{formatDate(r.divination_time || r.created_at)}</span>
                  <span className="text-ink-black">{hexName(r.wen_number)}</span>
                  {r.changed_wen_number && (
                    <>
                      <span>→</span>
                      <span className="text-ink-black">{hexName(r.changed_wen_number)}</span>
                    </>
                  )}
                  {r.changing_positions.length > 0 && (
                    <span className="text-lake-green">动爻：{r.changing_positions.join('、')}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
