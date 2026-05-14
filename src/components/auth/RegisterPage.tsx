import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase/client'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 1. Verify invite code
    const { data: codeRow, error: codeError } = await supabase
      .from('invite_codes')
      .select('code')
      .eq('code', inviteCode)
      .eq('used', false)
      .single()

    if (codeError || !codeRow) {
      setLoading(false)
      setError('邀请码无效或已使用')
      return
    }

    // 2. Sign up
    const { error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    // 3. Mark invite code as used
    await supabase.from('invite_codes').update({ used: true }).eq('code', inviteCode)

    setLoading(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center justify-center p-4">
      <div className="bg-pure-white rounded-card shadow-card w-full max-w-sm p-6 sm:p-8">
        <h1 className="text-xl tracking-widest text-ink-black text-center mb-6">注册</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-lake-green"
          />
          <input
            type="password"
            placeholder="密码（至少6位）"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-lake-green"
          />
          <input
            type="text"
            placeholder="邀请码"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-lake-green"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-lake-green text-white rounded py-2 text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <p className="text-center text-sm text-ink-gray mt-4">
          已有账号？<Link to="/login" className="text-lake-green hover:underline">登录</Link>
        </p>
      </div>
    </div>
  )
}
