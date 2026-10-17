# Standar dashboard: kondisi, section, perhitungan

Baca file ini saat membangun atau mengubah dashboard. Aturan singkat yang sering terlewat ada di `SKILL.md`.

## Tiga kondisi (diatur manual di config)

| Kondisi | Default saat link dibuka | Pemilih di kanan atas | Bagian kutipan |
|---|---|---|---|
| **A. Series, berjalan** | Day/unit terakhir yang sudah ada datanya | Day 1 … N (yang belum ada data nonaktif) | "Quotes of the Day" (tampil setelah ≥50% peserta mengisi; sebelum itu status "sedang dikumpulkan") |
| **B. Sesi tunggal** | Sesi itu | Tidak ada (atau pemilih batch bila program punya beberapa batch, batch belum berjalan tampil "Belum dimulai" dengan jadwal, talent, agenda) | "Suara Mayoritas" |
| **C. Series, selesai** | **Rangkuman** | Rangkuman, lalu tiap unit (Batch/Hari) | "Suara Mayoritas" |

Di kondisi C setiap unit tetap bisa dibuka dan tampil seperti kondisi A.

## Section (urutan, penomoran mengikuti yang terlihat)

1. **Header**: logo klien + logo Rakamin, pemilih tampilan di **kanan atas** (bukan di bawah logo pada lebar normal).
2. **Hero**: pill program, judul, subjudul (tanggal, format, jumlah peserta), chip tampilan aktif.
3. **Identitas sesi & talent**: kartu orang (tutor, asisten tutor, talent lain) + tanggal, format/topik, responden. Wajib ada nama; "Belum diisi" bila kosong.
4. **Suara Mayoritas / Quotes of the Day**.
5. **Ringkasan**: partisipasi, kepuasan keseluruhan, skor per kelompok aspek, NPS (persen, bila ada). Δ vs sesi sebelumnya hanya di kondisi A.
6. **Evaluasi per Aspek**: kode aspek (M1…), skor, satu bar yang mewakili skor pada skala 1–5, tag Tertinggi/Terendah hanya bila nilainya unik. Pada Rangkuman ditambah skor per unit. Tanpa rata-rata kelompok di judul kelompok dan tanpa teks "% skor".
7. **Perbandingan** (khusus Rangkuman): unit berdampingan beserta tim pengajarnya, nilai tertinggi ditandai dengan warna (pil tint dan bar penuh, yang lain dipudarkan), satu kalimat catatan faktual.
8. **Topik Paling Diingat** (bila form punya pertanyaannya): ranking bar, klik untuk memfilter tabel.
9. **Suara Peserta**: panel tema (Diapresiasi, Saran perbaikan, Ingin diperdalam bila ada). Klik tema memfilter tabel jawaban.
10. **Jawaban Peserta**: tabel anonim, pencarian, highlight, kolom unit pada Rangkuman, scroll dalam kartu.
11. **Footer + Kelola data**: hubungkan Google Sheet, salin link, reset. Label sumber "Google Sheet" atau "Data bawaan (tanggal)".

Dashboard membaca sheet dashboard anonim lewat endpoint gviz CSV; bila tidak terbaca (belum dibagikan publik), memakai snapshot yang tertanam. Itu perilaku normal, bukan galat.

## Perhitungan

- **Skor**: rata-rata skala 1–5, dua desimal, format Indonesia (4,25). Hanya bilangan bulat yang dibaca sebagai jawaban, supaya baris rata-rata di bawah data respons tidak ikut terhitung.
- **Rangkuman**: rata-rata atas semua jawaban gabungan, bukan rata-rata dari rata-rata unit.
- **Ambang peringatan**: skor < 4,0 dan NPS < 60% (nilai di `CONFIG`). Hanya mewarnai angka. Tidak ada teks keterangan.
- **NPS**: %promotor (9–10) − %detraktor (0–6), ditampilkan sebagai persen. Sembunyikan bila tidak ada pertanyaan NPS.
- **Bar aspek**: lebar = (skor − 1) / 4, jadi skor 4,81 hampir penuh. Aturan lama "% skor 4–5 / % skor 5" dihapus atas permintaan user karena bar tidak mencerminkan skor.
- **Partisipasi**: jumlah jawaban dibanding jumlah peserta yang diberikan user. Bila peserta yang sama mengisi tiap hari (`samePeople`), Rangkuman menghitung pengisian: jawaban dibanding peserta × hari.
- **Ambang Suara Mayoritas**: tema Diapresiasi ≥30% responden pada tampilan itu. Pada Rangkuman, 30% dihitung terhadap seluruh jawaban gabungan.

## Pemetaan pertanyaan

Form berbeda antar program. Jangan memaksa M1–M9 IKDD. Petakan setiap pertanyaan ke kode aspek (M1…Mn) dan kelompok (materi, tutor, asisten tutor, pelaksanaan, keseluruhan), pakai teks header yang dicocokkan huruf kecil (`match`). Catat pemetaan di tab Panduan sheet dashboard. Bila form tidak punya asisten tutor atau NPS, hilangkan kartu dan kolom terkait, jangan menampilkan "–".

## Yang sudah dihapus atas permintaan user (jangan dimunculkan lagi)

- Keterangan atau legend "oranye bila …".
- Kartu "Sorotan Aspek".
- Warna aksen emas atau oranye pada NPS.
- Distribusi skor per nilai (sulit dibaca, memakan tempat).
- Rata-rata kelompok di judul kelompok pada Evaluasi per Aspek, teks "% skor 5" di tiap baris aspek, dan panah ▲ pada Perbandingan (diganti warna). Diterapkan di template BSI (17 Okt 2026); template GoTo masih bentuk lama.
- Switcher atau detail yang bisa dibuka untuk tim pengajar pada Rangkuman.
- Tab, section, atau angka terkait pre-test, post-test, dan kehadiran.
