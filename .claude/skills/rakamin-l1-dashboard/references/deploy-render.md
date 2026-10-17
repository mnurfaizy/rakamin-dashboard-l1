# Repo, build, dan deploy (Render)

## Struktur repo

```
programs/<klien>-<program>/   index.template.html, build.js, brand/, data/ (bila gaya BSI), netlify.toml (sisa)
scripts/build-site.js         membangun semua program dan menyusun site/ (satu sub-path per program)
docs/KONTEKS-DASHBOARD.md     standar + catatan tiap project
README.md                     struktur, build, deploy, cara membuat program baru
render.yaml                   blueprint (satu static site untuk semua program)
```

`dist/`, `site/`, dan `data/sheet-data.json` dihasilkan saat build dan tidak di-commit.

## Menambah program baru ke repo

1. Salin folder program terdekat ke `programs/<klien>-<program>/` dan ubah isinya (lihat alur di `SKILL.md`).
2. Tambahkan satu entri di `PROGRAMS` pada `scripts/build-site.js` (`dir`, `slug` pendek untuk sub-path, `steps` perintah build).
3. Tambahkan skrip `build:<nama>` di `package.json` (dan ke `build:each`).
4. Perbarui tabel program dan sub-path di `README.md`, serta tambahkan bagian project di `docs/KONTEKS-DASHBOARD.md` (sheet, tanggal, talent, keputusan khusus).
5. Jalankan `npm run build`; pastikan `site/<slug>/index.html` ada. Bandingkan hash dengan `programs/<dir>/dist/index.html` (harus identik).
6. Pindai data pribadi (email, NIP) pada berkas yang akan di-commit.
7. Commit lokal. Identitas git bisa belum diset; set **per repo** (`git config user.name/user.email`), bukan global.

## Hosting: satu Render Static Site

Satu situs statis menyajikan semua program: `https://<nama>.onrender.com/<slug>/`. Halaman akar sengaja kosong dan `robots.txt` melarang indeks, supaya tiap klien hanya tahu link miliknya. **Bagikan link per sub-path.**

Pengaturan (dibuat user di dashboard Render, tidak bisa dibuat dari sini):

| Kolom | Isi |
|---|---|
| Jenis | **Static Site** (bukan Web Service) |
| Branch | `main` |
| Root Directory | kosong |
| Build Command | `node scripts/build-site.js` |
| Publish Directory | `site` |
| Header (opsional) | `/*` → `Cache-Control: no-cache` |

Setiap push ke `main` men-deploy ulang. Perubahan data di Google Sheet tampil setelah refresh tanpa deploy.

### Jebakan yang pernah terjadi

- **Dibuat sebagai Web Service**: build sukses lalu gagal dengan "yaml start: command not found" (status 127). Web Service menjalankan Start Command; Static Site tidak. Jenis layanan tidak bisa diubah: hapus, buat ulang sebagai Static Site.
- **Blueprint (`render.yaml`) meminta kartu** untuk verifikasi identitas (otorisasi $1 yang dibatalkan) bahkan untuk situs gratis. Pembuatan Static Site manual dengan nilai yang sama menghindari Blueprint. Dokumentasi Render menyatakan static site gratis; kebijakan verifikasi bisa berubah. Jangan membuat akun berulang-ulang untuk menghindari verifikasi, dan jangan pernah memasukkan data kartu atas nama user.
- Netlify (platform sebelumnya) memakai kredit per deploy dan habis; situs Netlify lama perlu dihapus user setelah situs Render terverifikasi.
- Root Directory harus kosong; bila diisi ke satu program, build gabungan gagal.
- Nama layanan yang sudah dipakai mendapat akhiran acak pada alamatnya. Itu wajar.

## Batas tindakan

- **git push**, deploy, penghapusan situs, dan perubahan akses sheet: minta izin eksplisit user setiap kali, walau izin sebelumnya sudah ada untuk hal lain. Sistem keamanan dapat menolak push yang dianggap mengirim data sensitif; jangan mencari jalan memutar, jelaskan dan biarkan user memutuskan (push sendiri atau mengizinkan).
- Memverifikasi situs live aman dilakukan: buka tiap sub-path, cek logo, angka, dan console.
- Repo berisi logo dan aset klien serta komentar peserta tanpa nama: sarankan repo **private**, dan ingatkan user memeriksa visibilitasnya (tidak bisa diperiksa dari sini).

## Catatan Windows

- `git` menampilkan peringatan "LF will be replaced by CRLF"; tidak berbahaya.
- Direktori kerja shell berubah antar perintah; pakai path absolut.
- `npx @netlify/mcp` dan perintah jaringan kadang gagal sesaat karena DNS; ulangi sekali sebelum menyimpulkan ada masalah.
