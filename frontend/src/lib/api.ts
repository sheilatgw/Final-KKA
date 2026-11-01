import type {
  ScheduleRequest,
  ScheduleResponse,
} from '@/types/schedule'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export async function generateSchedule(
  payload: ScheduleRequest,
): Promise<ScheduleResponse> {
  let response: Response

  try {
    response = await fetch(`${API_URL}/api/jadwal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(
      'Tidak dapat terhubung ke backend. Pastikan server sedang berjalan.',
    )
  }

  const result = await response.json()

  if (!response.ok) {
    const detail = result?.detail

    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail
              .map((item: { msg?: string }) => item.msg ?? '')
              .filter(Boolean)
              .join(', ')
          : 'Gagal membuat jadwal.'

    throw new Error(message)
  }

  return result as ScheduleResponse
}