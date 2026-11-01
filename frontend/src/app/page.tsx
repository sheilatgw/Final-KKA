
'use client'

import { ScheduleHeader } from '@/components/schedule/ScheduleHeader'
import { ClassSection } from '@/components/schedule/ClassSection'
import { ScheduleSidebar } from '@/components/schedule/ScheduleSidebar'
import { ScheduleSettings } from '@/components/schedule/ScheduleSettings'
import { useScheduleData } from '@/hooks/schedule/useScheduleData'
import { useScheduleGenerator } from '@/hooks/schedule/useScheduleGenerator'

export default function Home() {
  const schedule = useScheduleData()
  const generator = useScheduleGenerator(schedule.classes)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 lg:h-screen lg:overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col px-4 py-5 sm:px-6 lg:h-full lg:min-h-0 lg:px-8 lg:py-6">

        {/* Header */}
        <div className="shrink-0">
          <ScheduleHeader />
        </div>

        {/* Main dashboard: 3 columns */}
        <div className="mt-5 flex flex-1 flex-col gap-5 lg:min-h-0 lg:flex-row lg:gap-4">

          {/* Column 1: Candidate classes */}
          <div className="flex min-w-0 flex-col lg:min-h-0 lg:flex-[1.3]">
            <ClassSection
              classes={schedule.filteredClasses}
              totalClasses={schedule.classes.length}
              selectedMK={schedule.selectedMK}
              search={schedule.search}
              onSelectMK={schedule.setSelectedMK}
              onSearch={schedule.setSearch}
              onRemove={(item) => {
                schedule.removeClass(item)
                generator.updateConstraints(generator.constraints)
              }}
              onResetFilters={schedule.resetFilters}
            />
          </div>

          {/* Column 2: Search settings */}
          <div className="flex min-w-0 flex-col lg:min-h-0 lg:flex-[1.2]">
            <ScheduleSettings
              classes={schedule.classes}
              algorithm={generator.algorithm}
              searchAll={generator.searchAll}
              constraints={generator.constraints}
              onAlgorithmChange={generator.setAlgorithm}
              onSearchAllChange={generator.setSearchAll}
              onConstraintsChange={generator.updateConstraints}
            />
          </div>

          {/* Column 3: Sidebar */}
          <div className="flex min-w-0 flex-col lg:min-h-0 lg:flex-[0.6]">
            <ScheduleSidebar
              classes={schedule.classes}
              subjectCount={schedule.subjectCount}
              removedCount={schedule.removedCount}
              onRestore={schedule.restoreClasses}
              onGenerate={generator.generate}
              isGenerating={generator.isGenerating}
              canGenerate={schedule.subjectCount === 7}
            />
          </div>

        </div>
      </div>
    </main>
  )
}
