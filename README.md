# Rakamin Dashboard L1

Dashboard feedback peserta (Kirkpatrick Level 1) untuk program training Rakamin. Satu program = satu situs statis (satu file `index.html`), dengan tampilan yang disesuaikan per klien. Data dibaca langsung dari Google Sheet, dan ada salinan data tertanam sebagai cadangan.

Konteks produk (kondisi A/B/C, section standar, aturan perhitungan, warna peringatan): [docs/KONTEKS-DASHBOARD.md](docs/KONTEKS-DASHBOARD.md).

## Struktur

```
.
├── README.md
├── render.yaml                  # blueprint Render: satu static site untuk semua program
├── package.json                 # npm run build  → build semua program ke site/
├── scripts/
│   └── build-site.js            # build semua program dan susun site/ (satu sub-path per program)
├── docs/
│   └── KONTEKS-DASHBOARD.md     # standar dashboard dan catatan tiap project
└── programs/
    ├── goto-pm-workshop-b1/     # GoTo · Project Management Workshop Batch 1 (sesi tunggal)
    ├── bsi-bpi-sdp-b2-b3/       # BSI · Business Process Improvement for SDP, Batch 2 & 3 + Rangkuman
    ├── bsi-bpi-sdp-a10/         # BSI · Business Process Improvement SDP Angkatan 10 (2 hari) + Rangkuman
    ├── ...                      # program lain (lihat tabel di bawah)
    └── insight-hub/             # L1 Insight Hub: halaman internal yang menautkan semua program
```

Isi setiap folder program:

| Berkas | Fungsi |
|---|---|
| `index.template.html` | Sumber dashboard (CSS, logika data, render). Tempat tampilan diubah. |
| `build.js` | Menanam logo/gambar sebagai data URI dan data bawaan, lalu menulis `dist/index.html`. |
| `brand/` | Logo dan gambar dari deck klien. |
| `data/responses.js` | Salinan jawaban L1 **anonim** (tanpa nama, email, NIP, skor post test). Hanya di program BSI. |
| `data/themes.js` | Koding tema Diapresiasi / Saran / Ingin diperdalam oleh Claude, dirujuk lewat ID responden. |
| `data/build-sheet-data.js` | Memvalidasi tema dan membuat `data/sheet-data.json` (tabel yang diunggah ke Google Sheet dashboard). |
| `netlify.toml` | Hanya dipakai bila situs masih di Netlify. Boleh dihapus setelah migrasi selesai. |
| `dist/` | Hasil build program. Tidak di-commit. |

## Program dan alamatnya

Semua program disajikan oleh **satu** situs statis, masing-masing di sub-path sendiri.

| Program | Sub-path | Tampilan |
|---|---|---|
| `goto-pm-workshop-b1` | `/goto-pm/` | Sesi tunggal, dropdown Batch 1 / Batch 2 (Batch 2 belum berjalan) |
| `bsi-bpi-sdp-b2-b3` | `/bsi-bpi-sdp-batch-2-3/` | Rangkuman, Batch 2, Batch 3 |
| `bsi-bpi-sdp-a10` | `/bsi-bpi-sdp-angkatan-10/` | Rangkuman, Hari 1, Hari 2 |
| `bsi-bpi-mastery` | `/bsi-bpi-mastery/` | Rangkuman, Hari 1, Hari 2 |
| `ikdd-sms-b1` | `/ikdd-sms-batch-1/` | Rangkuman Day 1–10, Day 1 … Day 10 (dropdown) |
| `ikdd-sms-b2` | `/ikdd-sms-batch-2/` | Daily (Day 1–10, berjalan), dimigrasi apa adanya dari Netlify |
| `goto-driver-kids` | `/gojek-magang-driver-kids/` | Rangkuman, Day 2, Day 3 (Magang di Kantor Gojek, Driver's Kids) |
| `insight-hub` | `/` (akar situs) dan `/client-view/` | **L1 Insight Hub** (internal): satu halaman yang menautkan semua program, per klien |

Halaman akar (`/`) adalah L1 Insight Hub yang memuat semua klien dan program, jadi **jangan membagikan alamat akar ke klien**: bagikan link per sub-path (mis. `/goto-pm/`). `robots.txt` dan `noindex` mencegah pengindeksan mesin pencari, tetapi siapa pun yang tahu alamat akar bisa melihat semua klien.

### L1 Insight Hub (`programs/insight-hub/`)

- `data/programs.js`: daftar klien dan program (nama lengkap, warna kartu, tanggal, status `selesai` / `berjalan` / `segera`, jumlah jawaban, skor kepuasan keseluruhan, NPS, satu kutipan Suara Mayoritas). Angka disalin dari tampilan Rangkuman tiap dashboard; perbarui saat dashboard program berubah.
- Program `berjalan` dengan `live` membaca ulang sheet dashboard-nya saat halaman dibuka (jumlah jawaban, kepuasan, hari terakhir), jadi kartunya ikut bertambah tanpa build ulang. Hanya agregat yang dihitung, tidak ada jawaban atau nama yang ditampilkan.
- `photos/`: satu foto per program + tiga foto hero, diambil dari folder dokumentasi Drive (thumbnail 720 px). Program tanpa foto menampilkan "Foto dokumentasi menyusul".
- Menambah program: tambah entri di `programs` (dan klien baru di `clients` bila perlu), simpan fotonya di `photos/<nama>.jpg`, lalu `npm run build:hub`.

## Build lokal

Hanya butuh Node.js 18 atau lebih baru, tanpa dependensi.

```bash
npm run build              # semua program → site/<sub-path>/index.html
npm run build:goto-pm      # satu program → programs/<nama>/dist/index.html
npm run build:bsi-b2-b3
npm run build:bsi-a10
npm run build:bsi-mastery
npm run build:ikdd-b1
npm run build:ikdd-b2
npm run build:gojek-dk
npm run build:hub
```

Buka `site/<sub-path>/index.html` langsung di browser untuk pratinjau. Dari `file://`, pembacaan Google Sheet terblokir CORS, jadi halaman memakai data bawaan. Itu normal.

## Deploy ke Render

Satu static site untuk semuanya, tanpa server dan tanpa environment variable.

| Kolom | Isi |
|---|---|
| Branch | `main` |
| Root Directory | kosong (akar repo) |
| Build Command | `node scripts/build-site.js` |
| Publish Directory | `site` |
| Header (opsional) | Path `/*`, `Cache-Control: no-cache` |

`render.yaml` berisi pengaturan yang sama untuk **New → Blueprint** (Render meminta kartu untuk Blueprint). Setiap push ke `main` men-deploy ulang. Perubahan data di Google Sheet tampil setelah refresh tanpa deploy ulang.

## Membuat program baru

0. Template `bsi-bpi-sdp-a10` dan `bsi-bpi-sdp-b2-b3` mendukung berapa pun unit (batch/hari) dan NPS opsional lewat `CONFIG`; lihat `.claude/skills/rakamin-l1-dashboard/` untuk alur lengkap.
1. Salin folder program yang paling mirip ke `programs/<klien>-<program>/`. Sesi tunggal: `goto-pm-workshop-b1`. Program multi-sesi selesai dengan Rangkuman: `bsi-bpi-sdp-a10` (atau `bsi-bpi-sdp-b2-b3` bila unitnya batch).
2. Ganti isi `brand/` dengan logo dan gambar klien, lalu sesuaikan token warna di bagian `:root` pada `index.template.html`.
3. Ubah `CONFIG` di template: ID Google Sheet, nama program, tanggal, total peserta, label unit.
4. Untuk program BSI-style: isi `data/responses.js`, kodekan tema di `data/themes.js`, jalankan `node data/build-sheet-data.js`, lalu unggah `data/sheet-data.json` ke sheet dashboard.
5. Tambahkan skrip di `package.json` dan satu entri di `PROGRAMS` pada `scripts/build-site.js`.

## Data pribadi

- Sheet operasional klien memuat nama, email, dan NIP. **Jangan** dihubungkan ke dashboard dan jangan di-commit.
- Dashboard hanya membaca **sheet dashboard anonim** yang dibuat per program (ID-nya ada di `CONFIG.sheetId` dan di `docs/KONTEKS-DASHBOARD.md`). Sheet itu perlu dibagikan "Anyone with the link: Viewer" agar data live terbaca.
- Repo ini memuat logo dan aset brand klien serta komentar peserta tanpa nama. Simpan sebagai repo **private**.
