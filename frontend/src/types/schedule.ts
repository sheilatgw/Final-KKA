export interface ClassInput {
  mk: string
  kelas: string
  hari: string
  sesi: number
  dosen: string
}

export interface DatasetInput {
  hari: string[]
  sesi: Record<string, string>
  mata_kuliah: string[]
  kelas: ClassInput[]
}

export type Algorithm = 'polos' | 'fc' | 'mrv' | 'lengkap'

export interface ConstraintInput {
  tanpa_hari: string[]
  tanpa_sesi: number[]
  dosen_wajib: Record<string, string>
}

export interface ScheduleRequest {
  dataset: DatasetInput
  constraint: ConstraintInput
  algoritma: Algorithm
  cari_semua: boolean
  maks_solusi?: number | null
  urutan?: string[] | null
}

export interface ScheduleClass extends ClassInput {
  slot: number
  nama: string
}

export interface ScheduleStatistics {
  node: number
  backtrack: number
  waktu: number
}

export interface DeletedClass {
  nama: string
  slot: number
  alasan: string
}

export interface ScheduleResponse {
  algoritma: Algorithm
  jumlah_solusi: number
  solusi_ditampilkan: number
  solusi: Record<string, ScheduleClass>[]
  kelas_dihapus: DeletedClass[]
  domain_kosong: string[]
  statistik: ScheduleStatistics
  langkah: SearchStep[]
  langkah_dibatasi: boolean
}

export interface SearchStep {
  nomor: number
  assignment: string
  keterangan: string
}