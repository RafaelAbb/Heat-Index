import { useState, useEffect, useCallback } from 'react'
import { fetchWeather, WeatherData, HourlyPoint } from '../lib/weather'
import { reverseGeocode } from '../lib/geocoding'
import { calcHeatIndex } from '../lib/heatIndex'

export interface WeatherState {
  loading: boolean
  error: string | null
  location: string
  lat: number | null
  lon: number | null
  weather: WeatherData | null
  heatIndex: number | null
  hourlyData: HourlyPoint[]
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    loading: true,
    error: null,
    location: '',
    lat: null,
    lon: null,
    weather: null,
    heatIndex: null,
    hourlyData: [],
  })

  const loadWeather = useCallback(async (lat: number, lon: number, locationName?: string) => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const [result, name] = await Promise.all([
        fetchWeather(lat, lon),
        locationName ? Promise.resolve(locationName) : reverseGeocode(lat, lon),
      ])
      const weather = result.current
      const hi = calcHeatIndex(weather.temperature, weather.humidity)
      setState({
        loading: false,
        error: null,
        location: name,
        lat,
        lon,
        weather,
        heatIndex: hi,
        hourlyData: result.hourly,
      })
    } catch (e) {
      setState(s => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load weather',
      }))
    }
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      loadWeather(32.0853, 34.7818, 'Tel Aviv, Israel')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => loadWeather(pos.coords.latitude, pos.coords.longitude),
      () => loadWeather(32.0853, 34.7818, 'Tel Aviv, Israel'),
      { timeout: 8000 }
    )
  }, [loadWeather])

  return { ...state, loadWeather }
}
