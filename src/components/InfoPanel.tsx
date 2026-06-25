import { useState } from 'react'

const ZONES = [
  { range: '< 27°C', label: 'Comfortable', color: '#4ade80', tip: 'Safe for all outdoor activities.' },
  { range: '27–32°C', label: 'Caution', color: '#facc15', tip: 'Stay hydrated. Fatigue possible with prolonged exposure.' },
  { range: '32–41°C', label: 'Extreme Caution', color: '#fb923c', tip: 'Avoid prolonged sun exposure. Heat cramps or exhaustion possible.' },
  { range: '41–54°C', label: 'Danger', color: '#ef4444', tip: 'Limit outdoor activity. Heatstroke is possible.' },
  { range: '> 54°C', label: 'Extreme Danger', color: '#a855f7', tip: 'Stay indoors. Heatstroke is highly likely.' },
]

export default function InfoPanel() {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full max-w-md">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-slate-300 hover:border-slate-500 transition-colors"
      >
        <span className="font-medium">ℹ️ What is Heat Index?</span>
        <span className="text-slate-500">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-2 px-4 py-4 bg-slate-800/40 border border-slate-700/30 rounded-xl text-sm text-slate-400 space-y-4">
          <p>
            The <strong className="text-slate-200">Heat Index</strong> (also called "feels like" temperature) combines
            air temperature and relative humidity to describe how hot it actually feels to the human body.
            It is calculated using the <strong className="text-slate-200">NOAA Rothfusz regression</strong> and
            is only valid when temperature ≥ 27°C and humidity ≥ 40%.
          </p>

          <div className="space-y-2">
            {ZONES.map(z => (
              <div key={z.label} className="flex gap-3 items-start">
                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: z.color }} />
                <div>
                  <span className="font-semibold" style={{ color: z.color }}>{z.label}</span>
                  <span className="text-slate-500 ml-2 text-xs">{z.range}</span>
                  <p className="text-xs text-slate-500 mt-0.5">{z.tip}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            Source: NOAA National Weather Service · Data via{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer"
               className="underline hover:text-slate-300">Open-Meteo</a>
          </p>
        </div>
      )}
    </div>
  )
}
