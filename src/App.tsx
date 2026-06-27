import { useCallback } from 'react'
import { useWeather } from './hooks/useWeather'
import { getSeverity } from './lib/heatIndex'
import HeatIndexGauge from './components/HeatIndexGauge'
import SeverityBadge from './components/SeverityBadge'
import WeatherCard from './components/WeatherCard'
import HourlyHeatChart from './components/HourlyHeatChart'
import LocationSearch from './components/LocationSearch'
import InfoPanel from './components/InfoPanel'
import SkeletonLoader from './components/SkeletonLoader'

export default function App() {
  const { loading, error, location, weather, heatIndex, hourlyData, loadWeather } = useWeather()

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
    <div
      className="page-fade min-h-screen flex flex-col items-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}
    >
      {/* Header */}
      <div className="animate-fade-up w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl">🌡️</span>
          <h1 className="text-3xl font-bold text-white tracking-tight">Heat Index</h1>
        </div>
        <p className="text-slate-400 text-sm">Real-time heat stress calculator</p>
      </div>

      {/* Location search */}
      <div className="animate-fade-up w-full max-w-md mb-4 flex justify-center" style={{ animationDelay: '0.08s' }}>
        <LocationSearch
          currentLocation={location}
          onSelect={(lat, lon, name) => loadWeather(lat, lon, name)}
          onDetect={redetect}
        />
      </div>

      {/* Location label */}
      {location && (
        <p className="animate-fade-up text-slate-300 text-sm mb-6 font-medium" style={{ animationDelay: '0.14s' }}>
          📍 {location}
        </p>
      )}

      {/* Skeleton while loading */}
      {loading && <SkeletonLoader />}

      {/* Error state */}
      {error && !loading && (
        <div className="animate-fade-up w-full max-w-md bg-red-900/20 border border-red-700/40 rounded-xl px-4 py-3 text-red-300 text-sm text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Main content */}
      {weather && !loading && (
        <div className="w-full max-w-md flex flex-col items-center gap-6">

          {/* Gauge */}
          <div className="animate-fade-up w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6" style={{ animationDelay: '0.05s' }}>
            <HeatIndexGauge heatIndex={heatIndex} temperature={weather.temperature} />
            {heatIndex === null && (
              <p className="text-center text-xs text-slate-500 mt-2">
                Heat index not applicable — temp &lt; 27°C or humidity &lt; 40%
              </p>
            )}
          </div>

          {/* Severity badge */}
          {severity && (
            <div className="w-full flex justify-center" style={{ animationDelay: '0.12s' }}>
              <SeverityBadge severity={severity} />
            </div>
          )}

          {/* Weather stats */}
          <div className="animate-fade-up w-full" style={{ animationDelay: '0.18s' }}>
            <WeatherCard weather={weather} />
          </div>

          {/* Hourly heat index chart */}
          {hourlyData.length > 0 && (
            <div className="animate-fade-up w-full" style={{ animationDelay: '0.24s' }}>
              <HourlyHeatChart data={hourlyData} />
            </div>
          )}

          {/* Info panel */}
          <div className="animate-fade-up w-full flex justify-center" style={{ animationDelay: '0.30s' }}>
            <InfoPanel />
          </div>

          {/* Last updated */}
          <p className="animate-fade-up text-xs text-slate-600" style={{ animationDelay: '0.3s' }}>
            Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="animate-fade-up mt-auto pt-12 pb-4 text-center text-xs text-slate-600">
        <p>Made with ❤️ by <span className="text-slate-400 font-medium">Ofek</span></p>
        <p className="mt-1">Thank you for using Heat Index App</p>
      </footer>
    </div>
  )
}
