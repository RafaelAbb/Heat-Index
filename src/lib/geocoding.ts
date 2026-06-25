export interface GeoResult {
  name: string
  country: string
  admin1?: string
  lat: number
  lon: number
}

export async function searchCity(query: string): Promise<GeoResult[]> {
  if (!query.trim()) return []
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  if (!data.results) return []
  return data.results.map((r: Record<string, unknown>) => ({
    name: r.name as string,
    country: r.country as string,
    admin1: r.admin1 as string | undefined,
    lat: r.latitude as number,
    lon: r.longitude as number,
  }))
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
    if (!res.ok) return `${lat.toFixed(2)}, ${lon.toFixed(2)}`
    const data = await res.json()
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      ''
    const country = data.address?.country || ''
    return city ? `${city}, ${country}` : country || `${lat.toFixed(2)}, ${lon.toFixed(2)}`
  } catch {
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`
  }
}
