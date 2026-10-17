// Koding tema oleh Claude dari jawaban terbuka (responses.js). Nomor = urutan responden per hari (1-based).
// field: baik (bagian paling bermanfaat, dipertahankan) | saran (perubahan atau perbaikan).
// Jawaban tanpa isi ("Tidak ada", "Sudah baik", "-") tidak dijadikan tema.
// quote: [nomor, teks persis] untuk Suara Mayoritas (tema Diapresiasi >= 30% responden; bila tidak ada, tema terbanyak).
module.exports = {
  d2: {
    baik: [
      { tema: 'Cara berpikir root cause dan problem solving', rows: [1, 8, 14, 15, 17, 20, 21, 25, 26], kunci: ['root cause', 'akar masalah', 'akar permasalahan', 'problem solving', 'problem solve', 'berpikir', 'berfikir', 'menyelesaikan masalah', 'mengobservasi masalah'],
        quote: [8, 'memiliki problem solving yang lebih baik agar tidak salah mengambil langkah'] },
      { tema: 'Penyampaian jelas, terstruktur, dan interaktif', rows: [5, 9, 10, 11, 12, 16, 17, 24], kunci: ['materi yang jelas', 'terstruktur', 'rapih', 'interaktif', 'komunikasi dua arah', 'pemaparan materi', 'penyampaian materi', 'lebih aktif'],
        quote: [12, 'Penyampaian materi yang interaktif sehingga mudah diingat'] },
      { tema: 'Diskusi kelompok dan studi kasus (FGD)', rows: [2, 4, 6, 10, 19, 22, 25], kunci: ['fgd', 'diskusi', 'kerjasama tim', 'study case', 'dengan tim', 'diskusi team'] },
      { tema: 'Presentasi, review, dan feedback dari trainer', rows: [3, 4, 6, 13], kunci: ['feedback', 'presentasi', 'review', 'apresiasi', 'sharing'] },
      { tema: 'Relevan untuk dunia kerja dan magang', rows: [16, 18, 20], kunci: ['dunia kerja', 'magang', 'dunia pekerjaan', 'profesional'] },
      { tema: 'Suasana seru dan menyenangkan', rows: [7, 19], kunci: ['fun', 'super fun', 'bermanfaat'] },
    ],
    saran: [
      { tema: 'Tata letak dan rotasi tempat duduk', rows: [6, 20], kunci: ['tata letak', 'duduk'] },
      { tema: 'Pendalaman materi', rows: [16], kunci: ['kedalaman', 'dipertahankan'] },
      { tema: 'Variasi contoh kasus', rows: [23], kunci: ['contoh kasus'] },
    ],
  },
  d3: {
    baik: [
      { tema: 'Materi terstruktur dan penyampaian jelas, menarik', rows: [3, 5, 6, 7, 12, 15, 16, 19, 23], kunci: ['to the point', 'menyenangkan', 'komunikasi dua arah', 'terstruktur', 'menarik', 'cara penyampaian', 'mentor', 'mudah dipahami', 'lugas', 'sesinya'],
        quote: [12, 'mentor yang sangat bagus dan cara berbicara yang mudah dipahami'] },
      { tema: 'Berpikir kritis, problem solving, dan percaya diri', rows: [9, 11, 14, 17, 18, 20, 22, 24], kunci: ['problem solving', 'memecahkan masalah', 'pemecahan masalah', 'solusi', 'akar suatu masalah', 'percaya diri', 'berpikir', 'befikir', 'proses berpikir'],
        quote: [17, 'memecahkan masalah dengan cara yang terstruktur dan membuat menjadi lebih percaya diri didepan orang banyak'] },
      { tema: 'Komunikasi ide yang ringkas (3 slide, Minto Pyramid)', rows: [2, 8, 13, 14, 17, 20], kunci: ['3 slide', 'slide', 'minto', 'pyramid', 'ringkas', 'poin ringkas', 'terstruktur'] },
      { tema: 'Presentasi dan umpan balik', rows: [4, 14, 26], kunci: ['presentasi', 'umpan balik', 'feedback'] },
      { tema: 'Suasana hangat dan aman (safe space)', rows: [16, 21, 23], kunci: ['safe space', 'hangat', 'ice breaking'] },
      { tema: 'Kerja sama tim dan komunikasi', rows: [9, 18], kunci: ['kerja sama tim', 'bekerja sama', 'kebersamaan', 'berkomunikasi', 'communication'] },
      { tema: 'Aktivitas keliling Blok M', rows: [25], kunci: ['blok m'] },
    ],
    saran: [
      { tema: 'Posisi duduk dan jarak ke layar', rows: [3, 23], kunci: ['posisi duduk', 'tempat duduk', 'layar'] },
      { tema: 'Pendalaman materi', rows: [7], kunci: ['pendalaman', 'pengembangan'] },
      { tema: 'Tempo lebih pelan, perhatian per peserta', rows: [20], kunci: ['pelan pelan', 'satu persatu'] },
    ],
  },
  rangkuman: {
    baik: [
      { tema: 'Cara berpikir root cause, problem solving, dan percaya diri', kunci: ['root cause', 'akar masalah', 'akar permasalahan', 'akar suatu masalah', 'problem solving', 'problem solve', 'memecahkan masalah', 'berpikir', 'berfikir', 'befikir', 'percaya diri'],
        from: { d2: [1, 8, 14, 15, 17, 20, 21, 25, 26], d3: [9, 11, 14, 17, 18, 20, 22, 24] },
        quote: ['d2', 8, 'memiliki problem solving yang lebih baik agar tidak salah mengambil langkah'] },
      { tema: 'Penyampaian jelas, terstruktur, dan interaktif', kunci: ['materi yang jelas', 'terstruktur', 'rapih', 'interaktif', 'komunikasi dua arah', 'penyampaian materi', 'cara penyampaian', 'mentor', 'mudah dipahami', 'to the point', 'menyenangkan'],
        from: { d2: [5, 9, 10, 11, 12, 16, 17, 24], d3: [3, 5, 6, 7, 12, 15, 16, 19, 23] },
        quote: ['d3', 12, 'mentor yang sangat bagus dan cara berbicara yang mudah dipahami'] },
      { tema: 'Diskusi kelompok dan kerja sama tim', kunci: ['fgd', 'diskusi', 'kerjasama tim', 'kerja sama tim', 'bekerja sama', 'study case', 'kebersamaan'],
        from: { d2: [2, 4, 6, 10, 19, 22, 25], d3: [9, 18] } },
      { tema: 'Presentasi, review, dan umpan balik trainer', kunci: ['feedback', 'umpan balik', 'presentasi', 'review', 'apresiasi', 'sharing'],
        from: { d2: [3, 4, 6, 13], d3: [4, 14, 26] } },
      { tema: 'Komunikasi ide yang ringkas (3 slide, Minto Pyramid)', kunci: ['3 slide', 'slide', 'minto', 'pyramid', 'ringkas'],
        from: { d3: [2, 8, 13, 14, 17, 20] } },
      { tema: 'Suasana hangat dan menyenangkan', kunci: ['safe space', 'hangat', 'ice breaking', 'fun', 'super fun'],
        from: { d2: [7, 19], d3: [16, 21, 23] } },
      { tema: 'Relevan untuk dunia kerja dan magang', kunci: ['dunia kerja', 'magang', 'dunia pekerjaan', 'profesional'],
        from: { d2: [16, 18, 20] } },
      { tema: 'Aktivitas keliling Blok M', kunci: ['blok m'],
        from: { d3: [25] } },
    ],
    saran: [
      { tema: 'Tata letak, rotasi, dan jarak tempat duduk ke layar', kunci: ['tata letak', 'duduk', 'layar'],
        from: { d2: [6, 20], d3: [3, 23] } },
      { tema: 'Pendalaman materi', kunci: ['kedalaman', 'pendalaman', 'pengembangan'],
        from: { d2: [16], d3: [7] } },
      { tema: 'Variasi contoh kasus', kunci: ['contoh kasus'], from: { d2: [23] } },
      { tema: 'Tempo lebih pelan, perhatian per peserta', kunci: ['pelan pelan', 'satu persatu'], from: { d3: [20] } },
    ],
  },
};
