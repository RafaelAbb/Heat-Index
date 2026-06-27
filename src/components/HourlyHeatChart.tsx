import { HourlyPoint } from '../lib/weather'
import { getSeverity } from '../lib/heatIndex'

interface Props {
  data: HourlyPoint[]
}

const CHART_X0 = 20
const CHART_X1 = 540
const CHART_Y1 = 120
const CHART_H  = 110
const BAR_W    = 14
const SLOT_W   = (CHART_X1 - CHART_X0) / 24
const VAL_MIN  = 15
const VAL_MAX  = 60
const VAL_RANGE = VAL_MAX - VAL_MIN

function barX(i: number) {
  return CHART_X0 + i * SLOT_W + (SLOT_W - BAR_W) / 2
}

function barHeight(val: number) {
  const clamped = Math.max(VAL_MIN, Math.min(VAL_MAX, val))
  return ((clamped - VAL_MIN) / VAL_RANGE) * CHART_H
}

export default function HourlyHeatChart({ data }: Props) {
  const currentHour = new Date().getHours()

  return (
    <div className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-300">Today's Heat Index</h3>
        <span className="text-xs text-slate-500">Hourly forecast</span>
      </div>

      <svg viewBox="0 0 560 165" className="w-full">
        {data.map((point, i) => {
          const displayVal = point.heatIndex ?? point.temperature
          const severity   = getSeverity(point.heatIndex, point.temperature)
          const bh         = barHeight(displayVal)
          const bx         = barX(i)
          const by         = CHART_Y1 - bh
          const isCurrent  = point.hour === currentHour
          const color      = severity.color
          const opacity    = isCurrent ? 1.0 : point.heatIndex !== null ? 0.55 : 0.3

          return (
            <g key={i}>
              <rect
                x={bx} y={by} width={BAR_W} height={bh}
                rx={3} ry={3}
                fill={color}
                fillOpacity={opacity}
                stroke={isCurrent ? color : 'none'}
                strokeWidth={isCurrent ? 1.5 : 0}
              />

              {isCurrent && (
                <rect
                  x={bx - 1} y={by - 2} width={BAR_W + 2} height={4}
                  rx={2}
                  fill={color}
                  fillOpacity={0.9}
                />
              )}

              {point.hour % 3 === 0 && (
                <text
                  x={bx + BAR_W / 2} y={136}
                  textAnchor="middle" fontSize="8" fill="#475569"
                >
                  {point.hour}h
                </text>
              )}

              {isCurrent && (
                <>
                  <text
                    x={bx + BAR_W / 2} y={by - 6}
                    textAnchor="middle" fontSize="9" fontWeight="700"
                    fill={color}
                  >
                    {Math.round(displayVal)}°
                  </text>
                  <text
                    x={bx + BAR_W / 2} y={152}
                    textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="600"
                  >
                    NOW
                  </text>
                </>
              )}
            </g>
          )
        })}

        <line x1={CHART_X0} y1={CHART_Y1} x2={CHART_X1} y2={CHART_Y1} stroke="#1e293b" strokeWidth="1" />
      </svg>

      <p className="text-xs text-slate-600 mt-1 text-center">
        Dimmed bars = temperature only (heat index N/A)
      </p>
    </div>
  )
}
