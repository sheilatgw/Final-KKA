
'use client'

import type { ClassInput } from '@/types/schedule'
import { INITIAL_MATA_KULIAH } from '@/constants/schedule'

interface ScheduleSidebarProps {
  classes: ClassInput[]
  subjectCount: number
  removedCount: number
  onRestore: () => void
  onGenerate: () => void | Promise<void>
  isGenerating: boolean
  canGenerate: boolean
}

export function ScheduleSidebar({
  classes,
  subjectCount,
  removedCount,
  onRestore,
  onGenerate,
  isGenerating,
  canGenerate,
}: ScheduleSidebarProps) {
  const subjectsWithoutClasses = INITIAL_MATA_KULIAH.filter(
    (mk) => !classes.some((item) => item.mk === mk),
  )

  const progress =
    (subjectCount / INITIAL_MATA_KULIAH.length) * 100

  return (
    <aside className="flex w-full flex-col gap-4">

      {/* Ringkasan kandidat */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900">
            Ringkasan kandidat
          </h2>

          <span className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
            Live
          </span>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-bold tracking-tight text-slate-950">
            {subjectCount}
            <span className="text-base font-medium text-slate-400">
              /{INITIAL_MATA_KULIAH.length}
            </span>
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Mata kuliah memiliki kandidat
          </p>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {subjectsWithoutClasses.length > 0 && (
          <p className="mt-3 rounded-lg bg-amber-50 p-2.5 text-xs leading-5 text-amber-700">
            Belum ada kandidat untuk: {subjectsWithoutClasses.join(', ')}.
          </p>
        )}
      </section>

      {/* Pengelolaan kelas */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">
          Pengelolaan kelas
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Hapus kelas yang tidak ingin digunakan.
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-600">
            Kelas dihapus
          </span>

          <span className="text-sm font-semibold text-slate-900">
            {removedCount}
          </span>
        </div>

        <button
          type="button"
          onClick={onRestore}
          disabled={removedCount === 0}
          className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Pulihkan semua kelas
        </button>
      </section>

      {/* Generate jadwal */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
        <h3 className="text-sm font-bold text-slate-900">
          Siap menyusun jadwal?
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          Jalankan algoritma CSP untuk menemukan kombinasi jadwal tanpa bentrok.
        </p>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isGenerating ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Menyusun jadwal...
            </>
          ) : (
            <>
              Buat jadwal
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>

        {!canGenerate && (
          <p className="mt-2 text-center text-[11px] leading-4 text-amber-700">
            Setiap mata kuliah harus memiliki minimal satu kandidat.
          </p>
        )}
      </section>
    </aside>
  )
}
