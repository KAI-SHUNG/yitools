import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getSupabase } from '../../lib/supabase/client'

export default function UserMenu() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <Link to="/login" className="text-sm text-ink-gray hover:text-lake-green transition-colors">
        登录
      </Link>
    )
  }

  const handleLogout = async () => {
    const sb = getSupabase()
    if (sb) await sb.auth.signOut()
    navigate('/')
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <Link to="/history" className="text-ink-gray hover:text-lake-green transition-colors">
        历史
      </Link>
      <span className="text-ink-light">{user.email}</span>
      <button onClick={handleLogout} className="text-ink-gray hover:text-lake-green transition-colors">
        退出
      </button>
    </div>
  )
}
