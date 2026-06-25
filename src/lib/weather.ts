export interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  precipitation: number
  feelsLike: number
  weatherCode: number
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code` +
    `&wind_speed_unit=kmh`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')
  const data = await res.json()
  const c = data.current
  return {
    temperature: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    windSpeed: c.wind_speed_10m,
    precipitation: c.precipitation,
    feelsLike: c.apparent_temperature,
    weatherCode: c.weather_code,
  }
}

export function weatherDescription(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 9) return 'Foggy'
  if (code <= 19) return 'Drizzle'
  if (code <= 29) return 'Rain'
  if (code <= 39) return 'Snow'
  if (code <= 49) return 'Freezing drizzle'
  if (code <= 59) return 'Light drizzle'
  if (code <= 69) return 'Rain'
  if (code <= 79) return 'Snow'
  if (code <= 84) return 'Rain showers'
  if (code <= 94) return 'Thunderstorm'
  return 'Heavy thunderstorm'
}

export function weatherIcon(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '⛅'
  if (code <= 3) return '☁️'
  if (code <= 9) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}
