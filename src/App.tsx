import { useCallback } from 'react'
import { useWeather } from './hooks/useWeather'
import { getSeverity } from './lib/heatIndex'
import HeatIndexGauge from './components/HeatIndexGauge'
import SeverityBadge from './components/SeverityBadge'
import WeatherCard from './components/WeatherCard'
import LocationSearch from './components/LocationSearch'
import InfoPanel from './components/InfoPanel'

export default function App() {
  const { loading, error, location, weather, heatIndex, loadWeather } = useWeather()

  const redetect = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => loadWeather(pos.coords.latitude, pos.coords.longitude),
      () => loadWeather(32.0853, 34.7818, 'Tel Aviv, Israel'),
      { timeout: 8000 }
    )
  }, [loadWeather])

  const severity = weather ? getSeverity(heatIndex, weather.temperature) : null

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>

      {/* Header */}
      <div className="w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl">🌡️</span>
          <h1 className="text-3xl font-bold text-white tracking-tight">Heat Index</h1>
        </div>
        <p className="text-slate-400 text-sm">Real-time heat stress calculator</p>
      </div>

      {/* Location search */}
      <div className="w-full max-w-md mb-6 flex justify-center">
        <LocationSearch
          currentLocation={location}
          onSelect={(lat, lon, name) => loadWeather(lat, lon, name)}
          onDetect={redetect}
        />
      </div>

      {/* Location label */}
      {location && (
        <p className="text-slate-300 text-sm mb-6 font-medium">
          📍 {location}
        </p>
      )}

      {/* Main content */}
      {loading && (
        <div className="flex flex-col items-center gap-4 mt-12">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin" />
          <p className="text-slate-400 text-sm">Fetching weather data…</p>
        </div>
      )}

      {error && !loading && (
        <div className="w-full max-w-md bg-red-900/20 border border-red-700/40 rounded-xl px-4 py-3 text-red-300 text-sm text-center">
          ⚠️ {error}
        </div>
      )}

      {weather && !loading && (
        <div className="w-full max-w-md flex flex-col items-center gap-6">

          {/* Gauge */}
          <div className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <HeatIndexGauge heatIndex={heatIndex} temperature={weather.temperature} />
            {heatIndex === null && (
              <p className="text-center text-xs text-slate-500 mt-2">
                Heat index not applicable (temp &lt; 27°C or humidity &lt; 40%)
              </p>
            )}
          </div>

          {/* Severity badge */}
          {severity && (
            <div className="w-full flex justify-center">
              <SeverityBadge severity={severity} />
            </div>
          )}

          {/* Weather stats */}
          <WeatherCard weather={weather} />

          {/* Info panel */}
          <InfoPanel />

          {/* Last updated */}
          <p className="text-xs text-slate-600">
            Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-12 pb-4 text-center text-xs text-slate-600">
        <p>Made with ❤️ by <span className="text-slate-400 font-medium">Ofek</span></p>
        <p className="mt-1">Thank you for using Heat Index App</p>
      </footer>
    </div>
  )
}
