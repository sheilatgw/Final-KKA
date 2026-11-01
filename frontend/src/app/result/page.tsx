'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScheduleResults } from '@/components/schedule/ScheduleResults'
import type { ScheduleResponse } from '@/types/schedule'

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<ScheduleResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedResult = sessionStorage.getItem('schedule-result')

      if (!savedResult) {
        router.replace('/')
        return
      }

      setResult(JSON.parse(savedResult) as ScheduleResponse)
    } catch (error) {
      console.error('Gagal membaca hasil penjadwalan:', error)
      router.replace('/')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="size-8 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />
      </main>
    )
  }

  if (!result) return null

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
        >
          <span aria-hidden="true">←</span>
          Kembali ke pengaturan
        </button>

        <ScheduleResults
          result={result}
          isGenerating={false}
          error=""
        />
      </div>
    </main>
  )
}
