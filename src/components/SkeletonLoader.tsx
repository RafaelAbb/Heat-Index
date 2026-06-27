export default function SkeletonLoader() {
  return (
    <div className="w-full max-w-md flex flex-col items-center gap-6 animate-fade-up">

      {/* Gauge skeleton */}
      <div className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center gap-4">
        {/* Semicircle */}
        <div className="skeleton w-64 h-32 rounded-t-full" />
        {/* Value placeholder */}
        <div className="skeleton w-20 h-8 rounded-lg" />
        <div className="skeleton w-32 h-3 rounded" />
      </div>

      {/* Badge skeleton */}
      <div className="skeleton w-56 h-16 rounded-2xl" />

      {/* Weather cards skeleton */}
      <div className="w-full">
        <div className="skeleton w-40 h-4 rounded mx-auto mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[0,1,2,3].map(i => (
            <div key={i} className="skeleton rounded-xl h-24" />
          ))}
        </div>
      </div>

      {/* Hourly chart skeleton */}
      <div className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
        <div className="flex justify-between mb-3">
          <div className="skeleton w-36 h-4 rounded" />
          <div className="skeleton w-24 h-4 rounded" />
        </div>
        <div className="skeleton w-full h-36 rounded-lg" />
      </div>

      {/* Info panel skeleton */}
      <div className="skeleton w-full h-12 rounded-xl" />
    </div>
  )
}
