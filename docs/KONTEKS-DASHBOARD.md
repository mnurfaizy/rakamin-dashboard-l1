# Konteks Integrated L1 Dashboard

> Dokumen konteks produk. Struktur repo, cara build, dan cara deploy ada di [README.md](../README.md).

Dokumen acuan untuk membangun dashboard feedback L1 (Kirkpatrick Level 1) per project Rakamin. Disepakati 16 Okt 2026.

## Tujuan

- Menyajikan feedback harian peserta training secara cepat, rapi, dan bisa dibagikan lewat link Netlify.
- Satu **template standar** (layout, section, logika data) dipakai semua project. Yang divariasikan per project hanya **tampilan UI** (warna, logo, background, nama program).
- Referensi: https://ikdd-batch2-insight.netlify.app/ (source: `index (10).html`, IKDD SMS Batch 2).

## Tiga kondisi dashboard

Kondisi diatur **manual** di config project (`status`), tidak otomatis.

| Kondisi | Default saat link dibuka | Dropdown kanan atas | Section kutipan |
|---|---|---|---|
| **A. Series, berjalan** | Day terakhir yang ada datanya | Day 1 ... Day N | "Quotes of the Day" |
| **B. Sesi tunggal** | Sesi itu | Tidak ada | "Highlight Suara Peserta" |
| **C. Series, selesai** | **Rangkuman** | Rangkuman, Day 1 ... Day N | "Highlight Suara Peserta" (seluruh program) |

Di kondisi C, setiap Day tetap bisa dibuka dan tampil persis seperti kondisi A.

## Section standar (tampilan harian, kondisi A)

1. **Header**: logo klien x Rakamin, dropdown hari.
2. **Hero**: pill "Daily Insight · <Program> <Batch>", judul "Feedback Peserta Day X", tanggal dan topik.
3. **01 Quotes of the Day**: kutipan pilihan (maks. 5) dalam bentuk chat bubble. Muncul setelah responden mencapai ambang minimal (default 50% peserta). Sebelum itu tampil status "sedang dikumpulkan".
4. **02 Ringkasan Sesi**: partisipasi (x dari total peserta), Kepuasan keseluruhan, Materi, Tutor, Asisten Tutor, NPS. Setiap kartu menampilkan Δ vs hari sebelumnya.
5. **03 Insight Sesi**: identitas sesi (tutor, asisten tutor, topik), evaluasi per aspek M1–M9, tren harian (grafik garis, bisa disorot per aspek).
   - **Wajib di semua kondisi (A, B, C):** identitas sesi **selalu mencantumkan nama talent** yang terlibat: tutor/trainer, asisten tutor, dan talent lain (fasilitator, co-trainer, dsb.). Ditampilkan sebagai kartu orang (avatar inisial, peran, nama), bukan disembunyikan. Bila nama belum ada di data, kartunya tetap tampil dengan "Belum diisi" supaya kekurangannya terlihat. Label peran mengikuti istilah program (mis. Trainer / Asisten Trainer untuk GoTo).
6. **04 Suara Peserta**: tema Diapresiasi / Saran perbaikan / Ingin diperdalam beserta jumlahnya. Klik tema untuk memfilter tabel jawaban.
7. **05 Jawaban Peserta**: tabel jawaban mentah tanpa nama, dengan pencarian kata kunci dan scroll.
8. **Footer, Kelola data**: hubungkan Google Sheet, salin link untuk talent, upload CSV/XLSX cadangan, reset.

### Aspek penilaian (form standar)

| Kode | Grup | Pernyataan |
|---|---|---|
| M1 | Materi | Materi mudah dipahami |
| M2 | Materi | Alokasi waktu untuk materi ini telah sesuai |
| M3 | Materi | Tujuan pembelajaran terjawab dalam materi |
| M4 | Materi | Metode sesuai dengan tujuan pembelajaran |
| M5 | Tutor | Tutor menguasai materi yang diajarkan |
| M6 | Tutor | Tutor menjawab pertanyaan peserta dengan efektif |
| M7 | Tutor | Tutor dapat menjaga minat belajar saya |
| M8 | Asisten Tutor | Asisten Tutor membantu dalam sesi pembelajaran |
| M9 | Keseluruhan | Kepuasan terhadap sesi secara keseluruhan |
| NPS | - | Kemungkinan merekomendasikan pelatihan (0–10) |

Pertanyaan terbuka: Kesan sesi, Bantuan Tim/Asisten, Perlu diperbaiki, Ingin diperdalam.

## Aturan perhitungan

- **Skor**: rata-rata skala 1–5, dua desimal, format Indonesia (4,25).
- **Penanda peringatan**: skor **< 4,0** ditandai warna peringatan. Angka ini disimpan di config agar mudah diubah.
- **NPS**: %promotor (9–10) − %detraktor (0–6), **ditampilkan dalam persen** (mis. `95%`, `-10%`). NPS **di bawah 60%** diberi warna peringatan (oranye/merah, atau warna kontras dari palet template). Bila form project tidak punya pertanyaan NPS, kartu dan kolom NPS **disembunyikan**.
- **Rangkuman**: rata-rata **semua jawaban** D1–DN (hari dengan responden lebih banyak lebih berpengaruh).

## Dashboard Rangkuman (kondisi C)

Strukturnya sama dengan tampilan harian, datanya gabungan D1–DN, **tanpa pembanding/Δ**.

| # | Section | Isi di rangkuman |
|---|---|---|
| Hero | Judul | "Rangkuman Program", rentang tanggal dan jumlah sesi |
| 01 | Highlight Suara Peserta | Kutipan dari baris `Rangkuman`. Tanpa status "menunggu" |
| 02 | Ringkasan Program | Total jawaban, rata-rata partisipasi per hari, Keseluruhan, Materi, Tutor, Asisten Tutor, NPS |
| 03 | Insight Program | Evaluasi per aspek M1–M9 (gabungan) dan tren harian D1–DN. Klik titik grafik untuk membuka hari itu |
| 04 | Tim Pengajar | Overview semua tutor dan asisten tutor sekaligus (lihat di bawah) |
| 05 | Peta Skor per Hari | Tabel angka M1–M9 × D1–DN. Sel < 4,0 diberi warna peringatan. Klik sel untuk membuka hari itu |
| 06 | Suara Peserta | Tema dari baris `Rangkuman`. Klik tema memfilter tabel di semua hari |
| 07 | Jawaban Peserta | Semua hari, ada kolom Day dan filter hari, dengan scroll |

**Tim Pengajar**: tanpa switcher dan tanpa detail yang bisa dibuka. Tutor dan Asisten Tutor ditampilkan langsung berdampingan. Tiap orang: nama, hari mengajar (D1, D2, ...), skor perannya (Tutor = rata-rata M5–M7, Asisten Tutor = M8) dengan bar perbandingan. Detail per hari dicek lewat dropdown Day.

**Tidak dibawa ke rangkuman**: status "menunggu jawaban", Δ antar hari, kartu identitas sesi satu hari, teks "x dari total peserta".

## Sesi tunggal (kondisi B)

- Tanpa dropdown, tren harian, dan Δ.
- **Tanpa kartu Sorotan Aspek** (dinilai tidak esensial, mengulang Evaluasi per aspek). Insight Sesi cukup dua kartu sejajar dengan tinggi sama: Identitas sesi & talent (kiri) dan Evaluasi per aspek (kanan). Tiap aspek punya bar "% skor 4–5"; label "Tertinggi"/"Terendah" ditempel langsung di aspeknya, hanya bila nilainya unik (tidak seri). Hindari ruang kosong di kartu mana pun.
- Distribusi skor **tidak dipakai** (dinilai sulit dibaca dan memakan tempat).
- Bila jawaban masih masuk, Highlight Suara Peserta menampilkan status "sedang dikumpulkan".
- **Tanpa penomoran Day.** Identitas sesi, subjudul hero, judul halaman, dan kolom sheet memakai **tanggal** (mis. "Kamis, 17 September 2026"), bukan "Day 1". Kolom pertama di semua tab sheet bernama `Tanggal`, bukan `Day`.
- **Highlight = suara mayoritas**, bukan banyak kutipan. Kutipan hanya dari tema Diapresiasi yang disuarakan minimal 30% responden dan membahas talent (trainer, materi, jalannya sesi), satu kutipan per tema, jumlahnya mengikuti tema yang lolos (1 sampai 3). Tema soal tempat, konsumsi, atau panitia tidak dipakai. Panel di sheet bernama `Suara Mayoritas`.
- Panel "Ingin diperdalam" dihapus bila form tidak punya pertanyaan itu.

### Project 1: GoTo Project Management Workshop Batch 1 (kondisi B)

- Sheet: `[Daily Dashboard] GoTo - Project Management Workshop Batch 1` (ID `1zJy-TqS-YDIZ_PqLq-9LwQqx6i3_66qNdfj2C4SHZrk`), dibuat dari tab feedback file xlsx sumber. Pre/Post Test tidak dipakai.
- 19 responden, 17 September 2026. Aspek: M1 Penyampaian trainer, M2 Materi terstruktur, M3 Relevan dengan peran, M4 Sarana pendukung belajar, M5 Kepuasan keseluruhan, NPS (0–10, tampil persen).
- Talent: Trainer **Ricky**, Asisten Trainer **Pandu** (diisi di tab Info Sesi). Total peserta 23 (19 mengisi, partisipasi 83%).
- Kode: `programs/goto-pm-workshop-b1/index.template.html` (sumber), `node build.js` di folder itu menanam aset brand dan menulis `dist/index.html` (folder yang di-deploy). Site Netlify: `goto-pm-insight` (semua batch; dulu `goto-pm-batch1-insight`).
- **Multi-batch:** dropdown batch di header (`CONFIG.batches`), satu sheet per batch. Batch tanpa sheet/jawaban tampil sebagai "belum dimulai" (jadwal, identitas talent, agenda). Default = batch terbaru yang sudah ada jawaban; `?batch=2` membuka batch tertentu. Batch 2: Selasa, 3 November 2026, "Basic Project Management Training" (diambil dari deck pre-reading), sheet belum ada.
- Dashboard membaca sheet secara live bila sheet dibagikan "Anyone with the link: Viewer"; bila tidak, memakai snapshot data yang tertanam di HTML (label "Data tersimpan").

**Brand kit** (dari deck "[Pre-Reading] GoTo Project Management Capability Program", aset di `programs/goto-pm-workshop-b1/brand/`):

| Token | Hex | Pemakaian di deck → web |
|---|---|---|
| green-deep | `#00774C` | Judul dan heading → h1, h2, angka skor |
| green | `#00A367` | Label eyebrow kapital, lingkaran nomor, background cover → aksen utama, tombol |
| green-mid | `#4DBF95` | Garis kartu sorotan → border kartu aktif |
| green-soft | `#BFE8D9` | Garis kartu biasa → border kartu |
| green-tint | `#E6F6F0` | Lingkaran ikon → chip, kode aspek |
| green-wash | `#F2FAF6` | Isi kartu sorotan → surface-2 |
| yellow | `#FFCC29` | Pill "YOU ARE HERE", nomor aktif → pill hero, highlight |
| yellow-soft | `#FFF5D4` | Latar catatan → banner |
| yellow-ink | `#9C7400` | Teks di atas kuning muda |
| ink | `#1C1C1C` | Teks isi |
| ink-2 | `#595959` | Teks sekunder |

- Font: **Rubik** untuk semua teks (heading bold, isi regular); **Montserrat** hanya untuk tagline kecil "Go Learn, Go Further".
- Logo: `logo-goto.png` dan `logo-rakamin.png` (versi putih untuk latar hijau). Hijau terang di logo GoTo tidak dipakai sebagai warna UI.
- Aksen: garis outline bentuk kapsul/stadium di sudut (`bg-light.png`), kartu sudut membulat dengan border hijau muda, nomor dalam lingkaran hijau, label eyebrow kapital hijau, pill kuning untuk penanda.
- Warna peringatan (skor < 4,0) tetap oranye `#D9480F`, karena merah/oranye tidak ada di palet dan hijau tidak boleh dipakai untuk "buruk".

## Sumber data (Google Sheet per project)

Sheet dibagikan "Anyone with the link: Viewer". Tab yang dibaca:

| Tab | Kolom | Fungsi |
|---|---|---|
| Feedback Peserta (atau 00. Daily Feedback Peserta) | Day, pertanyaan M1–M9, NPS, 4 pertanyaan terbuka | Jawaban mentah |
| Info Sesi | Day, Tutor, Asisten Tutor, Topik, Jumlah Peserta | Identitas per hari |
| Insight by Claude | Day, Panel, Tema, Jumlah, Kutipan, Kata Kunci | Tema Suara Peserta dan kutipan (Panel = Quotes of the Day) |
| Quotes of the Day (opsional) | Day, Kutipan, Tema | Kutipan pilihan |

**Konvensi rangkuman**: baris dengan `Day = Rangkuman` di Insight by Claude / Quotes of the Day khusus untuk tampilan Rangkuman. Tampilan Day X hanya membaca baris Day X. Isi insight rangkuman di-generate ulang terpisah (dikerjakan setelah dashboard selesai).

## Yang bervariasi per project (config)

- Nama program, batch, label pill, title halaman
- Status (A / B / C), jumlah hari, tanggal per hari, total peserta default
- ID Google Sheet default
- Logo klien dan Rakamin, background, palet warna, font
- Kunci penyimpanan browser (unik per project)
- Ada/tidaknya NPS dan Asisten Tutor

## Deploy

- Satu file HTML statis per project, deploy ke Netlify (satu site per project, pola `<project>-insight.netlify.app`).

## Asumsi yang masih terbuka

- Satu hari = satu tutor dan satu asisten tutor. Bila ada hari dengan dua tutor, skor M5–M7 tidak bisa dipisah per orang.

### Project 2: BSI Intermediate Business Process Improvement for SDP, Batch 2 & 3 (kondisi C)

- Sheet dashboard (anonim): `[Dashboard L1] BSI - Intermediate Business Process Improvement for SDP (Batch 2 & 3)` (ID `1GTZi3-3GHlL0AfblyN0FxpRV847tumk1-_FSC4LqIXY`). Disalin dari sheet operasional per batch tanpa nama, email, NIP, dan nilai post test. Sheet operasional **jangan** dihubungkan langsung ke dashboard karena memuat data pribadi.
- Kedua batch Rabu, 22 Juli 2026, 30 peserta per batch. Batch 2: Tutor Rendy, Asisten Tutor Prita (23 mengisi). Batch 3: Tutor Nia, Asisten Tutor Dias (30 mengisi).
- Aspek mengikuti tab L1 Analysis klien: Materi & Relevansi (M1, M2, M8), Tutor (M3–M6), Asisten Tutor (M7), Pelaksanaan & Fasilitas (M9, M10), Keseluruhan (M11), NPS skala 1–10.
- Tampilan: Rangkuman (default), Batch 2, Batch 3 lewat switcher di kanan atas. Rangkuman punya section tambahan **Perbandingan Batch & Tim Pengajar**.
- Kode: `programs/bsi-bpi-sdp-b2-b3/`. Data mentah di `data/responses.js`, koding tema di `data/themes.js`, `node data/build-sheet-data.js` memvalidasi dan menulis `data/sheet-data.json`, `node build.js` menanam aset + snapshot ke `dist/index.html`.

## Konvensi baru (berlaku untuk template berikutnya)

- **Tema dirujuk lewat ID responden**, bukan pencocokan kata kunci. Feedback punya kolom `Responden` (mis. `B2-5`), tab Insight punya kolom `Responden` (`B2-5|B3-7`). Jumlah = banyaknya ID, filter tabel memakai ID, Kata Kunci hanya untuk highlight di kolom pertanyaan asal tema.
- Panel **Paling diingat** (bila form punya pertanyaan "topik yang paling diingat") tampil sebagai section **Topik Paling Diingat** berupa ranking bar.
- **Bar per aspek adaptif:** bila hampir semua peserta memberi 4–5 (≥95% di setiap aspek, dihitung dari seluruh data program), bar dan keterangan memakai **% skor 5** supaya aspek tetap terbedakan.
- Skor hanya dibaca bila berupa bilangan bulat, sehingga baris rata-rata di bawah data respons tidak ikut terhitung.
- Desain: hero memakai foto/gradient brand klien, identitas sesi & talent jadi strip di bawah hero, Suara Mayoritas memakai glass callout di atas gradient brand (bentuk G di design system quote).

### Template multi-unit (17 Okt 2026)

- Template `bsi-bpi-sdp-a10` dan `bsi-bpi-sdp-b2-b3` kini satu kode yang sama; perbedaannya hanya `CONFIG`, judul, dan teks sumber. Mendukung N unit (Batch atau Hari), tim pengajar per unit atau satu tim untuk semua, dan NPS opsional (semua elemen NPS hilang bila form tidak punya pertanyaannya).
- Diverifikasi: teks semua tampilan B2-B3 identik dengan versi sebelumnya; A10 identik kecuali nama tutor yang sebelumnya diulang di kepala kolom Perbandingan kini dihilangkan (tim sama, sudah ada di strip identitas). Uji tambahan dengan data sintetis 3 unit tanpa NPS (desktop 1280 px dan mobile 375 px) lulus.
- Pada layar ≤560 px dengan lebih dari 2 unit, kepala kolom Perbandingan diringkas (nama tim disembunyikan, sudah tampil di strip).

### Project 3: BSI Business Process Improvement SDP Angkatan 10 (kondisi C, 2 hari)

- Sheet dashboard (anonim): `[Dashboard L1] BSI - Business Process Improvement SDP Angkatan 10` (ID `1EfH4CX7hlUDpJ7xrY4_gaH4V1j24a-WMZVF-gHrb0B0`), disalin dari `[All Data] ... Angkatan 10 (Responses)` tanpa nama, email, dan skor post test. Kolom unit = `Hari`, ID responden `H1-n` / `H2-n`.
- Hari 1 Senin 14 Sep 2026 (29/29 mengisi), Hari 2 Selasa 15 Sep 2026 (26/29). Tutor Nia, Asisten Tutor Dias untuk kedua hari. 29 peserta.
- Kode: `programs/bsi-bpi-sdp-a10/` (turunan template BSI Batch 2 & 3). `CONFIG.unit` mengatur nama unit (Batch/Hari), `sameTeam` menampilkan satu tim pengajar di Rangkuman, `samePeople` membuat tile partisipasi Rangkuman menghitung pengisian (55 dari 58 = 29 peserta × 2 hari), bukan orang.

### Project 4: BSI Business Process Improvement Mastery (kondisi C, 2 hari)

- Sheet dashboard (anonim): `[Dashboard L1] BSI - Business Process Improvement Mastery` (ID `12aPts5J-P9VcwU7M8orwKkYeQvF6G7mawEd38Zr_JXs`), disalin dari `[All Data] BSI - Business Process Improvement Mastery (Responses)` (ID sumber `1XjgW0Mpgf7rnAtyXqlO7eLpVdjG5KzK2I5UzVKBI40Y`) tanpa nama, email, dan skor. Kolom unit = `Hari`, ID responden `H1-n` / `H2-n`. Belum dibagikan publik (dashboard memakai "Data bawaan" sampai user membagikan "Anyone with the link: Viewer").
- Hari 1 Senin 7 Sep 2026 (25 jawaban), Hari 2 Selasa 8 Sep 2026 (24 jawaban). Tutor Firman, Asisten Tutor Dias untuk kedua hari. **30 peserta** (konfirmasi user; tab Data Peserta di sumber masih 33 karena belum diperbarui), jadi Rangkuman 49 dari 60 pengisian.
- Form sama dengan Angkatan 10 (11 aspek, NPS, 4 pertanyaan terbuka), sehingga seluruh pipeline data disalin dari `programs/bsi-bpi-sdp-a10/`. Angka divalidasi sama persis dengan tab `02. L1 Analysis` klien (rata-rata per aspek dan NPS 68% / 67% per hari).
- Brand: sama dengan program BSI lain (logo Danantara, BSI, Rakamin, latar kota). Slug situs `bsi-bpi-mastery`.
- Suara Mayoritas: Hari 1 tiga tema (materi 10/25, penyampaian 8/25, interaktif 8/25), Hari 2 satu tema (materi 9/24), Rangkuman dua tema (materi 19/49, penyampaian 15/49). Tema "Penyampaian" di Rangkuman lolos ambang 30% dengan selisih tipis (15 dari 49 = 30,6%).
- `data/build-sheet-data.js` kini menerima `kunci` eksplisit pada tema Rangkuman (menimpa kata kunci otomatis yang bisa tercemar tema lain). Bila hanya satu kutipan Suara Mayoritas, kartu dipusatkan dan hurufnya dibesarkan (semua template BSI).

### Revisi Evaluasi per Aspek dan Perbandingan (17 Okt 2026, template BSI)

- Kritik user: terlalu banyak angka (rata-rata kelompok sudah ada di Ringkasan), bar tidak mencerminkan skor (4,81 tampak setengah), kolom Perbandingan miring karena panah ▲ mengubah lebar kolom, dan panah kecil sulit dipetakan.
- Perbaikan: bar = skor pada skala 1–5; hapus rata-rata kelompok dan teks "% skor"; Perbandingan memakai kolom nilai berlebar tetap, nilai tertinggi memakai pil tint dan bar penuh, yang lain dipudarkan, tanpa panah dan tanpa keterangan.
- Berlaku di `bsi-bpi-sdp-b2-b3`, `bsi-bpi-sdp-a10`, `bsi-bpi-mastery`. `goto-pm-workshop-b1` belum diubah.

## Aturan tampilan warna peringatan (17 Okt 2026)

- **Jangan tampilkan keterangan** seperti "oranye bila skor < 4,0 atau NPS < 60%" atau legend "Oranye = perlu perhatian" di dashboard. Warna peringatan cukup muncul pada angkanya.
- Angka NPS memakai warna normal (teal/hijau sesuai brand). Warna peringatan hanya dipakai bila NPS < 60% atau skor < 4,0. Jangan memberi warna aksen (emas/oranye) pada NPS secara default karena terbaca seperti peringatan.
