# Data: membaca sheet, sheet anonim, koding tema

## 1. Membaca sheet sumber

- Sheet Google asli: `get_spreadsheet` (pakai parameter `fields`, mis. `sheets.properties`) untuk daftar tab, `get_values` untuk isi. Baca header baris 1 dulu, lalu seluruh baris data dengan rentang yang cukup panjang.
- File `.xlsx` di Drive (bukan Google Sheet asli): `read_file_content` mengembalikan teks CSV semua tab; `download_file_content` mengembalikan base64 yang tidak praktis diurai. Dashboard tidak bisa membaca `.xlsx` lewat gviz, jadi datanya harus disalin ke Google Sheet asli (langkah 2).
- Tab analisis klien ("L1 Analysis", "Recap") berguna sebagai pembanding: hitung rata-rata, NPS, dan jumlah responden sendiri dari data mentah lalu cocokkan. Selisih kecil (pembulatan, atau hari yang dihitung terpisah) wajar; selisih besar berarti salah baca kolom.
- Waspadai: baris rata-rata di bawah data, kolom ganda dengan header sama, jawaban tanpa isi ("-", "n/a"), skala NPS 1–10 versus 0–10, nilai "Skor" form yang tidak relevan.
- **Sheet operasional memuat data pribadi** (nama, email, NIP, jabatan, unit, skor post test). Tidak boleh dihubungkan ke dashboard dan tidak boleh masuk repo.

**Tanyakan bila belum jelas** (pernah menjadi penghalang): cara menentukan hari tiap respons bila satu form dipakai beberapa hari (biasanya lewat tanggal Timestamp; periksa respons terlambat, format dd/mm vs mm/dd, dan zona waktu), apakah form sudah ditutup bila jumlah jawaban kurang dari jumlah peserta, dan header persis tiap pertanyaan.

## 2. Sheet dashboard anonim

Buat di **folder Drive yang sama** dengan sumbernya. Cara yang berhasil: `create_file` dengan `contentMimeType: text/csv`, `parentId` folder sumber, dan `textContent` CSV; Drive mengubahnya menjadi Google Sheet asli. Lalu:

1. `update_spreadsheet` untuk mengganti nama tab pertama menjadi `00. Feedback Peserta` (atau `00. Daily Feedback Peserta`), membekukan baris 1 dan 3 kolom pertama, mengatur zona waktu `Asia/Jakarta`, dan menambah tab `Info Sesi`, `Insight by Claude`, `Panduan`.
2. `update_values` untuk mengisi tab lain. **Rentang harus mencakup semua baris** termasuk header.
3. Verifikasi dengan `get_values` pada baris akhir. Jangan membagikan sheet atau mengubah akses tanpa izin user; dashboard membaca live hanya setelah user membagikannya "Anyone with the link: Viewer".

Isi tab:

| Tab | Kolom | Catatan |
|---|---|---|
| `00. Feedback Peserta` | `Tanggal` (sesi tunggal) atau `Batch`/`Hari` (multi unit), `Tanggal`, `Responden`, pertanyaan skor, NPS, pertanyaan terbuka | Tanpa nama, email, NIP, skor post test. `Responden` = ID unik (`B2-5`, `H1-12`). Header teks pertanyaan dipertahankan dari sumber agar bisa dilacak. |
| `Info Sesi` | `Tanggal`/`Batch`/`Hari`, `Tanggal`, `Tutor`, `Asisten Tutor`, `Topik`, `Jumlah Peserta` | Satu baris per sesi atau unit. Isi nama talent bila sudah diketahui. |
| `Insight by Claude` | kolom unit (`Tanggal`/`Batch`/`Hari`), `Panel`, `Tema`, `Jumlah`, `Responden`, `Kutipan`, `Kata Kunci` | Baris `Rangkuman` untuk tampilan gabungan. |
| `Panduan` | aturan isi dan pemetaan pertanyaan ke kode aspek | Tulis juga sumber dan tanggal salin. |

Pindai sebelum commit atau berbagi: email, nomor 10 digit berawalan `21` (NIP), nama peserta di kolom bebas.

## 3. Koding tema

Tujuan: mengubah jawaban terbuka menjadi tema yang bisa diklik, dengan jumlah yang bisa diverifikasi.

Prosedur:
1. Baca semua jawaban per pertanyaan terbuka. Kelompokkan menjadi tema yang bermakna (bukan per kata kunci). Satu responden boleh masuk beberapa tema. Jawaban kosong atau tak bermakna ("-", "sudah baik" tanpa isi) tidak perlu masuk tema.
2. Tiap tema: label singkat berbahasa Indonesia, daftar nomor responden, 1–3 **kutipan persis** dari jawaban, dan kata kunci untuk highlight. Kutipan harus substring jawaban asli, termasuk tanda kutip melengkung dan salah ketik.
3. Panel: `Diapresiasi` (dari pertanyaan hal yang berjalan baik atau dipertahankan), `Saran perbaikan`, `Ingin diperdalam` (hanya bila ada pertanyaannya), `Paling diingat` (bila ada pertanyaannya).
4. Tulis koding di berkas data program (`data/themes.js`, nomor responden per batch atau hari) dan jawaban mentah anonim di `data/responses.js`. `data/build-sheet-data.js` memvalidasi dan menulis `sheet-data.json` (tabel feedback, info, insight) yang diunggah ke sheet dashboard.
5. Skrip validasi harus lulus tanpa masalah: jumlah per tema cocok dengan ID, kutipan persis ada di jawaban, setiap baris Rangkuman juga dikodekan pada panel yang sama di unitnya, kutipan Suara Mayoritas berasal dari tema yang lolos ambang.

Gunakan `programs/bsi-bpi-sdp-a10/data/*` sebagai contoh paling lengkap (panel Paling diingat, Rangkuman, Suara Mayoritas).

### Memilih Suara Mayoritas

- Hanya tema **Diapresiasi** dengan jumlah ≥30% responden pada tampilan itu, dan yang membahas talent, materi, atau jalannya sesi. Tema tempat, makanan, atau panitia/Tim Rakamin dilewati walau besar.
- Satu kutipan per tema, paling mewakili dan paling ringkas yang masih utuh maknanya. Maksimal 3. Jumlahnya mengikuti tema yang lolos, bahkan bila hanya 1. Bila lebih dari 3 tema lolos, ambil 3 dengan jumlah terbanyak (seri: ID responden terkecil).
- Hati-hati pada tampilan dengan responden sedikit: 30% dari 18 orang berarti minimal 6 orang (5 orang = 27,8% tidak lolos).
- Pada tampilan yang tidak punya tema lolos, jangan memaksa; tampilkan keadaan kosong yang sopan.
- Label tema memuat proporsi, mis. `Kelas interaktif (9 dari 26 responden)`. Dashboard memisahkan teks dalam kurung menjadi lencana.

## 4. Verifikasi angka

Setelah build, bandingkan di browser dan di skrip: jumlah responden, rata-rata tiap kelompok aspek, NPS, jumlah tema, hasil filter tema (jumlah baris tabel harus sama dengan angka di chip). Catat bila ada selisih dengan tab analisis klien beserta alasannya.
