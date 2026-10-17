# Detail kecil yang sering terlewat

Keputusan dan koreksi kecil dari user selama pengerjaan. Cek daftar ini saat tahap 6 (bangun) dan 7 (verifikasi). Tiap butir menyebut alasannya supaya bisa dipakai menimbang kasus baru.

## Tata letak

- **Tidak ada sel grid yang kosong.** Bila jumlah item ganjil dalam grid dua kolom (strip identitas pada layar sedang, kartu tim), item terakhir dibuat melebar penuh: `.grid > :last-child:nth-child(odd) { grid-column: 1 / -1 }`. Ruang kosong terbaca sebagai desain yang belum selesai.
- **Strip tim per unit** (tiap batch punya tutor berbeda): tiap tim menjadi panel yang mengisi kolomnya, berisi dua chip sama lebar dengan nama di atas dan peran di bawah (bukan "Nama Peran" sebaris yang tidak mengisi lebar).
- **Dua kartu berdampingan harus setinggi sama dan sama-sama penuh.** Bila satu sisi lebih pendek, tinggikan elemen yang bisa diskalakan (grafik) atau pindahkan kartu yang redundan, jangan biarkan kosong.
- **Satu kutipan Suara Mayoritas / Quotes of the Day**: kartu kaca dipusatkan (lebar maks ±800 px), huruf lebih besar dan rata tengah. Kartu selebar penuh dengan kalimat pendek terlihat kosong.
- **Judul bagian tanpa keterangan tambahan** bila keterangan itu cuma menjelaskan ambang atau legenda.
- Odd-one-out lain: kolom nilai Perbandingan berlebar tetap, tidak berubah ikut isi (penyebab bar terlihat miring).

## Logo dan brand

- **Logo harus seimbang secara visual**, bukan sekadar sama tinggi. Ukur kotak artwork sebenarnya (bounding box piksel non-transparan pada kanvas) karena logo deck punya margin transparan lebar; logo Rakamin pernah tampak kecil karena artwork-nya hanya ±11 px dari 30 px yang ditetapkan. Potong semua logo dengan `.crop` ke artwork, lalu setel supaya kesan bobotnya sama (logo lebar dan tipis boleh lebih lebar, logo padat lebih kecil).
- Ukuran logo memakai variabel skala (`--k`) agar bisa dikecilkan di mobile tanpa mengubah rasio.
- Aset deck klien yang sudah ada di dashboard lain (logo, latar) boleh diambil dari HTML yang sudah di-deploy (data URI) bila deck aslinya tidak ada.

## Data dan angka

- **Jumlah peserta dari user menang atas sheet.** Sheet sumber sering belum diperbarui (mis. user bilang 30, sheet 33). Pakai angka user dan catat selisihnya di tab Panduan dan `docs/KONTEKS-DASHBOARD.md`.
- **Partisipasi di atas 100% dibiarkan apa adanya** (mis. 20 jawaban dari 19 peserta) dan dicatat di dokumen; jangan dipotong atau diam-diam diubah.
- **Hanya rentang hari yang diminta** yang masuk (mis. Day 1–10 saja, Day 18 diabaikan walau ada di sheet).
- **Hitung ulang angka dan cocokkan dengan tab analisis klien** (rata-rata per aspek, per kelompok, NPS). Selisih harus nol; bila tidak, ada salah baca kolom. Catat hasilnya di dokumen project.
- **Nama tutor tiap hari dari silabus.** Bila ada hari yang kosong di sheet ringkasan, ikuti silabus atau tanyakan; jangan dikarang. Tutor lebih dari satu per hari ditampilkan sebagai kartu terpisah.
- **Kata kunci tema pada Rangkuman** diberikan eksplisit (`kunci`) bila kata kunci otomatis dari tema unit bisa tercemar tema lain (mis. tema "Fishbone" ikut menyorot "pareto"). Kata kunci hanya untuk highlight, jumlah tema tetap dari ID.
- **Label tema Rangkuman** boleh sedikit berbeda dari label unit, tetapi setiap ID di Rangkuman harus ada di tema yang sama pada unitnya (validasi skrip).

## Verifikasi di browser

- **Selalu kembalikan viewport ke desktop** setelah menguji mobile; emulasi tertinggal mengacaukan pengecekan berikutnya.
- **Tunggu animasi gulir selesai** sebelum screenshot (gunakan `scrollTo` dengan `behavior: 'instant'` atau tunggu ±1 detik), kalau tidak hasilnya terpotong di tengah gulir.
- **`history.replaceState` dibungkus try/catch.** Di pratinjau `data:`/`file:` ia melempar galat dan menghentikan render sehingga pemilih hari terlihat "mati".
- **Galat CORS ke Google Sheet di `file://` itu normal** (halaman jatuh ke snapshot). Pembacaan live hanya bisa dibuktikan setelah deploy dan sheet dibagikan publik.
- Uji **semua view** (Rangkuman, tiap hari, hari tanpa kutipan), klik satu tema lalu cocokkan jumlah baris tabel dengan angka di chip, dan cek `scrollWidth` = lebar viewport di 375 px.
- Uji gerbang (mis. 50%) dengan salinan sementara yang ambangnya dinaikkan, lalu **hapus salinan itu** sebelum commit.

## Alamat, repo, dan izin

- **Nama sub-path**: huruf kecil, tanda hubung, pola `<klien>-<program>-<unit>` (`bsi-bpi-sdp-batch-2-3`, `ikdd-sms-batch-1`). URL Render peka huruf besar-kecil, jadi hindari huruf besar. Mengganti nama sub-path mematikan link lama; tanyakan apakah link sudah dibagikan.
- **Bangun ulang `site/` dan pastikan build semua program lulus sebelum commit**; jangan commit `site/`, `dist/`, atau `sheet-data.json`.
- **Pindai data pribadi** (email, NIP, nama peserta) pada berkas yang akan di-commit, termasuk CSV yang diunggah ke Drive.
- **Push selalu menunggu izin eksplisit untuk push itu**, dan jelaskan bahwa push men-deploy ulang semua dashboard. Izin untuk satu push tidak berlaku untuk push berikutnya. Setelah push, jangan mengaku situs sudah benar; sebutkan apa yang perlu dicek di alamat Render.
- **Sheet dashboard anonim dibuat hanya bila diminta atau sudah menjadi bagian alur yang user setujui**, dan tidak dibagikan publik tanpa izin. Sampai dibagikan, dashboard memakai "Data bawaan".

## Cara bekerja dengan user

- Kritik dari tangkapan layar biasanya menyangkut **penyebab visual yang bisa diukur** (lebar kolom, tinggi artwork, sel kosong). Ukur dulu di browser sebelum mengubah CSS.
- Perubahan yang bersifat aturan umum (bukan hanya satu program) diterapkan ke **semua template terkait** atau dicatat jelas sebagai "belum diterapkan di X" di dokumen dan di akhir jawaban.
- Tanya hanya keputusan yang benar-benar milik user (jumlah peserta, bentuk perbandingan, desain acuan); pilihan yang punya default wajar dikerjakan dan dilaporkan.
