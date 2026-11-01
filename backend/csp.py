# csp.py
# Model CSP penjadwalan kuliah + algoritma backtracking (dengan opsi FC, MRV, LCV)
#
# Variabel   : mata kuliah (TG, KKA, ...)
# Domain     : kelas-kelas dari mata kuliah itu, masing-masing punya slot (S1 - S16)
# Constraint : - tidak boleh ada dua kelas di slot yang sama (dicek saat pencarian)
#              - constraint tambahan dari skenario (dipakai untuk menyaring domain di awal)

import json
import time
from itertools import product


def baca_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def baca_data(path):
    data = baca_json(path)
    jumlah_sesi = len(data["sesi"])
    for k in data["kelas"]:
        # Senin sesi 1 = S1, Senin sesi 2 = S2, ..., Selasa sesi 1 = S5, dst.
        k["slot"] = data["hari"].index(k["hari"]) * jumlah_sesi + k["sesi"]
        k["nama"] = f'{k["mk"]}-{k["kelas"]}'
    return data


def alasan_dihapus(kelas, constraint):
    """Cek constraint tambahan. Kalau kelas melanggar, kembalikan alasannya."""
    alasan = []
    if kelas["sesi"] in constraint.get("tanpa_sesi", []):
        alasan.append(f'tidak mau sesi {kelas["sesi"]}')
    if kelas["hari"] in constraint.get("tanpa_hari", []):
        alasan.append(f'hari {kelas["hari"]} dikosongkan')
    dosen_wajib = constraint.get("dosen_wajib", {})
    if kelas["mk"] in dosen_wajib and kelas["dosen"] != dosen_wajib[kelas["mk"]]:
        alasan.append(f'{kelas["mk"]} harus dosen {dosen_wajib[kelas["mk"]]} (kelas ini dosen {kelas["dosen"]})')
    return ", ".join(alasan)


def buat_domain(data, constraint):
    domain = {mk: [] for mk in data["mata_kuliah"]}
    dihapus = []
    urutan = []  # urutan kemunculan pertama di daftar jadwal (setelah constraint diterapkan)
    for k in sorted(data["kelas"], key=lambda k: k["slot"]):
        alasan = alasan_dihapus(k, constraint)
        if alasan:
            dihapus.append((k, alasan))
        else:
            domain[k["mk"]].append(k)
            if k["mk"] not in urutan:
                urutan.append(k["mk"])
    # mata kuliah yang domainnya kosong ditaruh di akhir
    urutan += [mk for mk in data["mata_kuliah"] if mk not in urutan]
    # urutan ini dipakai sebagai urutan pengisian (polos/fc) dan pemecah seri MRV/Degree,
    # sama seperti aturan "lebih dulu di daftar jadwal" pada perhitungan manual
    return {mk: domain[mk] for mk in urutan}, dihapus


def ruang_pencarian(domain):
    total = 1
    for mk in domain:
        total *= len(domain[mk])
    return total


def slot_dari(daftar_kelas):
    return {k["slot"] for k in daftar_kelas}


class Backtracking:
    def __init__(self, domain, fc=True, mrv=True, lcv=True, cari_semua=False, catat_langkah=False,
                 maks_solusi=None):
        self.domain = domain
        self.urutan = list(domain)
        self.fc = fc
        self.mrv = mrv
        self.lcv = lcv
        self.cari_semua = cari_semua
        self.catat_langkah = catat_langkah
        self.maks_solusi = maks_solusi  # berhenti setelah sekian solusi (None = tanpa batas)

        self.solusi = []          # disimpan maksimal 20 solusi pertama
        self.jumlah_solusi = 0
        self.node = 0             # berapa kali sebuah kelas di-assign
        self.backtrack = 0        # berapa kali assignment dibatalkan karena gagal
        self.langkah = []
        self.waktu = 0

    def jalankan(self):
        mulai = time.perf_counter()
        self.cari({}, self.domain)
        self.waktu = time.perf_counter() - mulai
        return self

    # ---------- heuristik ----------
    def degree(self, mk, belum, domain):
        """Jumlah mata kuliah lain (yang belum diisi) yang punya slot sama dengan mk."""
        slot_mk = slot_dari(domain[mk])
        return sum(1 for lain in belum if lain != mk and slot_mk & slot_dari(domain[lain]))

    def pilih_variabel(self, terisi, domain):
        belum = [mk for mk in self.urutan if mk not in terisi]
        if not self.mrv:
            return belum[0]
        # MRV: domain paling sedikit. Kalau seri -> degree terbesar. Kalau masih seri -> urutan data
        return min(belum, key=lambda mk: (len(domain[mk]), -self.degree(mk, belum, domain)))

    def hitung_eliminasi(self, kelas, terisi, domain):
        """Berapa nilai milik mata kuliah lain yang hilang kalau kelas ini dipilih (untuk LCV)."""
        return sum(1 for mk in self.urutan if mk not in terisi and mk != kelas["mk"]
                   for k in domain[mk] if k["slot"] == kelas["slot"])

    def urutkan_nilai(self, mk, terisi, domain):
        nilai = list(domain[mk])  # sudah urut dari slot terkecil
        if self.lcv:
            nilai.sort(key=lambda k: self.hitung_eliminasi(k, terisi, domain))
        return nilai

    # ---------- pengecekan constraint ----------
    def bentrok(self, kelas, terisi):
        for k in terisi.values():
            if k["slot"] == kelas["slot"]:
                return k
        return None

    def forward_checking(self, kelas, terisi, domain):
        """Hapus kelas yang slotnya sama dari domain mata kuliah yang belum diisi."""
        domain_baru = dict(domain)
        for mk in self.urutan:
            if mk not in terisi:
                domain_baru[mk] = [k for k in domain[mk] if k["slot"] != kelas["slot"]]
        kosong = [mk for mk in self.urutan if mk not in terisi and not domain_baru[mk]]
        return domain_baru, kosong

    # ---------- inti backtracking ----------
    def cari(self, terisi, domain):
        if len(terisi) == len(self.urutan):
            self.jumlah_solusi += 1
            if len(self.solusi) < 20:
                self.solusi.append(dict(terisi))
            self.catat("", "SOLUSI DITEMUKAN")
            return True

        mk = self.pilih_variabel(terisi, domain)
        ketemu = False

        for kelas in self.urutkan_nilai(mk, terisi, domain):
            assignment = f'{mk} = S{kelas["slot"]} ({kelas["nama"]})'

            if not self.fc:
                lawan = self.bentrok(kelas, terisi)
                if lawan:
                    self.catat(assignment, f'bentrok dengan {lawan["nama"]}')
                    continue

            self.node += 1
            terisi[mk] = kelas

            if self.fc:
                domain_baru, kosong = self.forward_checking(kelas, terisi, domain)
                if kosong:
                    self.catat(assignment, f'FC: domain {", ".join(kosong)} kosong -> batal')
                    berhasil = False
                else:
                    self.catat(assignment, self.perubahan_domain(domain, domain_baru, terisi))
                    berhasil = self.cari(terisi, domain_baru)
            else:
                self.catat(assignment, "aman")
                berhasil = self.cari(terisi, domain)

            del terisi[mk]
            if berhasil:
                ketemu = True
                if not self.cari_semua or self.cukup():
                    return True
            else:
                self.backtrack += 1

        if not domain[mk]:
            self.catat(f"{mk} = ?", f"domain {mk} kosong -> mundur")
        elif not ketemu:
            self.catat(f"{mk} habis", "semua kelas gagal -> mundur")
        return ketemu

    def cukup(self):
        return self.maks_solusi is not None and self.jumlah_solusi >= self.maks_solusi

    # ---------- pencatatan langkah ----------
    def catat(self, assignment, keterangan):
        if self.catat_langkah and len(self.langkah) < 100:
            self.langkah.append((assignment, keterangan))

    def perubahan_domain(self, lama, baru, terisi):
        berubah = [f'{mk} -> {{{", ".join("S" + str(k["slot"]) for k in baru[mk])}}}'
                   for mk in self.urutan if mk not in terisi and len(baru[mk]) != len(lama[mk])]
        return "; ".join(berubah) if berubah else "-"


def brute_force(domain, cari_semua=True):
    """Pembanding: cek semua kombinasi satu per satu."""
    mulai = time.perf_counter()
    dicek = 0
    jumlah_solusi = 0
    for kombinasi in product(*domain.values()):
        dicek += 1
        slot = [k["slot"] for k in kombinasi]
        if len(set(slot)) == len(slot):
            jumlah_solusi += 1
            if not cari_semua:
                break
    return {"node": dicek, "solusi": jumlah_solusi, "waktu": time.perf_counter() - mulai}
