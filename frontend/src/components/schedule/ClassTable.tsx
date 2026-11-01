import type { ClassInput } from '@/types/schedule'
import { INITIAL_SESI } from '@/constants/schedule'

interface ClassTableProps {
  classes: ClassInput[]
  onRemove: (item: ClassInput) => void
}

export function ClassTable({ classes, onRemove }: ClassTableProps) {
  if (classes.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <span className="text-xl">⌕</span>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-700">Kelas tidak ditemukan</p>
        <p className="mt-1 text-xs text-slate-400">Coba ubah kata kunci atau filter mata kuliah.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3.5 sm:px-6">Mata kuliah</th>
            <th className="px-4 py-3.5">Kelas</th>
            <th className="px-4 py-3.5">Dosen</th>
            <th className="px-4 py-3.5">Hari</th>
            <th className="px-4 py-3.5">Waktu</th>
            <th className="px-5 py-3.5 text-right sm:px-6">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {classes.map((item) => (
            <tr
              key={`${item.mk}-${item.kelas}`}
              className="transition hover:bg-blue-50/40"
            >
              <td className="px-5 py-4 font-semibold text-slate-900 sm:px-6">
                {item.mk}
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex min-w-8 justify-center rounded-lg bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                  {item.kelas}
                </span>
              </td>
              <td className="px-4 py-4 text-slate-600">Dosen {item.dosen}</td>
              <td className="px-4 py-4 text-slate-600">{item.hari}</td>
              <td className="px-4 py-4 text-slate-600">
                {INITIAL_SESI[String(item.sesi)] ?? `Sesi ${item.sesi}`}
              </td>
              <td className="px-5 py-4 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  aria-label={`Hapus kelas ${item.mk}-${item.kelas}`}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
