
import type { ClassInput } from '@/types/schedule'
import { ClassFilter } from '@/components/schedule/ClassFilter'
import { ClassTable } from '@/components/schedule/ClassTable'

interface ClassSectionProps {
  classes: ClassInput[]
  totalClasses: number
  selectedMK: string
  search: string
  onSelectMK: (value: string) => void
  onSearch: (value: string) => void
  onRemove: (item: ClassInput) => void
  onResetFilters: () => void
}

export function ClassSection(props: ClassSectionProps) {
  return (
    <section className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <header className="shrink-0 border-b border-slate-100 px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-950">
              Daftar kandidat kelas
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Pilih kelas yang ingin dipertimbangkan algoritma.
            </p>
          </div>

          <span className="shrink-0 rounded-lg bg-blue-50 px-2 py-1.5 text-[11px] font-semibold text-blue-700">
            {props.totalClasses} kandidat
          </span>
        </div>

        <div className="mt-4 min-w-0">
          <ClassFilter
            selectedMK={props.selectedMK}
            search={props.search}
            onSelectMK={props.onSelectMK}
            onSearch={props.onSearch}
          />
        </div>
      </header>

      {/* Vertical scroll only */}
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <ClassTable
          classes={props.classes}
          onRemove={props.onRemove}
        />
      </div>

      {/* Footer */}
      <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
        <span className="text-[11px] text-slate-500">
          {props.classes.length} dari {props.totalClasses} kelas
        </span>

        <button
          type="button"
          onClick={props.onResetFilters}
          className="shrink-0 text-xs font-semibold text-blue-600 transition hover:text-blue-800"
        >
          Reset filter
        </button>
      </footer>
    </section>
  )
}
