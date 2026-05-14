import { useNavigate } from 'react-router-dom'
import UserMenu from '../components/auth/UserMenu'

function BaguaIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="32" cy="32" r="28" />
      {/* Trigram: solid — broken — solid */}
      <line x1="20" y1="22" x2="44" y2="22" />
      <line x1="20" y1="32" x2="29" y2="32" />
      <line x1="35" y1="32" x2="44" y2="32" />
      <line x1="20" y1="42" x2="44" y2="42" />
      {/* Cardinal dots */}
      <circle cx="32" cy="4" r="1.5" fill="currentColor" />
      <circle cx="32" cy="60" r="1.5" fill="currentColor" />
      <circle cx="4" cy="32" r="1.5" fill="currentColor" />
      <circle cx="60" cy="32" r="1.5" fill="currentColor" />
    </svg>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const today = new Date()
  const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const weekday = today.toLocaleDateString('zh-CN', { weekday: 'long' })

  return (
    <div className="min-h-screen bg-pure-white flex flex-col items-center justify-center p-6 lg:flex-row lg:gap-16 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <UserMenu />
      </div>
      {/* Date Card */}
      <div className="bg-pure-white rounded-card shadow-card p-8 w-full max-w-sm text-center lg:max-w-xs lg:flex-shrink-0">
        <p className="text-3xl font-light text-ink-black tracking-wide">
          {dateStr}
        </p>
        <p className="text-lg text-ink-gray mt-2">{weekday}</p>
      </div>

      {/* Button Area */}
      <div className="flex flex-col items-center gap-4 mt-8 lg:mt-0">
        <button
          onClick={() => navigate('/divination')}
          className="bg-pure-white rounded-card shadow-card hover:shadow-card-hover
                     transition-shadow duration-300 p-8 w-40 h-40
                     flex flex-col items-center justify-center cursor-pointer border-0 group"
        >
          <BaguaIcon className="w-16 h-16 text-lake-green group-hover:text-lake-green-dark transition-colors duration-300" />
          <span className="text-ink-black text-base mt-3 font-normal tracking-widest">
            六爻
          </span>
        </button>
      </div>
    </div>
  )
}
