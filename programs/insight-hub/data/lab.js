// Halaman uji tata letak tiket (/uji-tiket/): data asli + program rekaan bertanda "Contoh",
// supaya GoTo dan BSI punya lebih dari 3 program. Angka contoh bukan data feedback sungguhan.
const SAMPLES = {
  goto: [
    ['Contoh · Leadership Batch 1', 'goto-pm', '#0F172A', '#FFFFFF', '2026-08-20', '20 Agu 2026', 4.62, 48],
    ['Contoh · Data Literacy Batch 2', 'hero-tilt', '#00789A', '#FFFFFF', '2026-07-14', '14 Jul 2026', 4.41, 36],
    ['Contoh · Product Thinking', 'hero-pill', '#C23B25', '#FFFFFF', '2026-06-03', '3 Jun 2026', 3.92, 22],
    ['Contoh · Agile Fundamentals', 'hero-arch', '#FFB700', '#2B1D00', '2026-05-12', '12 Mei 2026', 4.70, 30],
  ],
  bsi: [
    ['Contoh · BPI SDP Batch 1', 'bsi-bpi-sdp-b2-b3', '#003D79', '#FFFFFF', '2026-06-18', '18 Jun 2026', 4.66, 28],
    ['Contoh · Service Excellence', 'bsi-bpi-mastery', '#00949E', '#FFFFFF', '2026-05-21', '21 Mei 2026', 4.52, 40],
  ],
};

module.exports = DATA => {
  const programs = [...DATA.programs];
  for (const [client, list] of Object.entries(SAMPLES)) {
    list.forEach(([title, photo, color, ink, sortDate, date, score, responses], k) => {
      programs.push({
        id: `lab-${client}-${k}`, client, status: 'selesai', path: '#', photo,
        fullName: `${title} (data contoh)`, label: 'Contoh · Uji tata letak', title, meta: 'Data rekaan, bukan feedback asli',
        date, sortDate, color, ink, responses, participants: responses, score, nps: 70,
      });
    });
  }
  return { ...DATA, programs, lab: true, ticketLayout: 'auto' };
};
