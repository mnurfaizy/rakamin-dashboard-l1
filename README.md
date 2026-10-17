# Rakamin Dashboard L1

Dashboard feedback peserta (Kirkpatrick Level 1) untuk program training Rakamin. Satu program = satu situs statis (satu file `index.html`), dengan tampilan yang disesuaikan per klien. Data dibaca langsung dari Google Sheet, dan ada salinan data tertanam sebagai cadangan.

Konteks produk (kondisi A/B/C, section standar, aturan perhitungan, warna peringatan): [docs/KONTEKS-DASHBOARD.md](docs/KONTEKS-DASHBOARD.md).

## Struktur

```
.
├── README.md
├── render.yaml                  # blueprint Render: satu static site per program
├── package.json                 # npm run build  → build semua program
├── docs/
│   └── KONTEKS-DASHBOARD.md     # standar dashboard dan catatan tiap project
└── programs/
    ├── goto-pm-workshop-b1/     # GoTo · Project Management Workshop Batch 1 (sesi tunggal)
    ├── bsi-bpi-sdp-b2-b3/       # BSI · Business Process Improvement for SDP, Batch 2 & 3 + Rangkuman
    └── bsi-bpi-sdp-a10/         # BSI · Business Process Improvement SDP Angkatan 10 (2 hari) + Rangkuman
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
| `dist/` | Hasil build. Tidak di-commit. |

## Program

| Program | Tampilan | Situs |
|---|---|---|
| `goto-pm-workshop-b1` | Sesi tunggal | `goto-pm-insight` (dropdown Batch 1 / Batch 2, Batch 2 belum berjalan) |
| `bsi-bpi-sdp-b2-b3` | Rangkuman, Batch 2, Batch 3 | `bsi-bpi-sdp-insight` |
| `bsi-bpi-sdp-a10` | Rangkuman, Hari 1, Hari 2 | `bsi-bpi-sdp-a10-insight` |

## Build lokal

Hanya butuh Node.js 18 atau lebih baru, tanpa dependensi.

```bash
npm run build              # semua program
npm run build:goto-pm      # satu program
npm run build:bsi-b2-b3
npm run build:bsi-a10
```

Hasilnya `programs/<nama>/dist/index.html`. Buka langsung di browser untuk pratinjau. Saat dibuka dari `file://`, pembacaan Google Sheet terblokir CORS, jadi halaman memakai data bawaan. Itu normal.

## Deploy ke Render

Semua situs berupa static site tanpa server dan tanpa environment variable.

1. Hubungkan repo ini di Render, lalu pilih **New → Blueprint** dan arahkan ke `render.yaml`. Render membuat tiga static site sekaligus.
2. Tiap situs menjalankan `buildCommand` dari foldernya, lalu mempublikasikan `./dist`. Setiap `git push` ke branch utama men-deploy ulang otomatis.
3. Bila Blueprint tidak dipakai, buat Static Site manual dengan **Root Directory** `programs/<nama>`, **Build Command** seperti di `render.yaml`, dan **Publish Directory** `dist`.

Perubahan data di Google Sheet tampil setelah halaman di-refresh, tanpa deploy ulang. Deploy hanya perlu saat tampilan, data bawaan, atau tema berubah.

## Membuat program baru

1. Salin folder program yang paling mirip ke `programs/<klien>-<program>/`. Sesi tunggal: `goto-pm-workshop-b1`. Program multi-sesi selesai dengan Rangkuman: `bsi-bpi-sdp-a10` (atau `bsi-bpi-sdp-b2-b3` bila unitnya batch).
2. Ganti isi `brand/` dengan logo dan gambar klien, lalu sesuaikan token warna di bagian `:root` pada `index.template.html`.
3. Ubah `CONFIG` di template: ID Google Sheet, nama program, tanggal, total peserta, label unit.
4. Untuk program BSI-style: isi `data/responses.js`, kodekan tema di `data/themes.js`, jalankan `node data/build-sheet-data.js`, lalu unggah `data/sheet-data.json` ke sheet dashboard.
5. Tambahkan skrip di `package.json` dan satu entri service di `render.yaml`.

## Data pribadi

- Sheet operasional klien memuat nama, email, dan NIP. **Jangan** dihubungkan ke dashboard dan jangan di-commit.
- Dashboard hanya membaca **sheet dashboard anonim** yang dibuat per program (ID-nya ada di `CONFIG.sheetId` dan di `docs/KONTEKS-DASHBOARD.md`). Sheet itu perlu dibagikan "Anyone with the link: Viewer" agar data live terbaca.
- Repo ini memuat logo dan aset brand klien serta komentar peserta tanpa nama. Simpan sebagai repo **private**.
