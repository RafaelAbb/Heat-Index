import { Severity } from '../lib/heatIndex'

interface Props {
  severity: Severity
}

export default function SeverityBadge({ severity }: Props) {
  return (
    <div
      className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-2xl border"
      style={{
        background: severity.bg,
        borderColor: severity.color + '40',
      }}
    >
      <span className="text-lg font-bold" style={{ color: severity.color }}>
        {severity.label}
      </span>
      <span className="text-sm text-slate-400">{severity.description}</span>
      <span className="text-xs font-medium px-2 py-0.5 rounded-full mt-1"
        style={{ background: severity.color + '30', color: severity.color }}>
        Risk: {severity.risk}
      </span>
    </div>
  )
}
