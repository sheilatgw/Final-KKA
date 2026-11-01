import { useMemo, useState } from 'react'
import { INITIAL_KELAS, INITIAL_MATA_KULIAH } from '@/constants/schedule'
import type { ClassInput } from '@/types/schedule'

export function useScheduleData() {
  const [classes, setClasses] = useState<ClassInput[]>(INITIAL_KELAS)
  const [selectedMK, setSelectedMK] = useState('Semua')
  const [search, setSearch] = useState('')

  const filteredClasses = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return classes.filter((item) => {
      const matchesMK = selectedMK === 'Semua' || item.mk === selectedMK
      const matchesSearch =
        item.mk.toLowerCase().includes(keyword) ||
        item.kelas.toLowerCase().includes(keyword) ||
        item.dosen.toLowerCase().includes(keyword) ||
        item.hari.toLowerCase().includes(keyword)

      return matchesMK && matchesSearch
    })
  }, [classes, selectedMK, search])

  const removeClass = (target: ClassInput) => {
    setClasses((current) =>
      current.filter(
        (item) =>
          !(
            item.mk === target.mk &&
            item.kelas === target.kelas &&
            item.hari === target.hari &&
            item.sesi === target.sesi &&
            item.dosen === target.dosen
          ),
      ),
    )
  }

  const restoreClasses = () => {
    setClasses([...INITIAL_KELAS])
    setSelectedMK('Semua')
    setSearch('')
  }

  const resetFilters = () => {
    setSelectedMK('Semua')
    setSearch('')
  }

  const subjectCount = INITIAL_MATA_KULIAH.filter((mk) =>
    classes.some((item) => item.mk === mk),
  ).length

  return {
    classes,
    filteredClasses,
    selectedMK,
    setSelectedMK,
    search,
    setSearch,
    removedCount: INITIAL_KELAS.length - classes.length,
    subjectCount,
    removeClass,
    restoreClasses,
    resetFilters,
  }
}
