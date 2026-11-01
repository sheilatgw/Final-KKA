export function ScheduleHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Smart Course Scheduler
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Kelola kandidat kelas dan temukan kombinasi jadwal kuliah tanpa bentrok.
        </p>
      </div>
    </header>
  )
}
