
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateSchedule } from '@/lib/api'
import type {
  Algorithm,
  ClassInput,
  ConstraintInput,
  DatasetInput,
  ScheduleResponse,
} from '@/types/schedule'
import {
  INITIAL_HARI,
  INITIAL_MATA_KULIAH,
  INITIAL_SESI,
} from '@/constants/schedule'

const EMPTY_CONSTRAINT: ConstraintInput = {
  tanpa_hari: [],
  tanpa_sesi: [],
  dosen_wajib: {},
}

export function useScheduleGenerator(classes: ClassInput[]) {
  const router = useRouter()

  const [algorithm, setAlgorithm] = useState<Algorithm>('lengkap')
  const [searchAll, setSearchAll] = useState(false)
  const [constraints, setConstraints] =
    useState<ConstraintInput>(EMPTY_CONSTRAINT)
  const [result, setResult] = useState<ScheduleResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    const missing = INITIAL_MATA_KULIAH.filter(
      (mk) => !classes.some((item) => item.mk === mk),
    )

    if (missing.length > 0) {
      setError(`Belum ada kandidat kelas untuk: ${missing.join(', ')}`)
      setResult(null)
      return
    }

    const dataset: DatasetInput = {
      hari: INITIAL_HARI,
      sesi: INITIAL_SESI,
      mata_kuliah: INITIAL_MATA_KULIAH,
      kelas: classes,
    }

    setIsGenerating(true)
    setError('')
    setResult(null)

    try {
      const response = await generateSchedule({
        dataset,
        constraint: constraints,
        algoritma: algorithm,
        cari_semua: searchAll,
      })

      setResult(response)

      sessionStorage.setItem(
        'schedule-result',
        JSON.stringify(response),
      )

      sessionStorage.setItem(
        'schedule-dataset',
        JSON.stringify(dataset),
      )

      router.push('/result')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat membuat jadwal.',
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const updateConstraints = (next: ConstraintInput) => {
    setConstraints(next)
    setResult(null)
  }

  return {
    algorithm,
    setAlgorithm,
    searchAll,
    setSearchAll,
    constraints,
    updateConstraints,
    result,
    isGenerating,
    error,
    generate,
  }
}
