import { WeatherData, weatherDescription, weatherIcon } from '../lib/weather'

interface Props {
  weather: WeatherData
}

function Stat({ icon, label, value, delay }: { icon: string; label: string; value: string; delay: string }) {
  return (
    <div
      className="stat-card animate-fade-up flex flex-col items-center gap-1 bg-slate-800/60 rounded-xl p-4 border border-slate-700/50"
      style={{ animationDelay: delay }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-base font-semibold text-slate-100 count-in">{value}</span>
    </div>
  )
}

export default function WeatherCard({ weather }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-4 text-slate-400 text-sm animate-fade-up">
        <span className="text-xl">{weatherIcon(weather.weatherCode)}</span>
        <span>{weatherDescription(weather.weatherCode)}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat icon="🌡️" label="Temperature" value={`${weather.temperature}°C`} delay="0.05s" />
        <Stat icon="💧" label="Humidity"    value={`${weather.humidity}%`}       delay="0.12s" />
        <Stat icon="🌬️" label="Wind"        value={`${weather.windSpeed} km/h`}  delay="0.19s" />
        <Stat icon="🌧️" label="Precipitation" value={`${weather.precipitation} mm`} delay="0.26s" />
      </div>
    </div>
  )
}
