document.addEventListener('DOMContentLoaded', () => {
    const riskTableBody = document.getElementById('risk-table-body');
    const addRiskForm = document.getElementById('add-risk-form');
    
    // Navigation
    const showRiskListBtn = document.getElementById('show-risk-list-btn');
    const showAddRiskBtn = document.getElementById('show-add-risk-btn');
    const riskListContainer = document.getElementById('risk-list-container');
    const addRiskContainer = document.getElementById('add-risk-container');

    // Matriks Analisis Risiko berdasarkan referensi (P, D) -> Skor
    const riskMatrix = {
        // Dampak (kolom)
        // 1   2   3   4   5
        // Probabilitas (baris)
        1: [1,  3,  5,  8, 20], // Baris 1
        2: [2,  7, 11, 13, 21], // Baris 2
        3: [4, 10, 14, 17, 22], // Baris 3
        4: [6, 12, 16, 19, 24], // Baris 4
        5: [9, 15, 18, 23, 25], // Baris 5
    };

    const getRiskScore = (prob, impact) => {
        if (prob >= 1 && prob <= 5 && impact >= 1 && impact <= 5) {
            // Mengurangi 1 karena array index dimulai dari 0
            return riskMatrix[prob][impact - 1];
        }
        return 0; // default value
    };

    // Data awal dari file Rangkuman Identifikasi Risiko 2025
    const initialRisks = [
        { id: 1, uraianProses: "Subbag Umum", pernyataanRisiko: "Revisi DIPA terhadap kelebihan penggunaan dana Sarana dan Prasarana tidak dilakukan secara optimal", penyebabDampak: "Penyebab: Keterlambatan melakukan revisi DIPA. Dampak: Penyerapan anggaran tidak maksimal", kategoriRisiko: "Risiko Kepatuhan", sumberRisiko: "Internal", probabilitas: 2, dampak: 3, pengendalian: "Perlunya pengawasan dari KPA, PPK, Kasubag Umum", responRisiko: "Mengurangi Risiko", prioritas: 1 },
        { id: 2, uraianProses: "Subbag Umum", pernyataanRisiko: "Usulan pengadaan sarana dan prasarana Satker melalui pengisian RKBMN dan iPLAN tidak lengkap", penyebabDampak: "Penyebab: Penyusunan RAB dan Penawaran dari rekanan yang proses mendapatkannya sulit. Dampak: Pengadaan barang dan jasa terhambat", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 1, dampak: 4, pengendalian: "Perlunya pengawasan dari KPA, PPK, Kasubag Umum", responRisiko: "Mengurangi Risiko", prioritas: 2 },
        { id: 3, uraianProses: "Subbag Umum", pernyataanRisiko: "Penyusunan laporan keuangan terlambat", penyebabDampak: "Penyebab: Proses input data persediaan dan SIMAK belum selesai dilakukan. Dampak: Laporan keuangan tidak selesai tepat waktu", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 1, dampak: 4, pengendalian: "Perlunya pengawasan dari KPA, PPK, Kasubag Umum", responRisiko: "Mengurangi Risiko", prioritas: 3 },
        { id: 4, uraianProses: "Subbag Umum", pernyataanRisiko: "Pelanggaran terhadap aturan disiplin PNS PP Nomor 94 Tahun 2021", penyebabDampak: "Penyebab: PNS bersangkutan kurang memaknai PP Nomor 94 Tahun 2021. Dampak: PNS bersangkutan dikenakan sanksi sesuai PP Nomor 94 Tahun 2021", kategoriRisiko: "Risiko Kepatuhan", sumberRisiko: "Internal", probabilitas: 1, dampak: 3, pengendalian: "Perlunya pengawasan dari KPA, PPK, Kasubag Umum", responRisiko: "Mengurangi Risiko", prioritas: 4 },
        { id: 5, uraianProses: "Subbag Umum", pernyataanRisiko: "Pengelolaan arsip kurang optimal", penyebabDampak: "Penyebab: Kurangnya pemahaman pegawai tentang pengelolaan arsip. Dampak: Pengelolaan arsip tidak sesuai standar", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Pelatihan pegawai tentang pengelolaan arsip", responRisiko: "Mengurangi Risiko", prioritas: 5 },
        { id: 6, uraianProses: "Tim VHTS", pernyataanRisiko: "Rekapitulasi identifikasi daftar sampel dan assignment sampel tidak sesuai target", penyebabDampak: "Penyebab: Tim VHTS Kabupaten kesulitan dalam mengidentifikasi dan mengalokasi. Dampak: Pembagian tugas lapangan kurang efektif, pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Dilaksanakan lebih awal", responRisiko: "Menerima Risiko", prioritas: 6 },
        { id: 7, uraianProses: "Tim VHTS", pernyataanRisiko: "Terjadinya kekurangan instrumen atau instrumen yang dikirim tidak sesuai", penyebabDampak: "Penyebab: Kelalaian Tim VHTS Kabupaten. Dampak: Proses pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Pengecekan ulang sebelum instrumen dikirim", responRisiko: "Menerima Risiko", prioritas: 7 },
        { id: 8, uraianProses: "Tim VHTS", pernyataanRisiko: "Pelaksanaan pelatihan petugas kurang optimal", penyebabDampak: "Penyebab: Pelatihan dilakukan secara online. Dampak: Petugas tidak memahami materi pelatihan secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Membebaskan petugas dari berbagai tugas di saat pengajaran", responRisiko: "Menerima Risiko", prioritas: 8 },
        { id: 9, uraianProses: "Tim VHTS", pernyataanRisiko: "Progress pendataan tidak sesuai target", penyebabDampak: "Penyebab: Responden sulit ditemui. Dampak: Pendataan terlambat selesai", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Eksternal", probabilitas: 2, dampak: 3, pengendalian: "Reminder pelaksanaan pendataan", responRisiko: "Menerima Risiko", prioritas: 9 },
        { id: 10, uraianProses: "Tim VHTS", pernyataanRisiko: "Evaluasi kualitas data kurang optimal", penyebabDampak: "Penyebab: Kekurangan waktu. Dampak: Data tidak berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal dan Eksternal", probabilitas: 2, dampak: 3, pengendalian: "Membuat anomali tambahan untuk memeriksa kewajaran data", responRisiko: "Mengurangi Risiko", prioritas: 10 },
        { id: 11, uraianProses: "Tim VHTS", pernyataanRisiko: "Pelaksanaan rilis data kurang optimal", penyebabDampak: "Penyebab: Pusat terlambat dalam menshare data. Dampak: Ditemukan kesalahan, typo, dan sebagainya", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 5, dampak: 1, pengendalian: "Membagi tugas dalam penyusunan BRS dan Bahan Tayang Rilis", responRisiko: "Menerima Risiko", prioritas: 11 },
        { id: 12, uraianProses: "Tim VHTS", pernyataanRisiko: "Penyusunan publikasi kurang optimal", penyebabDampak: "Penyebab: Beban pekerjaan yang banyak. Dampak: Publikasi kurang berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Mengatur jadwal penyusunan publikasi pada waktu yang kurang sibuk", responRisiko: "Menerima Risiko", prioritas: 12 },
        { id: 13, uraianProses: "Tim PSS", pernyataanRisiko: "Kurangnya pemahaman materi ketua tim pembina", penyebabDampak: "Penyebab: Pelatihan dilakukan secara online. Dampak: Ketua tim Pembina tidak memahami materi pelatihan secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Membebaskan petugas dari berbagai tugas di saat pengajaran", responRisiko: "Mengurangi Risiko", prioritas: 13 },
        { id: 14, uraianProses: "Tim PSS", pernyataanRisiko: "Kurangnya pemahaman materi anggota tim pembina", penyebabDampak: "Penyebab: Keterbatasan waktu internalisasi. Dampak: Anggota tim Pembina tidak memahami materi pelatihan secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Melaksanakan internalisasi di waktu yang lebih leluasa", responRisiko: "Mengurangi Risiko", prioritas: 14 },
        { id: 15, uraianProses: "Tim PSS", pernyataanRisiko: "Hasil identifikasi narahubung dan kegiatan statistik kurang optimal", penyebabDampak: "Penyebab: Kurangnya koordinasi antara walidata dengan produsen data. Dampak: Hasil identifikasi kurang akurat dan tidak lengkap", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Eksternal", probabilitas: 2, dampak: 4, pengendalian: "Membina walidata dalam pelaksanaan identifikasi kegiatan statistik", responRisiko: "Mengurangi Risiko", prioritas: 15 },
        { id: 16, uraianProses: "Tim PSS", pernyataanRisiko: "Rencana kerja tidak tersusun", penyebabDampak: "Penyebab: Keterbatasan waktu. Dampak: Rencana kerja tidak tersusun secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 4, pengendalian: "Menentukan fokus tema pembinaan", responRisiko: "Mengurangi Risiko", prioritas: 16 },
        { id: 17, uraianProses: "Tim PSS", pernyataanRisiko: "Rencana kerja tidak terealisasi", penyebabDampak: "Penyebab: Peserta pembinaan tidak bisa hadir. Dampak: Rencana kerja tidak terealisasi secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal dan Eksternal", probabilitas: 2, dampak: 4, pengendalian: "Menyusun matriks kegiatan pembinaan", responRisiko: "Mengurangi Risiko", prioritas: 17 },
        { id: 18, uraianProses: "Tim PSS", pernyataanRisiko: "Capaian TPSS dibawah target", penyebabDampak: "Penyebab: Kurangnya kontrol dari kepala satker dan ketua tim. Dampak: Capaian TPSS dibawah target", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 4, pengendalian: "Melaporkan monev rutin kegiatan pembinaan kepada kepala satker", responRisiko: "Mengurangi Risiko", prioritas: 18 },
        { id: 19, uraianProses: "Tim PSS", pernyataanRisiko: "Penyusunan laporan kurang optimal", penyebabDampak: "Penyebab: Banyaknya beban pekerjaan. Dampak: Publikasi kurang berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Mengatur beban kerja sesuai dengan prioritas", responRisiko: "Mengurangi Risiko", prioritas: 19 },
        { id: 20, uraianProses: "Tim Perkebunan", pernyataanRisiko: "Rekapitulasi identifikasi daftar sampel dan assignment sampel tidak sesuai target", penyebabDampak: "Penyebab: Tim Kabupaten kesulitan dalam mengidentifikasi dan mengalokasi. Dampak: Pembagian tugas lapangan kurang efektif, pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Dilaksanakan lebih awal", responRisiko: "Menerima Risiko", prioritas: 20 },
        { id: 21, uraianProses: "Tim Perkebunan", pernyataanRisiko: "Terjadinya kekurangan instrumen atau instrumen yang dikirim tidak sesuai", penyebabDampak: "Penyebab: Kelalaian Tim Kabupaten. Dampak: Proses pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Pengecekan ulang sebelum instrumen dikirim", responRisiko: "Menerima Risiko", prioritas: 21 },
        { id: 22, uraianProses: "Tim Perkebunan", pernyataanRisiko: "Pelaksanaan pelatihan petugas kurang optimal", penyebabDampak: "Penyebab: Pelatihan dilakukan secara online. Dampak: Petugas tidak memahami materi pelatihan secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Membebaskan petugas dari berbagai tugas di saat pengajaran", responRisiko: "Menerima Risiko", prioritas: 22 },
        { id: 23, uraianProses: "Tim Perkebunan", pernyataanRisiko: "Progress pendataan tidak sesuai target", penyebabDampak: "Penyebab: Responden sulit ditemui. Dampak: Pendataan terlambat selesai", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Eksternal", probabilitas: 2, dampak: 2, pengendalian: "Reminder pelaksanaan pendataan", responRisiko: "Menerima Risiko", prioritas: 23 },
        { id: 24, uraianProses: "Tim Perkebunan", pernyataanRisiko: "Evaluasi kualitas data kurang optimal", penyebabDampak: "Penyebab: Kekurangan waktu. Dampak: Data tidak berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Membuat anomali tambahan untuk memeriksa kewajaran data", responRisiko: "Menerima Risiko", prioritas: 24 },
        { id: 25, uraianProses: "Tim IPDS", pernyataanRisiko: "Pelayanan PST tidak sesuai standar", penyebabDampak: "Penyebab: SDM PST terbatas. Dampak: Konsumen tidak puas", kategoriRisiko: "Risiko Reputasi", sumberRisiko: "Internal", probabilitas: 2, dampak: 3, pengendalian: "Menyusun jadwal piket PST yang optimal", responRisiko: "Mengurangi Risiko", prioritas: 25 },
        { id: 26, uraianProses: "Tim IPDS", pernyataanRisiko: "Data yang diminta tidak tersedia di BPS", penyebabDampak: "Penyebab: Data yang diminta merupakan data dari instansi lain. Dampak: Konsumen tidak puas", kategoriRisiko: "Risiko Reputasi", sumberRisiko: "Eksternal", probabilitas: 2, dampak: 3, pengendalian: "Memberikan informasi mengenai data yang tersedia di BPS", responRisiko: "Mengurangi Risiko", prioritas: 26 },
        { id: 27, uraianProses: "Tim IPDS", pernyataanRisiko: "Pelayanan perpustakaan tidak sesuai standar", penyebabDampak: "Penyebab: SDM dan sarana prasarana terbatas. Dampak: Pengunjung tidak puas", kategoriRisiko: "Risiko Reputasi", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Pengajuan sarana prasarana yang lebih baik", responRisiko: "Mengurangi Risiko", prioritas: 27 },
        { id: 28, uraianProses: "Tim IPDS", pernyataanRisiko: "Metadata tidak terisi lengkap", penyebabDampak: "Penyebab: Deskripsi isian pada aplikasi kurang jelas. Dampak: Kualitas metadata kurang baik", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 3, dampak: 2, pengendalian: "Koordinasi dengan BPS Provinsi", responRisiko: "Mengurangi Risiko", prioritas: 28 },
        { id: 29, uraianProses: "Tim IPDS", pernyataanRisiko: "Pengelolaan website kurang optimal", penyebabDampak: "Penyebab: Keterbatasan SDM. Dampak: Website kurang update", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 3, dampak: 3, pengendalian: "Pengoptimalan peran admin website", responRisiko: "Mengurangi Risiko", prioritas: 29 },
        { id: 30, uraianProses: "Tim Nerwilis", pernyataanRisiko: "Publikasi DDA tidak terbit tepat waktu", penyebabDampak: "Penyebab: Keterlambatan data dari OPD. Dampak: Publikasi terlambat rilis", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Eksternal", probabilitas: 4, dampak: 4, pengendalian: "Koordinasi dan follow up secara berkala ke OPD", responRisiko: "Mengurangi Risiko", prioritas: 30 },
        { id: 31, uraianProses: "Tim Nerwilis", pernyataanRisiko: "Salah dalam melakukan estimasi PDRB", penyebabDampak: "Penyebab: Kesalahan dalam perhitungan. Dampak: Data PDRB tidak akurat", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 5, pengendalian: "Pemeriksaan dan evaluasi berjenjang", responRisiko: "Mengurangi Risiko", prioritas: 31 },
        { id: 32, uraianProses: "Tim Nerwilis", pernyataanRisiko: "Tidak tersedianya data series PDRB tahun dasar terbaru", penyebabDampak: "Penyebab: Keterlambatan rilis dari pusat. Dampak: Analisis PDRB terhambat", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 3, dampak: 4, pengendalian: "Follow up ke BPS Provinsi dan Pusat", responRisiko: "Mengurangi Risiko", prioritas: 32 },
        { id: 33, uraianProses: "Tim Nerwilis", pernyataanRisiko: "Berita Resmi Statistik (BRS) tidak terbit tepat waktu", penyebabDampak: "Penyebab: Keterlambatan data dari BPS Pusat. Dampak: BRS terlambat rilis", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 3, dampak: 3, pengendalian: "Follow up ke BPS Provinsi dan Pusat", responRisiko: "Mengurangi Risiko", prioritas: 33 },
        { id: 34, uraianProses: "Tim Sosial", pernyataanRisiko: "Rekapitulasi identifikasi daftar sampel dan assignment sampel tidak sesuai target", penyebabDampak: "Penyebab: Tim Kabupaten kesulitan dalam mengidentifikasi dan mengalokasi. Dampak: Pembagian tugas lapangan kurang efektif, pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Dilaksanakan lebih awal", responRisiko: "Mengurangi Risiko", prioritas: 34 },
        { id: 35, uraianProses: "Tim Sosial", pernyataanRisiko: "Terjadinya kekurangan instrumen atau instrumen yang dikirim tidak sesuai", penyebabDampak: "Penyebab: Kelalaian Tim Kabupaten. Dampak: Proses pendataan tertunda", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Pengecekan ulang sebelum instrumen dikirim", responRisiko: "Mengurangi Risiko", prioritas: 35 },
        { id: 36, uraianProses: "Tim Sosial", pernyataanRisiko: "Pelaksanaan pelatihan petugas kurang optimal", penyebabDampak: "Penyebab: Pelatihan dilakukan secara online. Dampak: Petugas tidak memahami materi pelatihan secara maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 3, pengendalian: "Membebaskan petugas dari berbagai tugas di saat pengajaran", responRisiko: "Mengurangi Risiko", prioritas: 36 },
        { id: 37, uraianProses: "Tim Sosial", pernyataanRisiko: "Progress pendataan tidak sesuai target", penyebabDampak: "Penyebab: Responden sulit ditemui. Dampak: Pendataan terlambat selesai", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Eksternal", probabilitas: 3, dampak: 3, pengendalian: "Reminder pelaksanaan pendataan", responRisiko: "Mengurangi Risiko", prioritas: 37 },
        { id: 38, uraianProses: "Tim Sosial", pernyataanRisiko: "Evaluasi kualitas data kurang optimal", penyebabDampak: "Penyebab: Kekurangan waktu. Dampak: Data tidak berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal dan Eksternal", probabilitas: 3, dampak: 3, pengendalian: "Membuat anomali tambahan untuk memeriksa kewajaran data", responRisiko: "Mengurangi Risiko", prioritas: 38 },
        { id: 39, uraianProses: "Tim Sosial", pernyataanRisiko: "Penyusunan publikasi kurang optimal", penyebabDampak: "Penyebab: Banyaknya beban pekerjaan. Dampak: Publikasi kurang berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Mengatur jadwal penyusunan publikasi pada waktu yang kurang sibuk", responRisiko: "Mengurangi Risiko", prioritas: 39 },
        { id: 40, uraianProses: "Tim Teknis", pernyataanRisiko: "Progress pendataan tidak sesuai target", penyebabDampak: "Penyebab: Responden sulit ditemui. Dampak: Anggaran kurang mencukupi", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal dan Eksternal", probabilitas: 3, dampak: 4, pengendalian: "Melakukan pemeriksaan menggunakan anggaran survei lainnya", responRisiko: "Mengurangi Risiko", prioritas: 40 },
        { id: 41, uraianProses: "Tim Teknis", pernyataanRisiko: "Pendataan pada wilayah sampel sulit tidak terlaksana", penyebabDampak: "Penyebab: Anggaran kurang mencukupi. Dampak: Kurangnya kualitas data", kategoriRisiko: "Risiko Keuangan", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Mengutamakan pemeriksaan pada daerah sulit", responRisiko: "Mengurangi Risiko", prioritas: 41 },
        { id: 42, uraianProses: "Tim Teknis", pernyataanRisiko: "Evaluasi kualitas data kurang optimal", penyebabDampak: "Penyebab: Kekurangan waktu. Dampak: Data tidak berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal dan Eksternal", probabilitas: 3, dampak: 2, pengendalian: "Membuat anomali tambahan untuk memeriksa kewajaran data", responRisiko: "Mengurangi Risiko", prioritas: 42 },
        { id: 43, uraianProses: "Tim Teknis", pernyataanRisiko: "Penyusunan laporan/publikasi kurang optimal", penyebabDampak: "Penyebab: Banyaknya beban pekerjaan. Dampak: Laporan/Publikasi kurang berkualitas", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 2, dampak: 2, pengendalian: "Mengatur jadwal penyusunan laporan/publikasi pada waktu yang kurang sibuk", responRisiko: "Mengurangi Risiko", prioritas: 43 },
        { id: 44, uraianProses: "Pojok Statistik", pernyataanRisiko: "Evaluasi Pojok Statistik kurang maksimal", penyebabDampak: "Penyebab: Sarana prasarana kurang sesuai standar. Dampak: Nilai hasil evaluasi kurang maksimal", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 4, dampak: 2, pengendalian: "Melaksanakan agenda kegiatan Pojok Statistik 2025", responRisiko: "Mengurangi Risiko", prioritas: 44 },
        { id: 45, uraianProses: "Kehumasan", pernyataanRisiko: "Proses produksi membuat konten memakan waktu lama", penyebabDampak: "Penyebab: Keterbatasan SDM untuk proses produksi. Dampak: Konten terlambat diunggah", kategoriRisiko: "Risiko Operasional", sumberRisiko: "Internal", probabilitas: 3, dampak: 3, pengendalian: "Penggunaan akun oleh orang yang memang diberi tanggungjawab sesuai jadwal sebagai editor", responRisiko: "Mengurangi Risiko", prioritas: 45 }
    ];
    
    // Fungsi untuk memuat risiko dari Local Storage
    const loadRisks = () => {
        const risks = localStorage.getItem('prismaRisks');
        // Jika tidak ada data di local storage, gunakan data awal dari file
        if (!risks) {
            return initialRisks;
        }
        // Jika ada, parse data dari local storage
        return JSON.parse(risks);
    };

    let risks = loadRisks();

    // Fungsi untuk menyimpan risiko ke Local Storage
    const saveRisks = () => {
        localStorage.setItem('prismaRisks', JSON.stringify(risks));
    };

    // Fungsi untuk merender tabel risiko
    const renderTable = () => {
        riskTableBody.innerHTML = '';
        if (risks.length === 0) {
            riskTableBody.innerHTML = '<tr><td colspan="13" style="text-align:center;">Belum ada data risiko.</td></tr>';
            return;
        }

        risks.forEach((risk, index) => {
            const score = getRiskScore(risk.probabilitas, risk.dampak);
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${risk.uraianProses}</td>
                    <td>${risk.pernyataanRisiko}</td>
                    <td>${risk.penyebabDampak}</td>
                    <td>${risk.kategoriRisiko}</td>
                    <td>${risk.sumberRisiko}</td>
                    <td>${risk.probabilitas}</td>
                    <td>${risk.dampak}</td>
                    <td>${score}</td>
                    <td>${risk.pengendalian}</td>
                    <td>${risk.responRisiko}</td>
                    <td>${risk.prioritas}</td>
                    <td><button class="delete-btn" data-id="${risk.id}">Hapus</button></td>
                </tr>
            `;
            riskTableBody.innerHTML += row;
        });
    };

    // Fungsi untuk menambah risiko
    addRiskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newRisk = {
            id: Date.now(),
            uraianProses: document.getElementById('uraian-proses').value,
            pernyataanRisiko: document.getElementById('pernyataan-risiko').value,
            penyebabDampak: document.getElementById('penyebab-dampak').value,
            kategoriRisiko: document.getElementById('kategori-risiko').value,
            sumberRisiko: document.getElementById('sumber-risiko').value,
            probabilitas: parseInt(document.getElementById('probabilitas').value),
            dampak: parseInt(document.getElementById('dampak').value),
            pengendalian: document.getElementById('pengendalian').value,
            responRisiko: document.getElementById('respon-risiko').value,
            prioritas: parseInt(document.getElementById('prioritas').value)
        };

        risks.push(newRisk);
        saveRisks();
        renderTable();
        addRiskForm.reset();
        alert('Risiko baru berhasil ditambahkan!');
        // Kembali ke halaman daftar risiko setelah submit
        switchView('list');
    });

    // Fungsi untuk menghapus risiko
    riskTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const riskId = parseInt(e.target.getAttribute('data-id'));
            if (confirm('Apakah Anda yakin ingin menghapus risiko ini?')) {
                risks = risks.filter(risk => risk.id !== riskId);
                saveRisks();
                renderTable();
            }
        }
    });

    // Fungsi untuk berganti tampilan
    const switchView = (view) => {
        if (view === 'add') {
            riskListContainer.classList.add('hidden');
            addRiskContainer.classList.remove('hidden');
            showRiskListBtn.classList.remove('active');
            showAddRiskBtn.classList.add('active');
        } else { // 'list'
            addRiskContainer.classList.add('hidden');
            riskListContainer.classList.remove('hidden');
            showAddRiskBtn.classList.remove('active');
            showRiskListBtn.classList.add('active');
        }
    };
    
    showRiskListBtn.addEventListener('click', () => switchView('list'));
    showAddRiskBtn.addEventListener('click', () => switchView('add'));

    // Initial render
    renderTable();
    // Simpan data awal ke local storage jika belum ada
    if (!localStorage.getItem('prismaRisks')) {
        saveRisks();
    }
});