from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator

from csp import Backtracking, buat_domain


METODE = {
    "polos": {"fc": False, "mrv": False, "lcv": False},
    "fc": {"fc": True, "mrv": False, "lcv": False},
    "mrv": {"fc": True, "mrv": True, "lcv": False},
    "lengkap": {"fc": True, "mrv": True, "lcv": True},
}


class KelasInput(BaseModel):
    mk: str
    kelas: str
    hari: str
    sesi: int = Field(gt=0)
    dosen: str


class DatasetInput(BaseModel):
    hari: list[str]
    sesi: dict[str, str]
    mata_kuliah: list[str]
    kelas: list[KelasInput]


class JadwalRequest(BaseModel):
    dataset: DatasetInput
    constraint: dict[str, Any] = Field(default_factory=dict)
    algoritma: Literal["polos", "fc", "mrv", "lengkap"] = "lengkap"
    cari_semua: bool = False
    maks_solusi: int | None = Field(default=None, gt=0)
    urutan: list[str] | None = None

    @model_validator(mode="after")
    def validate_search_options(self):
        if self.maks_solusi is not None and not self.cari_semua:
            raise ValueError("maks_solusi hanya dapat digunakan saat cari_semua bernilai true.")
        return self


app = FastAPI(
    title="CSP Course Scheduler API",
    description="API untuk menghasilkan jadwal kuliah menggunakan algoritma Backtracking.",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://backend-chi-steel-36.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "CSP Course Scheduler API is running."}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/jadwal")
def generate_schedule(request: JadwalRequest):
    data = request.dataset.model_dump()

    if not data["hari"]:
        raise HTTPException(status_code=422, detail="Daftar hari tidak boleh kosong.")
    if not data["sesi"]:
        raise HTTPException(status_code=422, detail="Daftar sesi tidak boleh kosong.")
    if not data["mata_kuliah"]:
        raise HTTPException(status_code=422, detail="Daftar mata kuliah tidak boleh kosong.")
    if len(set(data["hari"])) != len(data["hari"]):
        raise HTTPException(status_code=422, detail="Daftar hari tidak boleh duplikat.")
    if len(set(data["mata_kuliah"])) != len(data["mata_kuliah"]):
        raise HTTPException(status_code=422, detail="Daftar mata kuliah tidak boleh duplikat.")

    hari_valid = set(data["hari"])
    mk_valid = set(data["mata_kuliah"])
    jumlah_sesi = len(data["sesi"])

    kelas_dengan_slot = []
    for kelas_model in request.dataset.kelas:
        kelas = kelas_model.model_dump()

        if kelas["mk"] not in mk_valid:
            raise HTTPException(
                status_code=422,
                detail=f'Mata kuliah "{kelas["mk"]}" tidak terdaftar di mata_kuliah.',
            )
        if kelas["hari"] not in hari_valid:
            raise HTTPException(
                status_code=422,
                detail=f'Hari "{kelas["hari"]}" pada kelas {kelas["mk"]}-{kelas["kelas"]} tidak valid.',
            )
        if kelas["sesi"] > jumlah_sesi:
            raise HTTPException(
                status_code=422,
                detail=f'Sesi pada kelas {kelas["mk"]}-{kelas["kelas"]} melebihi jumlah sesi yang tersedia.',
            )

        kelas["slot"] = data["hari"].index(kelas["hari"]) * jumlah_sesi + kelas["sesi"]
        kelas["nama"] = f'{kelas["mk"]}-{kelas["kelas"]}'
        kelas_dengan_slot.append(kelas)

    data["kelas"] = kelas_dengan_slot

    constraint = request.constraint
    constraint_dikenal = {"tanpa_sesi", "tanpa_hari", "dosen_wajib"}
    constraint_tidak_dikenal = set(constraint) - constraint_dikenal
    if constraint_tidak_dikenal:
        raise HTTPException(
            status_code=422,
            detail=f"Constraint tidak dikenal: {', '.join(sorted(constraint_tidak_dikenal))}.",
        )

    domain, dihapus = buat_domain(data, constraint)

    if request.urutan is not None:
        urutan = request.urutan
        if len(urutan) != len(set(urutan)) or set(urutan) != set(domain):
            raise HTTPException(
                status_code=422,
                detail="urutan harus memuat setiap mata kuliah tepat satu kali.",
            )
        domain = {mk: domain[mk] for mk in urutan}

    opsi = METODE[request.algoritma]

    bt = Backtracking(
        domain,
        **opsi,
        cari_semua=request.cari_semua,
        catat_langkah=True,
        maks_solusi=request.maks_solusi,
    ).jalankan()

    solusi = [
        {
            mk: {
                "kelas": kelas["kelas"],
                "nama": kelas["nama"],
                "hari": kelas["hari"],
                "sesi": kelas["sesi"],
                "dosen": kelas["dosen"],
                "slot": kelas["slot"],
            }
            for mk, kelas in satu_solusi.items()
        }
        for satu_solusi in bt.solusi
    ]

    langkah = [
        {
            "nomor": index,
            "assignment": assignment,
            "keterangan": keterangan,
        }
        for index, (assignment, keterangan) in enumerate(bt.langkah, start=1)
    ]

    domain_kosong = [mk for mk, kandidat in domain.items() if not kandidat]

    return {
        "algoritma": request.algoritma,
        "jumlah_solusi": bt.jumlah_solusi,
        "solusi_ditampilkan": len(solusi),
        "solusi": solusi,
        "kelas_dihapus": [
            {
                "nama": kelas["nama"],
                "slot": kelas["slot"],
                "alasan": alasan,
            }
            for kelas, alasan in dihapus
        ],
        "domain_kosong": domain_kosong,
        "langkah": langkah,
        "langkah_dibatasi": len(bt.langkah) >= 100,
        "statistik": {
            "node": bt.node,
            "backtrack": bt.backtrack,
            "waktu": bt.waktu,
        },
    }
