
import type { ScheduleClass } from '@/types/schedule'
import { INITIAL_HARI, INITIAL_SESI } from '@/constants/schedule'

interface TimetableProps {
  solution: Record<string, ScheduleClass>
}

export function Timetable({ solution }: TimetableProps) {
  const entries = Object.entries(solution ?? {})
  const classesBySlot = new Map<
    string,
    { mk: string; item: ScheduleClass }[]
  >()

  entries.forEach(([mk, item]) => {
    const key = `${item.hari}-${item.sesi}`
    const current = classesBySlot.get(key) ?? []

    current.push({ mk, item })
    classesBySlot.set(key, current)
  })

  return (
    <div className="w-full min-w-0">
      <table className="w-full table-fixed border-separate border-spacing-1 text-left">
        <thead>
          <tr>
            <th className="w-[76px] rounded-md bg-slate-100 px-1.5 py-2 text-[10px] font-semibold text-slate-500 sm:w-24 sm:px-2 sm:text-xs">
              Waktu
            </th>

            {INITIAL_HARI.map((day) => (
              <th
                key={day}
                className="rounded-md bg-blue-50 px-1 py-2 text-center text-[10px] font-bold text-blue-800 sm:px-2 sm:text-xs"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Object.entries(INITIAL_SESI).map(([session, time]) => (
            <tr key={session}>
              <th className="rounded-md bg-slate-50 px-1.5 py-2 align-top text-[10px] font-semibold text-slate-600 sm:px-2 sm:py-2.5 sm:text-xs">
                <span className="block">Sesi {session}</span>
                <span className="mt-0.5 block text-[9px] font-normal text-slate-400 sm:text-[10px]">
                  {time}
                </span>
              </th>

              {INITIAL_HARI.map((day) => {
                const scheduled =
                  classesBySlot.get(`${day}-${session}`) ?? []

                return (
                  <td
                    key={day}
                    className="h-20 rounded-md border border-slate-100 bg-white p-1 align-top sm:h-24 sm:p-1.5"
                  >
                    <div className="space-y-1">
                      {scheduled.map(({ mk, item }) => (
                        <div
                          key={mk}
                          className="rounded-md border border-blue-100 bg-blue-50 px-1.5 py-1 sm:px-2 sm:py-1.5"
                        >
                          <p className="break-words text-[10px] font-bold leading-tight text-blue-900 sm:text-xs">
                            {mk} — {item.kelas}
                          </p>

                          <p className="mt-0.5 break-words text-[9px] leading-tight text-blue-700 sm:text-[10px]">
                            Dosen {item.dosen}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
