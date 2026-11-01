
'use client'

import { useState } from 'react'
import type { ScheduleResponse, SearchStep } from '@/types/schedule'
import { Timetable } from '../result/Timetable'

interface ScheduleResultsProps {
  result: ScheduleResponse | null
  isGenerating: boolean
  error: string
}

interface SearchStepItemProps {
  step: SearchStep
}

function SearchStepItem({ step }: SearchStepItemProps) {
  const isBacktrack =
    step.keterangan.toLowerCase().includes('mundur') ||
    step.keterangan.toLowerCase().includes('batal') ||
    step.keterangan.toLowerCase().includes('gagal')

  const isSolution = step.keterangan.includes('SOLUSI DITEMUKAN')
  const isConflict = step.keterangan.toLowerCase().includes('bentrok')

  const status = isSolution
    ? 'solution'
    : isBacktrack || isConflict
      ? 'backtrack'
      : 'normal'

  const styles = {
    solution: {
      dot: 'bg-emerald-500',
      text: 'text-emerald-700',
      label: 'Solusi',
    },
    backtrack: {
      dot: 'bg-amber-500',
      text: 'text-amber-700',
      label: 'Mundur',
    },
    normal: {
      dot: 'bg-blue-500',
      text: 'text-slate-500',
      label: 'Pencarian',
    },
  }[status]

  return (
    <div className="relative flex gap-2">
      <div className="flex w-4 shrink-0 flex-col items-center">
        <span className={`mt-2 size-2 rounded-full ${styles.dot}`} />
        <span className="mt-1 w-px flex-1 bg-slate-200" />
      </div>

      <div className="mb-2 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold tabular-nums text-slate-400">
            LANGKAH {String(step.nomor).padStart(2, '0')}
          </span>

          <span className="text-[10px] font-medium text-slate-400">
            {styles.label}
          </span>
        </div>

        {step.assignment && (
          <p className="mt-1 break-words text-xs font-semibold text-slate-800">
            {step.assignment}
          </p>
        )}

        <p className={`mt-0.5 break-words text-xs leading-relaxed ${styles.text}`}>
          {step.keterangan}
        </p>
      </div>
    </div>
  )
}

export function ScheduleResults({
  result,
  isGenerating,
  error,
}: ScheduleResultsProps) {
  const [activeSolution, setActiveSolution] = useState(0)
  const [showAllSteps, setShowAllSteps] = useState(false)

  if (isGenerating) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

        <h2 className="mt-4 font-semibold text-slate-900">
          Sedang menyusun jadwal
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Algoritma CSP sedang mencari kombinasi kelas yang valid.
        </p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <h2 className="font-semibold text-red-800">
          Gagal membuat jadwal
        </h2>

        <p className="mt-1 text-sm text-red-700">{error}</p>
      </section>
    )
  }

  if (!result) return null

  const solutions = Array.isArray(result.solusi) ? result.solusi : []
  const steps = Array.isArray(result.langkah) ? result.langkah : []

  const hasSolution =
    result.jumlah_solusi > 0 && solutions.length > 0

  const solution = solutions[activeSolution] ?? solutions[0]

  const visibleSteps = showAllSteps ? steps : steps.slice(0, 20)

  const statistics = [
    {
      label: 'Total solusi',
      value: result.jumlah_solusi,
    },
    {
      label: 'Node dikunjungi',
      value: result.statistik.node,
    },
    {
      label: 'Backtrack',
      value: result.statistik.backtrack,
    },
    {
      label: 'Waktu eksekusi',
      value: `${Number(result.statistik.waktu).toFixed(4)} s`,
    },
  ]

  return (
    <section id="schedule-results" className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
            Hasil penjadwalan
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ringkasan pencarian dan visualisasi jadwal.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            hasSolution
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {hasSolution ? 'Solusi ditemukan' : 'Tidak ada solusi'}
        </span>
      </div>

      {/* Statistics & Timetable */}
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(300px,1fr)_minmax(0,2fr)] lg:items-stretch">
        {/* Statistics */}
        <aside className="flex min-w-0 flex-col gap-2 lg:h-full">
          <div className="flex flex-1 flex-col gap-2">
            {statistics.map((stat) => (
              <article
                key={stat.label}
                className="flex flex-1 flex-col justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <p className="text-[11px] font-medium text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-1 text-xl font-bold tabular-nums text-slate-950">
                  {stat.value}
                </p>
              </article>
            ))}
          </div>
        </aside>

        {/* Timetable */}
        {hasSolution ? (
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Jadwal kuliah
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Solusi {activeSolution + 1} dari {solutions.length} solusi tersimpan.
                </p>
              </div>

              {solutions.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={activeSolution === 0}
                    onClick={() =>
                      setActiveSolution((value) => Math.max(0, value - 1))
                    }
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Solusi sebelumnya"
                  >
                    ←
                  </button>

                  <span className="text-xs font-semibold tabular-nums text-slate-600">
                    {activeSolution + 1} / {solutions.length}
                  </span>

                  <button
                    type="button"
                    disabled={activeSolution >= solutions.length - 1}
                    onClick={() =>
                      setActiveSolution((value) =>
                        Math.min(solutions.length - 1, value + 1),
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Solusi berikutnya"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            <div className="min-w-0 p-2 sm:p-3">
              <Timetable solution={solution} />
            </div>
          </section>
        ) : (
          <section className="min-w-0 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-semibold text-amber-900">
              Tidak ditemukan kombinasi jadwal valid.
            </h3>

            <p className="mt-1 text-sm text-amber-800">
              Coba kurangi constraint atau pulihkan beberapa kandidat kelas.
            </p>

            {result.domain_kosong.length > 0 && (
              <p className="mt-3 text-sm text-amber-900">
                Domain kosong: {result.domain_kosong.join(', ')}
              </p>
            )}
          </section>
        )}
      </div>

      {/* Search Process & Eliminated Classes */}
      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* Search Process */}
        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Langkah pencarian
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Proses algoritma Backtracking.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
              {result.algoritma}
            </span>
          </div>

          {steps.length > 0 ? (
            <>
              <div className="bg-slate-50 px-3 py-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-wide text-slate-500">
                    RIWAYAT PROSES CSP
                  </span>

                  <span className="text-[10px] text-slate-400">
                    {steps.length} langkah
                  </span>
                </div>

                <div className="max-h-[320px] space-y-0 overflow-y-auto overflow-x-hidden pr-1">
                  {visibleSteps.map((step) => (
                    <SearchStepItem key={step.nomor} step={step} />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-3 py-2">
                <p className="text-[10px] text-slate-500">
                  {result.langkah_dibatasi
                    ? 'Log dibatasi maksimal 100 langkah.'
                    : `${visibleSteps.length} dari ${steps.length} langkah.`}
                </p>

                {steps.length > 20 && (
                  <button
                    type="button"
                    onClick={() => setShowAllSteps((value) => !value)}
                    className="text-[10px] font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    {showAllSteps ? 'Lebih sedikit' : 'Lihat semua'}
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="px-4 py-8 text-center text-xs text-slate-500">
              Belum ada langkah pencarian.
            </p>
          )}
        </section>

        {/* Eliminated Classes */}
        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-bold text-slate-900">
              Kelas dieliminasi
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Kandidat yang dihapus berdasarkan constraint.
            </p>
          </div>

          {result.kelas_dihapus.length > 0 ? (
            <div className="max-h-[320px] space-y-2 overflow-y-auto bg-slate-50 p-3">
              {result.kelas_dihapus.map((item, index) => (
                <div
                  key={`${item.nama}-${index}`}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <p className="text-xs font-bold text-slate-800">
                    {item.nama}
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                    {item.alasan}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-32 items-center justify-center bg-slate-50 px-4 py-6 text-center">
              <p className="text-xs text-slate-500">
                Tidak ada kelas yang dieliminasi oleh constraint.
              </p>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}
