import { useState } from 'react'
import { tossCoins } from '../../lib/yijing/divination'
import type { CoinTossResult } from '../../types/yijing'

interface Props {
  onComplete: (sums: number[]) => void
}

export default function CoinToss({ onComplete }: Props) {
  const [tosses, setTosses] = useState<CoinTossResult[]>([])
  const [isFlipping, setIsFlipping] = useState(false)
  const [currentCoins, setCurrentCoins] = useState<[number, number, number] | null>(null)

  const handleToss = () => {
    if (isFlipping || tosses.length >= 6) return

    setIsFlipping(true)
    setCurrentCoins(null)

    // Animate for 800ms, then reveal result
    setTimeout(() => {
      const result = tossCoins()
      setCurrentCoins(result.coins)
      setIsFlipping(false)

      const newTosses = [...tosses, result]
      setTosses(newTosses)

      if (newTosses.length === 6) {
        setTimeout(() => {
          onComplete(newTosses.map(t => t.sum))
        }, 600)
      }
    }, 800)
  }

  const progress = tosses.length
  const isComplete = progress >= 6

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-ink-gray text-sm">
        {isComplete ? '起卦完成' : `第 ${progress + 1}/6 爻`}
      </p>

      {/* Coins display */}
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => {
          const value = currentCoins?.[i]
          const flipping = isFlipping
          return (
            <div
              key={i}
              className={`w-16 h-16 rounded-full border-2 border-lake-green
                flex items-center justify-center text-lg font-medium
                transition-all duration-300
                ${flipping ? 'animate-coin-flip' : ''}
                ${value === 3 ? 'bg-lake-green text-pure-white' : ''}
                ${value === 2 ? 'bg-pure-white text-lake-green' : ''}
                ${value === undefined ? 'bg-warm-white text-ink-light' : ''}
              `}
              style={{ perspective: '200px' }}
            >
              {flipping ? '...' : value === 3 ? '字' : value === 2 ? '花' : '?'}
            </div>
          )
        })}
      </div>

      {/* Accumulated lines preview */}
      {tosses.length > 0 && (
        <div className="flex flex-col items-center gap-2 mt-2">
          {[...tosses].reverse().map((toss, i) => {
            const position = tosses.length - i
            return (
              <div key={position} className="flex items-center w-24">
                <TossLine polarity={toss.polarity} isChanging={toss.isChanging} />
                {toss.isChanging && (
                  <span className="ml-2 w-1.5 h-1.5 rounded-full bg-lake-green flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Toss button */}
      {!isComplete && (
        <button
          onClick={handleToss}
          disabled={isFlipping}
          className="bg-lake-green text-pure-white px-8 py-3 rounded-card
                     hover:bg-lake-green-dark transition-colors duration-300
                     tracking-widest text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFlipping ? '摇卦中...' : '摇卦'}
        </button>
      )}
    </div>
  )
}

function TossLine({ polarity, isChanging }: { polarity: 'yang' | 'yin'; isChanging: boolean }) {
  const color = isChanging ? 'bg-lake-green' : 'bg-ink-black'
  if (polarity === 'yang') {
    return <div className={`w-16 h-1 ${color} rounded-sm`} />
  }
  return (
    <div className="flex gap-2">
      <div className={`w-6 h-1 ${color} rounded-sm`} />
      <div className={`w-6 h-1 ${color} rounded-sm`} />
    </div>
  )
}
