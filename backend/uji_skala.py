import argparse
import random
import time

from csp import Backtracking, buat_domain
from main import METODE

BATAS_NODE = 200_000 


def data_acak(jumlah_mk, kelas_per_mk, jumlah_slot, seed):
    acak = random.Random(seed)
    kelas = []
    for i in range(jumlah_mk):
        for j, slot in enumerate(sorted(acak.sample(range(1, jumlah_slot + 1), kelas_per_mk))):
            kelas.append({"mk": f"MK{i + 1}", "kelas": chr(65 + j), "slot": slot,
                          "nama": f"MK{i + 1}-{chr(65 + j)}", "sesi": 0, "hari": "-", "dosen": "-"})
    return {"mata_kuliah": [f"MK{i + 1}" for i in range(jumlah_mk)], "kelas": kelas}


class BacktrackingTerbatas(Backtracking):
    """Sama seperti Backtracking, tapi berhenti kalau node melewati BATAS_NODE."""
    def cari(self, terisi, domain):
        if self.node > BATAS_NODE:
            raise TimeoutError
        return super().cari(terisi, domain)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ketat", action="store_true")
    parser.add_argument("--ulang", type=int, default=3, help="jumlah data acak per ukuran")
    args = parser.parse_args()

    if args.ketat:
        ukuran, kelas_per_mk, rasio = [10, 15, 20, 25], 3, 1.0
    else:
        ukuran, kelas_per_mk, rasio = [7, 10, 15, 20, 30], 4, 1.3

    print(f'Data {"ketat" if args.ketat else "longgar"}: {kelas_per_mk} kelas per mata kuliah, '
          f"slot = {rasio} x jumlah mata kuliah, rata-rata dari {args.ulang} data acak\n")
    print(f'{"n MK":>5} {"Metode":10} {"Rata-rata node":>15} {"Rata-rata waktu (ms)":>21}  Keterangan')
    print("-" * 75)

    for n in ukuran:
        for metode, opsi in METODE.items():
            total_node, total_waktu, ada, tidak_ada, kelamaan = 0, 0, 0, 0, 0
            for seed in range(args.ulang):
                domain, _ = buat_domain(data_acak(n, kelas_per_mk, round(n * rasio), seed), {})
                bt = BacktrackingTerbatas(domain, **opsi)
                mulai = time.perf_counter()
                try:
                    bt.jalankan()
                    ada += bt.jumlah_solusi > 0
                    tidak_ada += bt.jumlah_solusi == 0
                except TimeoutError:
                    kelamaan += 1
                total_waktu += time.perf_counter() - mulai
                total_node += bt.node
            ket = f"solusi ada: {ada}, tidak ada: {tidak_ada}" + (f", kena batas: {kelamaan}" if kelamaan else "")
            print(f"{n:>5} {metode:10} {total_node / args.ulang:>15,.0f} "
                  f"{total_waktu / args.ulang * 1000:>21.3f}  {ket}")
        print()
