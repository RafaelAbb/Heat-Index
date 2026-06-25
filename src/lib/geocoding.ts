export interface GeoResult {
  name: string
  country: string
  admin1?: string
  lat: number
  lon: number
}

const isHebrew = (s: string) => /[֐-׿]/.test(s)

/** Search via Nominatim — handles Hebrew queries well */
async function searchNominatim(query: string): Promise<GeoResult[]> {
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`
  const res = await fetch(url, { headers: { 'Accept-Language': 'he,en' } })
  if (!res.ok) return []
  const data: Record<string, unknown>[] = await res.json()
  return data
    .filter(r => r.lat && r.lon)
    .map(r => {
      const addr = (r.address as Record<string, string>) || {}
      const name =
        addr.city || addr.town || addr.village || addr.county ||
        (r.display_name as string).split(',')[0]
      const country = addr.country || ''
      const admin1 = addr.state || addr.region || undefined
      return { name, country, admin1, lat: parseFloat(r.lat as string), lon: parseFloat(r.lon as string) }
    })
}

/** Search via Open-Meteo geocoding — fast, English/Latin queries */
async function searchOpenMeteo(query: string): Promise<GeoResult[]> {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
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

export async function searchCity(query: string): Promise<GeoResult[]> {
  if (!query.trim()) return []
  return isHebrew(query) ? searchNominatim(query) : searchOpenMeteo(query)
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
