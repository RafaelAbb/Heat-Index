import { useState, useEffect, useRef } from 'react'
import { searchCity, GeoResult } from '../lib/geocoding'

interface Props {
  currentLocation: string
  onSelect: (lat: number, lon: number, name: string) => void
  onDetect: () => void
}

export default function LocationSearch({ currentLocation, onSelect, onDetect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      const r = await searchCity(query)
      setResults(r)
      setOpen(true)
      setLoading(false)
    }, 400)
  }, [query])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function pick(r: GeoResult) {
    const name = r.admin1 ? `${r.name}, ${r.admin1}, ${r.country}` : `${r.name}, ${r.country}`
    onSelect(r.lat, r.lon, name)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📍</span>
          <input
            type="text"
            placeholder={currentLocation || 'Search city…'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin text-xs">⟳</span>
          )}
        </div>
        <button
          onClick={onDetect}
          title="Use my location"
          className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 transition-colors text-lg"
        >
          🎯
        </button>
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-xl">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => pick(r)}
              className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-0"
            >
              <span className="text-sm font-medium text-slate-100">{r.name}</span>
              {r.admin1 && <span className="text-xs text-slate-400 ml-2">{r.admin1}</span>}
              <span className="text-xs text-slate-500 ml-2">{r.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
