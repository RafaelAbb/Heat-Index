import { toGaugeAngle, getSeverity } from '../lib/heatIndex'

interface Props {
  heatIndex: number | null
  temperature: number
}

const ZONES = [
  { label: 'Comfortable', color: '#4ade80', start: 0, end: 27 },
  { label: 'Caution', color: '#facc15', start: 27, end: 32 },
  { label: 'Extreme Caution', color: '#fb923c', start: 32, end: 41 },
  { label: 'Danger', color: '#ef4444', start: 41, end: 54 },
  { label: 'Extreme Danger', color: '#a855f7', start: 54, end: 60 },
]

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const toRad = (d: number) => ((d - 180) * Math.PI) / 180
  const x1 = cx + r * Math.cos(toRad(startAngle))
  const y1 = cy + r * Math.sin(toRad(startAngle))
  const x2 = cx + r * Math.cos(toRad(endAngle))
  const y2 = cy + r * Math.sin(toRad(endAngle))
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
}

export default function HeatIndexGauge({ heatIndex, temperature }: Props) {
  const displayValue = heatIndex ?? temperature
  const severity = getSeverity(heatIndex, temperature)
  const needleAngle = toGaugeAngle(displayValue) - 90

  const MIN = 15
  const MAX = 60
  const RANGE = MAX - MIN

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 260 145" className="w-full max-w-xs">
        {/* Background track */}
        <path
          d={describeArc(130, 130, 100, 0, 180)}
          fill="none"
          stroke="#1e293b"
          strokeWidth="20"
        />

        {/* Color zones */}
        {ZONES.map(zone => {
          const startDeg = ((zone.start - MIN) / RANGE) * 180
          const endDeg = ((zone.end - MIN) / RANGE) * 180
          return (
            <path
              key={zone.label}
              d={describeArc(130, 130, 100, startDeg, endDeg)}
              fill="none"
              stroke={zone.color}
              strokeWidth="20"
              strokeOpacity="0.85"
            />
          )
        })}

        {/* Tick marks */}
        {[15, 27, 32, 41, 54, 60].map(val => {
          const angle = ((val - MIN) / RANGE) * 180
          const rad = ((angle - 180) * Math.PI) / 180
          const r1 = 88
          const r2 = 112
          return (
            <line
              key={val}
              x1={130 + r1 * Math.cos(rad)}
              y1={130 + r1 * Math.sin(rad)}
              x2={130 + r2 * Math.cos(rad)}
              y2={130 + r2 * Math.sin(rad)}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
          )
        })}

        {/* Needle */}
        <g transform={`translate(130,130) rotate(${needleAngle})`} className="gauge-needle">
          <line x1="0" y1="0" x2="0" y2="-85" stroke={severity.color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="0" r="6" fill={severity.color} />
        </g>

        {/* Center value */}
        <text x="130" y="118" textAnchor="middle" fontSize="32" fontWeight="700" fill={severity.color}>
          {displayValue}°
        </text>
        <text x="130" y="134" textAnchor="middle" fontSize="11" fill="#64748b">
          {heatIndex !== null ? 'Heat Index °C' : 'Temperature °C'}
        </text>
      </svg>
    </div>
  )
}
