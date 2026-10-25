// Data L1 Insight Hub: satu entri per klien dan per program.
// Angka (jawaban, kepuasan, NPS) disalin dari tampilan Rangkuman / sesi tiap dashboard per 18 Okt 2026.
// Kepuasan = skor "Kepuasan keseluruhan" (skala 1-5) di dashboard program, rata-rata dari semua jawaban gabungan.
// Kutipan = Suara Mayoritas / Quotes of the Day yang tampil di dashboard program, persis seperti jawaban peserta.
// Program dengan `live` membaca ulang sheet dashboard-nya saat halaman dibuka (jawaban dan kepuasan bertambah harian).
// clientLink: link client view per program (DUMMY, belum aktif; ganti dengan link asli setelah data diolah).
// accent: warna aksen kartu klien di halaman Client view (/client-view/); logo diambil dari brand/.
module.exports = {
  asOf: '18 Okt 2026',
  // Klien dengan lebih dari 3 program: strip kupon geser (A) di layar lebar, 3 terbaru + tombol 'Tampilkan lainnya' (B) di HP.
  ticketLayout: 'auto',
  clients: [
    { id: 'goto', accent: '#6F8C83', name: 'GoTo', sub: 'GoTo Gojek Tokopedia', logo: 'logo-goto.png', color: '#00AA13', tint: '#E7F6E9' },
    { id: 'bsi', accent: '#B3A3E0', name: 'BSI', sub: 'Bank Syariah Indonesia', logo: 'logo-bsi.png', logoView: 'inset(27.8% 3.4% 28% 3.6%)', color: '#00949E', tint: '#E0F4F2' },
    { id: 'dd', accent: '#EE9A5B', name: 'Dompet Dhuafa', sub: 'Institut Kemandirian Dompet Dhuafa', logo: 'logo-ik.png', color: '#0F447A', tint: '#E6EEF7' },
  ],
  programs: [
    {
      id: 'goto-pm', clientLink: 'l1.rakamin.com/goto/pm-batch-1', client: 'goto', status: 'selesai', path: '/goto-pm/?batch=1', photo: 'goto-pm',
      fullName: 'GoTo - Project Management Capability Program (Batch 1 - Basic)',
      label: 'GoTo · Capability Program', title: 'Project Management Batch 1', meta: 'Basic · 1 hari · 23 peserta',
      date: '17 Sep 2026', sortDate: '2026-09-17',
      color: '#FFCC29', ink: '#2B1D00',
      responses: 19, participants: 23, score: 4.37, nps: 47,
      quote: { text: 'the activity create some canvas project is helpful', tag: '17 Sep', theme: 'Aktivitas hands-on, game, dan presentasi antar tim' },
    },
    {
      id: 'goto-pm-b2', clientLink: 'l1.rakamin.com/goto/pm-batch-2', client: 'goto', status: 'segera', path: '/goto-pm/?batch=2',
      fullName: 'GoTo - Project Management Capability Program (Batch 2)',
      label: 'GoTo · Capability Program', title: 'Project Management Batch 2',
      note: 'Basic Project Management Training mulai 3 Nov 2026. Angka muncul di sini setelah feedback pertama masuk.',
      date: '3 Nov 2026', sortDate: '2026-11-03',
      color: '#ECE7FA', ink: '#3B2F75',
    },
    {
      id: 'gojek-dk', clientLink: 'l1.rakamin.com/goto/magang-driver-kids', client: 'goto', status: 'selesai', path: '/gojek-magang-driver-kids/', photo: 'goto-driver-kids',
      fullName: "GoTo - Driver's Kids Job Acceleration Program : Magang di Kantor Gojek",
      label: "GoTo · Driver's Kids", title: 'Magang di Kantor Gojek', meta: 'Job Acceleration · 2 hari · 27 peserta',
      date: '29–30 Sep 2026', sortDate: '2026-09-30',
      color: '#00850F', ink: '#FFFFFF',
      responses: 52, participants: 54, score: 4.76, nps: 79,
      quote: { text: 'mentor yang sangat bagus dan cara berbicara yang mudah dipahami', tag: 'Day 3', theme: 'Penyampaian jelas, terstruktur, dan interaktif' },
    },
    {
      id: 'bsi-b2-b3', clientLink: 'l1.rakamin.com/bsi/bpi-sdp-batch-2-3', client: 'bsi', status: 'selesai', path: '/bsi-bpi-sdp-batch-2-3/', photo: 'bsi-bpi-sdp-b2-b3',
      fullName: 'BSI - Business Process Improvement SDP Batch 2 dan 3',
      label: 'BSI · SDP', title: 'Business Process Improvement SDP Batch 2 & 3', meta: '2 batch · 1 hari · 60 peserta',
      date: '22 Jul 2026', sortDate: '2026-07-22',
      color: '#00766F', ink: '#FFFFFF',
      responses: 53, participants: 60, score: 4.75, nps: 85,
      quote: { text: 'Materi disampaikan dengan jelas, sistematis, dan mudah dipahami.', tag: 'Batch 3', theme: 'Penyampaian materi jelas dan mudah dipahami' },
    },
    {
      id: 'bsi-a10', clientLink: 'l1.rakamin.com/bsi/bpi-sdp-angkatan-10', client: 'bsi', status: 'selesai', path: '/bsi-bpi-sdp-angkatan-10/', photo: 'bsi-bpi-sdp-a10',
      fullName: 'BSI - Business Process Improvement SDP Angkatan 10',
      label: 'BSI · SDP', title: 'Business Process Improvement SDP Angkatan 10', meta: 'Workshop 2 hari · 29 peserta',
      date: '14–15 Sep 2026', sortDate: '2026-09-15',
      color: '#F7AC3B', ink: '#3A2600',
      responses: 55, participants: 58, score: 4.75, nps: 82,
      quote: { text: 'menjelaskan dengan baik, detail dan mudah dimengerti', tag: 'Hari 1', theme: 'Penyampaian jelas dan tutor menguasai materi' },
    },
    {
      id: 'bsi-mastery', clientLink: 'l1.rakamin.com/bsi/bpi-mastery', client: 'bsi', status: 'selesai', path: '/bsi-bpi-mastery/', photo: 'bsi-bpi-mastery',
      fullName: 'BSI - Business Process Improvement Mastery',
      label: 'BSI · Mastery', title: 'Business Process Improvement Mastery', meta: 'Workshop 2 hari · 30 peserta',
      date: '7–8 Sep 2026', sortDate: '2026-09-08',
      color: '#1E293B', ink: '#FFFFFF',
      responses: 49, participants: 60, score: 4.57, nps: 67,
      quote: { text: 'Materi sesuai kebutuhan BSI saat ini', tag: 'Hari 2', theme: 'Materi bagus, sesuai, dan relevan dengan pekerjaan' },
    },
    {
      id: 'ikdd-b1', clientLink: 'l1.rakamin.com/dompet-dhuafa/sms-batch-1', client: 'dd', status: 'selesai', path: '/ikdd-sms-batch-1/', photo: 'ikdd-sms-b1',
      fullName: 'Dompet Dhuafa - Digital Workforce Acceleration Program Batch 1: Social Media Specialist',
      label: 'DD · Digital Workforce', title: 'Social Media Specialist Batch 1', meta: 'Bootcamp 10 hari · 19 peserta',
      date: '15–28 Jul 2026', sortDate: '2026-07-28',
      color: '#0F447A', ink: '#FFFFFF',
      responses: 171, participants: 190, score: 4.38, nps: 92,
      quote: { text: 'Pembahasan materi kali ini sangat seru karena membahas strategi pembuatan konten dari tahap awal hingga akhir.', tag: 'Day 3', theme: 'Materi bermanfaat dan menambah wawasan' },
    },
    {
      id: 'ikdd-b2', clientLink: 'l1.rakamin.com/dompet-dhuafa/sms-batch-2', client: 'dd', status: 'berjalan', path: '/ikdd-sms-batch-2/', photo: 'ikdd-sms-b2',
      fullName: 'Dompet Dhuafa - Digital Workforce Acceleration Program Batch 2: Social Media Specialist',
      label: 'DD · Digital Workforce', title: 'Social Media Specialist Batch 2', meta: 'Bootcamp 10 hari · 20 peserta',
      date: '14–27 Okt 2026', sortDate: '2026-10-27',
      color: '#1668AD', ink: '#FFFFFF',
      responses: 55, participants: 60, score: 4.22, nps: 98, daysDone: 3, totalDays: 10, perDay: 20,
      quote: { text: 'Woww full praktek, seru walaupun menguras otak', tag: 'Day 3', theme: 'Praktik full, seru walau menguras otak' },
      live: { sheetId: '1ASi1XhjGn7wb-JKlzkFuQmVJ3YHQZpsoPax_1x8o2wY', tabs: ['Feedback Peserta', '00. Daily Feedback Peserta'] },
    },
  ],
  // Foto hero (kolase kanan atas), dari folder dokumentasi program.
  hero: {
    arch: { photo: 'hero-arch', alt: 'Peserta GoTo Project Management Batch 1 berfoto bersama di taman' },
    tilt: { photo: 'hero-tilt', alt: 'Peserta GoTo Project Management menyusun kanvas proyek dengan sticky notes' },
    pill: { photo: 'hero-pill', alt: 'Peserta Magang di Kantor Gojek berdiskusi di meja bundar' },
    quoteFrom: 'gojek-dk',
  },
};
