import { useState } from 'react'
import { tossCoins } from '../../lib/yijing/divination'
import type { CoinTossResult } from '../../types/yijing'

interface Props {
  onComplete: (sums: number[]) => void
}

const LINE_WIDTH = 64 // px for preview lines

export default function CoinToss({ onComplete }: Props) {
  const [tosses, setTosses] = useState<CoinTossResult[]>([])
  const [isFlipping, setIsFlipping] = useState(false)
  const [currentCoins, setCurrentCoins] = useState<[number, number, number] | null>(null)

  const handleToss = () => {
    if (isFlipping || tosses.length >= 6) return

    setIsFlipping(true)
    setCurrentCoins(null)

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

      {/* Coins — always visible */}
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => {
          const value = currentCoins?.[i]
          return (
            <div
              key={i}
              className={`w-16 h-16 rounded-full border-2 border-lake-green
                flex items-center justify-center text-lg font-medium
                transition-all duration-300
                ${isFlipping ? 'animate-coin-flip' : ''}
                ${value === 3 ? 'bg-lake-green text-pure-white' : ''}
                ${value === 2 ? 'bg-pure-white text-lake-green' : ''}
                ${value === undefined ? 'bg-warm-white text-ink-light' : ''}
              `}
              style={{ perspective: '200px' }}
            >
              {isFlipping ? '' : value === 3 ? '字' : value === 2 ? '花' : '?'}
            </div>
          )
        })}
      </div>

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

      {/* Accumulated lines preview */}
      {tosses.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          {[...tosses].reverse().map((toss, i) => {
            const position = tosses.length - i
            return (
              <div key={position} className="flex items-center justify-center">
                <TossLine polarity={toss.polarity} isChanging={toss.isChanging} />
                {toss.isChanging && (
                  <span className="ml-3 w-1.5 h-1.5 rounded-full bg-lake-green flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TossLine({ polarity, isChanging }: { polarity: 'yang' | 'yin'; isChanging: boolean }) {
  const color = isChanging ? '#3a9e8f' : '#1a1a1a'
  if (polarity === 'yang') {
    return (
      <div style={{ width: LINE_WIDTH, height: 4, backgroundColor: color, borderRadius: 2 }} />
    )
  }
  const segWidth = (LINE_WIDTH - 12) / 2
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ width: segWidth, height: 4, backgroundColor: color, borderRadius: 2 }} />
      <div style={{ width: segWidth, height: 4, backgroundColor: color, borderRadius: 2 }} />
    </div>
  )
}
