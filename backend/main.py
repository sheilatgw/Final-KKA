import argparse
import statistics

from csp import Backtracking, baca_data, baca_json, brute_force, buat_domain, ruang_pencarian

METODE = {
    "polos":   dict(fc=False, mrv=False, lcv=False),
    "fc":      dict(fc=True,  mrv=False, lcv=False),
    "mrv":     dict(fc=True,  mrv=True,  lcv=False),
    "lengkap": dict(fc=True,  mrv=True,  lcv=True),
}


def atur_urutan(domain, urutan):
    """Ubah urutan variabel: urutan pengisian (polos/fc) dan pemecah seri (mrv/lengkap)."""
    if not urutan:
        return domain
    urutan = [mk.strip() for mk in urutan.split(",")]
    if sorted(urutan) != sorted(domain):
        raise SystemExit(f"--urutan harus berisi semua mata kuliah: {', '.join(domain)}")
    return {mk: domain[mk] for mk in urutan}


def tampilkan_skenario(data, nama, skenario, metode, cari_semua, urutan=None, maks=None):
    domain, dihapus = buat_domain(data, skenario["constraint"])
    domain = atur_urutan(domain, urutan)
    print(f"=== Skenario: {nama} ===")
    print(skenario["deskripsi"], "\n")

    if dihapus:
        print("Kelas yang dihapus oleh constraint tambahan:")
        for k, alasan in dihapus:
            print(f'  {k["nama"]:7} (S{k["slot"]:<2}) : {alasan}')
        print()

    print("Domain:")
    for mk, isi in domain.items():
        slot = ", ".join(f'S{k["slot"]}' for k in isi) or "KOSONG"
        print(f"  {mk:5}: {slot}")
    print(f"Ruang pencarian: {ruang_pencarian(domain):,} kombinasi\n")

    bt = Backtracking(domain, **METODE[metode], cari_semua=cari_semua, catat_langkah=True,
                      maks_solusi=maks).jalankan()

    print(f"Langkah pencarian (metode: {metode}, urutan variabel: {', '.join(domain)}):")
    for i, (assignment, ket) in enumerate(bt.langkah, 1):
        print(f"  {i:3}. {assignment:22} {ket}")
    if len(bt.langkah) == 100:
        print("  ... (hanya 100 langkah pertama yang ditampilkan)")
    print()

    if bt.solusi:
        print("Solusi:")
        for i, s in enumerate(bt.solusi, 1):
            print(f"  {i:2}. " + ", ".join(f'{s[mk]["nama"]}(S{s[mk]["slot"]})' for mk in data["mata_kuliah"]))
        if bt.jumlah_solusi > len(bt.solusi):
            print(f"  ... (ditampilkan {len(bt.solusi)} dari {bt.jumlah_solusi:,} solusi)")
    else:
        print("Tidak ada solusi.")

  
    waktu = ukur_waktu(lambda: Backtracking(domain, **METODE[metode], cari_semua=cari_semua,
                                            maks_solusi=maks).jalankan().waktu)
    print(f"\nJumlah solusi: {bt.jumlah_solusi:,} | node: {bt.node:,} | "
          f"backtrack: {bt.backtrack:,} | waktu: {waktu * 1000:.3f} ms\n")


def ukur_waktu(fungsi, ulang=5):

    return statistics.median(fungsi() for _ in range(ulang))


def banding(data, semua_skenario, cari_semua):
    print(f'Perbandingan metode ({"semua solusi" if cari_semua else "1 solusi pertama"})\n')
    print(f'{"Skenario":12} {"Metode":12} {"Solusi":>7} {"Node":>8} {"Backtrack":>10} {"Waktu (ms)":>11}')
    print("-" * 64)
    for nama, skenario in semua_skenario.items():
        domain, _ = buat_domain(data, skenario["constraint"])
        bf = brute_force(domain, cari_semua)
        waktu = ukur_waktu(lambda: brute_force(domain, cari_semua)["waktu"])
        print(f'{nama:12} {"brute force":12} {bf["solusi"]:>7,} {bf["node"]:>8,} {"-":>10} {waktu * 1000:>11.3f}')
        for metode, opsi in METODE.items():
            bt = Backtracking(domain, **opsi, cari_semua=cari_semua).jalankan()
            waktu = ukur_waktu(lambda: Backtracking(domain, **opsi, cari_semua=cari_semua).jalankan().waktu)
            print(f"{'':12} {metode:12} {bt.jumlah_solusi:>7,} {bt.node:>8,} {bt.backtrack:>10,} {waktu * 1000:>11.3f}")
        print()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("skenario", nargs="?", default="awal")
    parser.add_argument("--metode", default="lengkap", choices=METODE)
    parser.add_argument("--semua", action="store_true", help="cari semua solusi")
    parser.add_argument("--banding", action="store_true", help="bandingkan semua metode")
    parser.add_argument("--urutan", help="urutan variabel sendiri, contoh: TG,KKA,KPPL,MD,PW,PBO,JK")
    parser.add_argument("--maks", type=int, help="berhenti setelah N solusi (dipakai bersama --semua)")
    args = parser.parse_args()

    data = baca_data("data/jadwal.json")
    semua_skenario = baca_json("data/skenario.json")

    if args.banding:
        banding(data, semua_skenario, args.semua)
    elif args.skenario not in semua_skenario:
        print(f"Skenario tidak ada. Pilihan: {', '.join(semua_skenario)}")
    else:
        tampilkan_skenario(data, args.skenario, semua_skenario[args.skenario], args.metode, args.semua,
                           args.urutan, args.maks)
