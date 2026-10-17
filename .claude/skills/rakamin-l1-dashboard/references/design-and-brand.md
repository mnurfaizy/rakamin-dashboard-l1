# Desain dan brand per klien

Layout standar tetap; yang diganti adalah kulit klien. Tujuannya tampilan yang menarik dan terasa milik klien, bukan sekadar mengganti warna. Template deck klien sering kurang menarik; boleh menambah aksen desain sendiri asalkan mengikuti identitas deck (font, palet, logo).

## Mengambil brand dari PPTX

Kerjakan di folder scratchpad (bukan di dalam proyek), dalam folder baru yang kosong.

1. Buka sebagai zip: `unzip -o -q deck.pptx` ke folder baru.
2. Palet: `ppt/theme/theme*.xml` (skema warna) dan hitung warna yang benar-benar dipakai di slide: `grep -oE 'srgbClr val="[0-9A-Fa-f]{6}"' ppt/slides/*.xml ppt/slideMasters/*.xml | sort | uniq -c | sort -rn`. Warna dominan di slide mengalahkan skema tema bawaan Google Slides.
3. Font: `grep -oE 'typeface="[^"]*"' ppt/slides/*.xml | sort | uniq -c | sort -rn`. Pakai font yang paling banyak dipakai dari Google Fonts; font kedua hanya untuk tagline kecil.
4. Gambar: `ppt/media/`. Lihat setiap kandidat (logo klien, logo mitra, latar, maskot, ilustrasi) dan cek dimensi. Salin yang dipakai ke `programs/<program>/brand/`.
5. Peta kemunculan: `ppt/slides/_rels/*.rels` menunjukkan gambar mana dipakai di slide mana; `ppt/slideLayouts/_rels/` untuk latar layout.
6. Gaya bentuk (sudut membulat, outline kapsul, lingkaran bernomor, label kapital) dibaca dari geometri `prstGeom` dan ukuran/warna isi bentuk di slide contoh.

Tuliskan hasilnya sebagai tabel token di `docs/KONTEKS-DASHBOARD.md` (nama token, hex, pemakaian di deck, pemakaian di web).

## Aturan penerapan

- Token warna di `:root` (deep, utama, tint, wash, aksen, ink). Warna peringatan (`--warn`, oranye bata) tetap, karena hijau tidak boleh berarti "buruk" dan oranye tidak ada di palet klien.
- **Logo Rakamin selalu tampil** bersama logo klien dan mitra klien (mis. Danantara dan BSI). Logo dari deck sering punya margin transparan lebar; potong dengan wadah `overflow:hidden` (kelas `.crop`) dan ukur ulang secara visual.
- Latar: gradien atau gambar dari deck dengan overlay putih agar teks terbaca; aksen pojok bila deck punya (outline kapsul GoTo, kilau bintang BSI). Tambahkan aksen secukupnya, bukan dekorasi acak.
- Font tunggal untuk semua teks; `tabular-nums` untuk angka.
- Aksesibilitas dasar: kontras teks memadai, `:focus-visible`, `prefers-reduced-motion`, tombol memakai elemen `button`.
- Embed semua aset sebagai data URI saat build, supaya hasilnya satu berkas dan tidak bergantung berkas lain. Gambar besar (foto hero) dipakai **sekali** lewat variabel CSS agar ukuran berkas tidak berlipat.

## Bentuk kutipan (design system quote Rakamin)

Pilih bentuk sesuai layout utama, bukan satu bentuk wajib. Jangan mencampur lebih dari dua jenis per halaman (satu utama, sisanya pendukung). Selalu tampilkan sumber ("Peserta" + tema).

| Layout | Bentuk | Batas teks |
|---|---|---|
| Grid kartu 2–3 kolom | A Speech Bubble Light dan B Speech Bubble Brand, selang-seling | ≤180 karakter |
| Hero atau Quote of the Day di tengah | C Spotlight (bubble besar di tengah, tanda kutip emas) | ≤120 karakter |
| Banner horizontal atau ticker | D Badge Pill | ≤90 karakter, 1–2 baris |
| Editorial, ruang putih luas | E Bracket Quote | ≤140 karakter |
| Kolom sempit atau sidebar | F Notch Tab Card | ≤110 karakter |
| Di atas foto atau gradien | G Glass Callout | ≤130 karakter |
| Header section atau slide pembuka | H Sticker Stack | ≤6 kata, 3 baris |

Pengalaman program ini: GoTo memakai bubble Spotlight pada gradien lembut dengan maskot; BSI memakai Glass Callout di atas gradien teal karena brand-nya bergradien dan klien menyukai kesan premium. Bila kutipan lebih panjang dari batas, pilih kutipan lain yang lebih ringkas, jangan memotong tengah kalimat.

## Memeriksa tampilan

- Desktop (sekitar 1280 px) dan mobile (375 px) untuk **setiap view**. Tidak boleh ada scroll horizontal pada halaman (`scrollWidth` = lebar viewport), logo tidak terpotong, kartu sejajar setinggi sama tanpa ruang kosong.
- Uji interaksi: pemilih tampilan, klik tema memfilter tabel dan menyorot teks, pencarian, dialog Kelola data.
- Di `file://` pembacaan Google Sheet terblokir CORS; label sumber akan "Data bawaan". Itu normal. Verifikasi pembacaan live hanya di situs yang sudah di-deploy dan sheet-nya sudah dibagikan.
- Tutup emulasi viewport (kembalikan ke desktop) setelah selesai.
