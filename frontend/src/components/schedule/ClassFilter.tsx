import { INITIAL_MATA_KULIAH } from '@/constants/schedule'

interface ClassFilterProps {
  selectedMK: string
  search: string
  onSelectMK: (value: string) => void
  onSearch: (value: string) => void
}

export function ClassFilter({
  selectedMK,
  search,
  onSelectMK,
  onSearch,
}: ClassFilterProps) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[190px_minmax(0,1fr)]">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-600">
          Mata kuliah
        </span>
        <select
          value={selectedMK}
          onChange={(event) => onSelectMK(event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="Semua">Semua mata kuliah</option>
          {INITIAL_MATA_KULIAH.map((mk) => (
            <option key={mk} value={mk}>{mk}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-600">
          Pencarian
        </span>
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Cari mata kuliah, kelas, dosen, atau hari..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </label>
    </div>
  )
}
