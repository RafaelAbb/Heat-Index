export interface Severity {
  label: string
  description: string
  color: string
  bg: string
  textColor: string
  risk: string
}

function toF(c: number) { return c * 9/5 + 32 }
function toC(f: number) { return (f - 32) * 5/9 }

export function calcHeatIndex(tempC: number, humidity: number): number | null {
  if (tempC < 27 || humidity < 40) return null
  const T = toF(tempC)
  const RH = humidity
  const HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * RH -
    0.22475541 * T * RH -
    0.00683783 * T * T -
    0.05481717 * RH * RH +
    0.00122874 * T * T * RH +
    0.00085282 * T * RH * RH -
    0.00000199 * T * T * RH * RH
  return Math.round(toC(HI))
}

export function getSeverity(hiC: number | null, tempC: number): Severity {
  const value = hiC ?? tempC
  if (value < 27) {
    return {
      label: 'Comfortable',
      description: 'No heat stress',
      color: '#4ade80',
      bg: 'rgba(74,222,128,0.15)',
      textColor: '#166534',
      risk: 'None',
    }
  }
  if (value < 32) {
    return {
      label: 'Caution',
      description: 'Fatigue possible with prolonged exposure',
      color: '#facc15',
      bg: 'rgba(250,204,21,0.15)',
      textColor: '#713f12',
      risk: 'Low',
    }
  }
  if (value < 41) {
    return {
      label: 'Extreme Caution',
      description: 'Heat cramps or heat exhaustion possible',
      color: '#fb923c',
      bg: 'rgba(251,146,60,0.15)',
      textColor: '#7c2d12',
      risk: 'Moderate',
    }
  }
  if (value < 54) {
    return {
      label: 'Danger',
      description: 'Heat cramps/exhaustion likely; heatstroke possible',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.15)',
      textColor: '#7f1d1d',
      risk: 'High',
    }
  }
  return {
    label: 'Extreme Danger',
    description: 'Heatstroke highly likely with continued exposure',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.15)',
    textColor: '#3b0764',
    risk: 'Extreme',
  }
}

/** Maps a heat index °C value to a 0–180 gauge angle */
export function toGaugeAngle(hiC: number): number {
  const min = 15
  const max = 60
  const clamped = Math.max(min, Math.min(max, hiC))
  return ((clamped - min) / (max - min)) * 180
}
