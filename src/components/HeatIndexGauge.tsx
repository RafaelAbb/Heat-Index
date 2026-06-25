import { useEffect, useState } from 'react'
import { toGaugeAngle, getSeverity } from '../lib/heatIndex'

interface Props {
  heatIndex: number | null
  temperature: number
}

const ZONES = [
  { label: 'Comfortable',    color: '#4ade80', start: 15, end: 27 },
  { label: 'Caution',        color: '#facc15', start: 27, end: 32 },
  { label: 'Extreme Caution',color: '#fb923c', start: 32, end: 41 },
  { label: 'Danger',         color: '#ef4444', start: 41, end: 54 },
  { label: 'Extreme Danger', color: '#a855f7', start: 54, end: 60 },
]

const MIN = 15
const MAX = 60
const RANGE = MAX - MIN

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const toRad = (d: number) => ((d - 180) * Math.PI) / 180
  const x1 = cx + r * Math.cos(toRad(startDeg))
  const y1 = cy + r * Math.sin(toRad(startDeg))
  const x2 = cx + r * Math.cos(toRad(endDeg))
  const y2 = cy + r * Math.sin(toRad(endDeg))
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
}

export default function HeatIndexGauge({ heatIndex, temperature }: Props) {
  const displayValue = heatIndex ?? temperature
  const severity = getSeverity(heatIndex, temperature)

  // Animate needle from left on first render
  const [angle, setAngle] = useState(-90)
  useEffect(() => {
    const t = setTimeout(() => setAngle(toGaugeAngle(displayValue) - 90), 80)
    return () => clearTimeout(t)
  }, [displayValue])

  // Animated displayed number
  const [shown, setShown] = useState(displayValue)
  useEffect(() => {
    const start = shown
    const end = displayValue
    if (start === end) return
    const steps = 20
    let i = 0
    const id = setInterval(() => {
      i++
      setShown(Math.round(start + (end - start) * (i / steps)))
      if (i >= steps) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayValue])

  return (
    <div className="flex flex-col items-center animate-fade-up">
      <svg viewBox="0 0 260 145" className="w-full max-w-xs">
        {/* Background track */}
        <path
          d={describeArc(130, 130, 100, 0, 180)}
          fill="none" stroke="#1e293b" strokeWidth="20"
        />

        {/* Color zones */}
        {ZONES.map(zone => {
          const s = ((zone.start - MIN) / RANGE) * 180
          const e = ((zone.end   - MIN) / RANGE) * 180
          return (
            <path
              key={zone.label}
              d={describeArc(130, 130, 100, s, e)}
              fill="none" stroke={zone.color} strokeWidth="20" strokeOpacity="0.85"
            />
          )
        })}

        {/* Tick marks */}
        {[15, 27, 32, 41, 54, 60].map(val => {
          const deg = ((val - MIN) / RANGE) * 180
          const rad = ((deg - 180) * Math.PI) / 180
          return (
            <line
              key={val}
              x1={130 + 88  * Math.cos(rad)} y1={130 + 88  * Math.sin(rad)}
              x2={130 + 112 * Math.cos(rad)} y2={130 + 112 * Math.sin(rad)}
              stroke="#94a3b8" strokeWidth="1.5"
            />
          )
        })}

        {/* Tick labels */}
        {[15, 27, 41, 60].map(val => {
          const deg = ((val - MIN) / RANGE) * 180
          const rad = ((deg - 180) * Math.PI) / 180
          const r = 74
          return (
            <text
              key={val}
              x={130 + r * Math.cos(rad)}
              y={130 + r * Math.sin(rad)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="8" fill="#475569"
            >
              {val}
            </text>
          )
        })}

        {/* Animated needle */}
        <g transform={`translate(130,130) rotate(${angle})`} className="gauge-needle">
          <line x1="0" y1="8" x2="0" y2="-82" stroke={severity.color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="0" r="7" fill={severity.color} />
          <circle cx="0" cy="0" r="3" fill="#0f172a" />
        </g>

        {/* Animated number */}
        <text x="130" y="116" textAnchor="middle" fontSize="30" fontWeight="700" fill={severity.color}>
          {shown}°
        </text>
        <text x="130" y="131" textAnchor="middle" fontSize="10" fill="#64748b">
          {heatIndex !== null ? 'Heat Index °C' : 'Temperature °C'}
        </text>
      </svg>
    </div>
  )
}
