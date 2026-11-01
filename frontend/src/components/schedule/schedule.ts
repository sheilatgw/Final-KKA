import type { ClassInput } from '@/types/schedule'

export const INITIAL_HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis']

export const INITIAL_SESI: Record<string, string> = {
  '1': '07.00–08.50',
  '2': '10.00–11.50',
  '3': '13.30–15.20',
  '4': '15.30–17.20',
}

export const INITIAL_MATA_KULIAH = [
  'TG',
  'KKA',
  'KPPL',
  'MD',
  'PW',
  'PBO',
  'JK',
]

export const INITIAL_KELAS: ClassInput[] = [
  { mk: 'TG', kelas: 'A', hari: 'Senin', sesi: 2, dosen: 'A' },
  { mk: 'TG', kelas: 'B', hari: 'Senin', sesi: 1, dosen: 'A' },
  { mk: 'TG', kelas: 'C', hari: 'Selasa', sesi: 2, dosen: 'A' },
  { mk: 'TG', kelas: 'D', hari: 'Selasa', sesi: 1, dosen: 'B' },
  { mk: 'KKA', kelas: 'A', hari: 'Senin', sesi: 3, dosen: 'E' },
  { mk: 'KKA', kelas: 'B', hari: 'Senin', sesi: 1, dosen: 'C' },
  { mk: 'KKA', kelas: 'C', hari: 'Selasa', sesi: 2, dosen: 'F' },
  { mk: 'KKA', kelas: 'D', hari: 'Senin', sesi: 2, dosen: 'D' },
  { mk: 'KKA', kelas: 'E', hari: 'Rabu', sesi: 3, dosen: 'G' },
  { mk: 'KPPL', kelas: 'A', hari: 'Senin', sesi: 3, dosen: 'H' },
  { mk: 'KPPL', kelas: 'B', hari: 'Selasa', sesi: 2, dosen: 'H' },
  { mk: 'KPPL', kelas: 'C', hari: 'Selasa', sesi: 3, dosen: 'H' },
  { mk: 'MD', kelas: 'A', hari: 'Rabu', sesi: 1, dosen: 'B' },
  { mk: 'MD', kelas: 'B', hari: 'Kamis', sesi: 1, dosen: 'B' },
  { mk: 'MD', kelas: 'C', hari: 'Senin', sesi: 2, dosen: 'B' },
  { mk: 'MD', kelas: 'D', hari: 'Rabu', sesi: 3, dosen: 'O' },
  { mk: 'MD', kelas: 'E', hari: 'Senin', sesi: 3, dosen: 'P' },
  { mk: 'PW', kelas: 'A', hari: 'Selasa', sesi: 4, dosen: 'I' },
  { mk: 'PW', kelas: 'B', hari: 'Rabu', sesi: 2, dosen: 'J' },
  { mk: 'PW', kelas: 'C', hari: 'Kamis', sesi: 3, dosen: 'K' },
  { mk: 'PW', kelas: 'D', hari: 'Rabu', sesi: 4, dosen: 'L' },
  { mk: 'PBO', kelas: 'A', hari: 'Senin', sesi: 2, dosen: 'M' },
  { mk: 'PBO', kelas: 'B', hari: 'Selasa', sesi: 3, dosen: 'M' },
  { mk: 'PBO', kelas: 'C', hari: 'Kamis', sesi: 3, dosen: 'L' },
  { mk: 'PBO', kelas: 'D', hari: 'Kamis', sesi: 1, dosen: 'L' },
  { mk: 'JK', kelas: 'A', hari: 'Kamis', sesi: 3, dosen: 'N' },
  { mk: 'JK', kelas: 'B', hari: 'Selasa', sesi: 4, dosen: 'N' },
  { mk: 'JK', kelas: 'C', hari: 'Rabu', sesi: 3, dosen: 'N' },
]
