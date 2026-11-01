
'use client'

import { useMemo } from 'react'
import {
  INITIAL_HARI,
  INITIAL_MATA_KULIAH,
  INITIAL_SESI,
} from '@/constants/schedule'
import type {
  Algorithm,
  ClassInput,
  ConstraintInput,
} from '@/types/schedule'

interface ScheduleSettingsProps {
  classes: ClassInput[]
  algorithm: Algorithm
  searchAll: boolean
  constraints: ConstraintInput
  onAlgorithmChange: (value: Algorithm) => void
  onSearchAllChange: (value: boolean) => void
  onConstraintsChange: (value: ConstraintInput) => void
}

const algorithms: {
  value: Algorithm
  title: string
  description: string
}[] = [
  {
    value: 'polos',
    title: 'Backtracking',
    description: 'Pencarian dasar tanpa optimasi tambahan.',
  },
  {
    value: 'fc',
    title: 'Forward Checking',
    description: 'Memeriksa domain setelah assignment.',
  },
  {
    value: 'mrv',
    title: 'MRV',
    description: 'Memilih variabel dengan domain paling kecil.',
  },
  {
    value: 'lengkap',
    title: 'Kombinasi lengkap',
    description: 'Forward Checking, MRV, dan LCV.',
  },
]

export function ScheduleSettings({
  classes,
  algorithm,
  searchAll,
  constraints,
  onAlgorithmChange,
  onSearchAllChange,
  onConstraintsChange,
}: ScheduleSettingsProps) {
  const lecturersBySubject = useMemo(() => {
    return Object.fromEntries(
      INITIAL_MATA_KULIAH.map((mk) => [
        mk,
        [
          ...new Set(
            classes
              .filter((item) => item.mk === mk)
              .map((item) => item.dosen),
          ),
        ],
      ]),
    ) as Record<string, string[]>
  }, [classes])

  const toggle = <T,>(items: T[], value: T): T[] =>
    items.includes(value)
      ? items.filter((item) => item !== value)
      : [...items, value]

  return (
    <section className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <header className="shrink-0 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
              Konfigurasi
            </p>

            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
              Pengaturan pencarian
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Atur algoritma dan constraint sebelum membuat jadwal.
            </p>
          </div>

          <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700">
            {classes.length} kandidat
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-5">
          <section>
            <h3 className="text-sm font-bold text-slate-800">
              Algoritma CSP
            </h3>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {algorithms.map((item) => {
                const active = algorithm === item.value

                return (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => onAlgorithmChange(item.value)}
                    className={`flex min-h-[88px] min-w-0 flex-col rounded-xl border p-3 text-left transition ${
                      active
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-100'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold leading-5 text-slate-900">
                        {item.title}
                      </span>

                      <span
                        className={`mt-0.5 size-3.5 shrink-0 rounded-full border ${
                          active
                            ? 'border-[4px] border-blue-600 bg-white'
                            : 'border-slate-300'
                        }`}
                      />
                    </span>

                    <span className="mt-1 text-[11px] leading-4 text-slate-500">
                      {item.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-800">
              Mode pencarian
            </h3>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSearchAllChange(false)}
                className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                  !searchAll
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Satu solusi
              </button>

              <button
                type="button"
                onClick={() => onSearchAllChange(true)}
                className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                  searchAll
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Semua solusi
              </button>
            </div>

            {searchAll && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-4 text-amber-700">
                Pencarian semua solusi dapat membutuhkan waktu lebih lama.
              </p>
            )}
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-800">
                Hari dihindari
              </h3>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {INITIAL_HARI.map((day) => {
                  const active = constraints.tanpa_hari.includes(day)

                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() =>
                        onConstraintsChange({
                          ...constraints,
                          tanpa_hari: toggle(
                            constraints.tanpa_hari,
                            day,
                          ),
                        })
                      }
                      className={`rounded-lg border px-2 py-1.5 text-[11px] font-medium transition ${
                        active
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-800">
                Sesi dihindari
              </h3>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.keys(INITIAL_SESI).map((key) => {
                  const session = Number(key)
                  const active = constraints.tanpa_sesi.includes(session)

                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() =>
                        onConstraintsChange({
                          ...constraints,
                          tanpa_sesi: toggle(
                            constraints.tanpa_sesi,
                            session,
                          ),
                        })
                      }
                      className={`rounded-lg border px-2 py-1.5 text-[11px] font-medium transition ${
                        active
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Sesi {session}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                Dosen wajib
              </h3>

              <span className="text-[11px] text-slate-400">
                Opsional
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3">
              {INITIAL_MATA_KULIAH.map((mk) => (
                <label
                  key={mk}
                  className="flex min-w-0 flex-col gap-1.5"
                >
                  <span className="text-xs font-semibold text-slate-600">
                    {mk}
                  </span>

                  <select
                    value={constraints.dosen_wajib[mk] ?? ''}
                    onChange={(event) => {
                      const next = {
                        ...constraints.dosen_wajib,
                      }

                      if (event.target.value) {
                        next[mk] = event.target.value
                      } else {
                        delete next[mk]
                      }

                      onConstraintsChange({
                        ...constraints,
                        dosen_wajib: next,
                      })
                    }}
                    className="h-9 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Bebas memilih</option>

                    {(lecturersBySubject[mk] ?? []).map((lecturer) => (
                      <option key={lecturer} value={lecturer}>
                        Dosen {lecturer}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </section>

        </div>
      </div>
    </section>
  )
}
