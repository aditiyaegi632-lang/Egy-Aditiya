import {
  BerkasItem,
  TahapanPekerjaanItem,
  ChecklistItemTahapan,
  RiwayatCatatanTahapan
} from '../types/notary';

interface StageTemplate {
  judul: string;
  deskripsi: string;
}

function getDefaultChecklistItems(
  judul: string,
  jenis: string,
  isCompleted: boolean,
  currentPetugas: string = 'Egi'
): ChecklistItemTahapan[] {
  let itemNames: string[] = [];

  const lower = judul.toLowerCase();

  if (lower.includes('pemeriksaan') || lower.includes('verifikasi')) {
    itemNames = [
      'FC/SCAN KTP Para Penghadap / Pendiri Lengkap',
      'FC/SCAN NPWP Pribadi & Kartu Keluarga',
      'Bukti Penyetoran / Kepemilikan Modal Awal',
      'Surat Kuasa Menghadap Notaris (jika dikuasakan)',
      'Formulir Pendaftaran & Verifikasi Dukcapil'
    ];
  } else if (lower.includes('pemesanan nama') || lower.includes('nama')) {
    itemNames = [
      `Pengecekan Ketersediaan Nama ${jenis} di Sistem SABH / AHU`,
      'Pembayaran PNBP Voucher Pemesanan Nama',
      'Persetujuan Pemakaian Nama Resmi dari Kemenkumham'
    ];
  } else if (lower.includes('pembuatan akta') || lower.includes('akta')) {
    itemNames = [
      'Penyusunan Draf Minuta Akta Notaris',
      'Penetapan Maksud & Tujuan Usaha Sesuai KBLI Terbaru',
      'Verifikasi Susunan Pengurus, Direksi & Pemegang Saham',
      'Pencetakan Salinan Minuta untuk Penelaahan Klien'
    ];
  } else if (lower.includes('penandatanganan') || lower.includes('minuta')) {
    itemNames = [
      'Pembacaan Isi Akta di Hadapan Seluruh Penghadap',
      'Pembubuhan Tanda Tangan Basah Seluruh Penghadap',
      'Pembubuhan Cap Jempol Penghadap pada Lembar Minuta',
      'Penandatanganan & Pembubuhan Cap Dinas Notaris'
    ];
  } else if (
    lower.includes('pengesahan') ||
    lower.includes('kemenkumham') ||
    lower.includes('ahu') ||
    lower.includes('skt')
  ) {
    itemNames = [
      'Pengisian Formulir Elektronik pada Portal AHU Online',
      'Pembayaran PNBP Pengesahan Badan Hukum / Usaha',
      'Unggah Dokumen Minuta Akta & Surat Pernyataan',
      'Penerbitan Surat Keputusan (SK) Menteri Hukum & HAM RI'
    ];
  } else if (lower.includes('register') || lower.includes('waarmerking') || lower.includes('legalisasi')) {
    itemNames = [
      'Pencatatan Nomor Urut dalam Buku Daftar Repertorium Khusus',
      'Pemeriksaan Kepastian Tanggal Surat di Bawah Tangan',
      'Pembubuhan Frasa Legalisasi / Waarmerking Resmi',
      'Pembubuhan Cap Dinas & Tanda Tangan Notaris'
    ];
  } else if (lower.includes('rups') || lower.includes('rapat')) {
    itemNames = [
      'Daftar Hadir Pemegang Saham / Anggota Memenuhi Kuorum',
      'Risalah Berita Acara Keputusan Rapat',
      'Surat Kuasa Khusus Mewakili Hadir (jika ada)'
    ];
  } else {
    itemNames = [
      'Pemeriksaan Dokumen Persyaratan & Legalitas',
      'Verifikasi Keabsahan Data Pendukung',
      'Penyelesaian Draft Administrasi Notariat',
      'Persetujuan Final Notaris Penanggung Jawab'
    ];
  }

  return itemNames.map((nama, idx) => ({
    id: `chk-${Date.now()}-${idx + 1}-${Math.floor(Math.random() * 1000)}`,
    nomor: idx + 1,
    nama,
    checked: isCompleted,
    petugas: isCompleted ? currentPetugas : undefined,
    jam: isCompleted ? '22-09-2026 10:15' : undefined
  }));
}

export function generateInitialTahapan(
  berkas: BerkasItem,
  currentPetugas: string = 'Egi'
): TahapanPekerjaanItem[] {
  let templates: StageTemplate[] = [];

  const jenis = berkas.jenis;
  const submenu = berkas.kategoriSubmenu || 'Pendirian';

  if (jenis === 'Waarmerking' || jenis === 'Legalisasi') {
    // 4 Tahapan Waarmerking & Legalisasi
    const namaRegister = jenis === 'Waarmerking' ? 'Buku Waarmerking' : 'Buku Legalisasi';
    templates = [
      {
        judul: 'Penerimaan Berkas',
        deskripsi: 'Penerimaan surat/dokumen di bawah tangan dari pemohon, verifikasi kartu identitas (KTP/Paspor), dan pencatatan permohonan awal.'
      },
      {
        judul: 'Pemeriksaan & Verifikasi Dokumen',
        deskripsi: 'Pemeriksaan kepatutan isi dokumen, kepastian tanggal, serta kesesuaian tanda tangan para penghadap dengan kartu identitas.'
      },
      {
        judul: `Pendaftaran / Penomoran Buku Register (${jenis})`,
        deskripsi: `Pencatatan nomor urut resmi pada ${namaRegister}, pembubuhan cap dinas Notaris, dan penandatanganan pengesahan oleh Notaris.`
      },
      {
        judul: 'Pengambilan Berkas',
        deskripsi: 'Penyerahan dokumen yang telah disahkan/didaftarkan kepada pemohon beserta tanda terima penyerahan berkas.'
      }
    ];
  } else if (submenu === 'Perubahan') {
    templates = [
      {
        judul: 'Penerimaan Berkas',
        deskripsi: `Penerimaan berkas permohonan perubahan ${jenis}, akta pendirian terdahulu, susunan pengurus/pemegang saham, dan identitas para pihak.`
      },
      {
        judul: 'Pemeriksaan Dokumen & Legalitas',
        deskripsi: 'Verifikasi legalitas anggaran dasar sebelumnya, kuorum kehadiran para pihak, dan substansi pasal yang akan diubah.'
      },
      {
        judul: 'Penyelenggaraan RUPS / Berita Acara Rapat',
        deskripsi: 'Penyusunan risalah Rapat Umum Pemegang Saham (RUPS) / Rapat Anggota / Organ Yayasan atau Berita Acara Rapat yang sah.'
      },
      {
        judul: 'Pembuatan Akta Perubahan Notaris',
        deskripsi: 'Penyusunan dan pengetikan minuta akta pernyataan keputusan rapat / akta perubahan anggaran dasar oleh Notaris.'
      },
      {
        judul: 'Persetujuan / Pemberitahuan AHU Kemenkumham',
        deskripsi: 'Penyampaian pelaporan atau permohonan persetujuan perubahan data badan hukum/usaha secara daring melalui sistem AHU Online Kemenkumham.'
      },
      {
        judul: 'Pengambilan Berkas',
        deskripsi: 'Penyerahan salinan resmi akta perubahan, bukti penerimaan pemberitahuan / SK Menteri Kemenkumham kepada pemohon.'
      }
    ];
  } else if (submenu === 'Pembubaran') {
    templates = [
      {
        judul: 'Penerimaan Berkas',
        deskripsi: `Penerimaan berkas permohonan pembubaran ${jenis}, dokumen keuangan/neraca akhir, serta penetapan pihak likuidator.`
      },
      {
        judul: 'Pemeriksaan Dokumen & Penetapan Likuidator',
        deskripsi: 'Pemeriksaan keabsahan keputusan pembubaran oleh para pemilik/anggota dan legalitas penunjukan likuidator.'
      },
      {
        judul: 'Pembuatan Akta Pembubaran & Pengumuman',
        deskripsi: 'Pembuatan minuta akta pembubaran oleh Notaris serta pengumuman pembubaran dalam Surat Kabar harian dan Berita Negara.'
      },
      {
        judul: 'Pemberitahuan Pembubaran ke Kemenkumham',
        deskripsi: 'Pelaporan pembubaran badan hukum/usaha kepada Menteri Hukum dan HAM RI untuk pencabutan status terdaftar.'
      },
      {
        judul: 'Pengambilan Berkas',
        deskripsi: 'Penyerahan salinan akta pembubaran, bukti pelaporan kementerian, dan arsip dokumen resmi kepada pihak likuidator/pemohon.'
      }
    ];
  } else if (jenis === 'PT') {
    templates = [
      {
        judul: 'Penerimaan Berkas',
        deskripsi: 'Penerimaan dokumen legalitas para pendiri, salinan KTP & NPWP pengurus, struktur permodalan, serta draft kegiatan usaha (KBLI).'
      },
      {
        judul: 'Pemeriksaan Berkas',
        deskripsi: 'Verifikasi keabsahan data kependudukan (Dukcapil), validasi NPWP, serta kepatuhan modal ditempatkan dan disetor minimal 25%.'
      },
      {
        judul: 'Pemesanan Nama PT',
        deskripsi: 'Pengecekan dan pemesanan nama PT melalui Sistem Administrasi Badan Hukum (SABH / AHU Online Kemenkumham RI).'
      },
      {
        judul: 'Pembuatan Akta',
        deskripsi: 'Penyusunan minuta akta pendirian perseroan terbatas oleh Notaris memuat anggaran dasar lengkap sesuai ketentuan UU PT.'
      },
      {
        judul: 'Penandatanganan Akta / Minuta',
        deskripsi: 'Pembacaan dan penandatanganan minuta akta pendirian oleh seluruh pendiri/penghadap di hadapan Notaris.'
      },
      {
        judul: 'Pengesahan SK Kemenkumham',
        deskripsi: 'Pengajuan dan penerbitan Surat Keputusan Menteri Hukum dan HAM RI tentang Pengesahan Badan Hukum Perseroan Terbatas.'
      },
      {
        judul: 'Pengambilan Berkas',
        deskripsi: 'Penyerahan salinan resmi akta pendirian PT, SK Kemenkumham asli, NPWP perusahaan, dan NIB kepada pemohon.'
      }
    ];
  } else if (jenis === 'Yayasan') {
    templates = [
      {
        judul: 'Penerimaan Berkas',
        deskripsi: 'Penerimaan data para pendiri, organ yayasan (Pembina, Pengurus, Pengawas), dan bukti pemisahan kekayaan awal.'
      },
      {
        judul: 'Pemeriksaan Berkas & Pemesanan Nama Yayasan',
        deskripsi: 'Pemeriksaan berkas dan pemesanan nama yayasan melalui AHU Online Kemenkumham untuk memastikan ketersediaan nama.'
      },
      {
        judul: 'Pembuatan Akta Pendirian Yayasan',
        deskripsi: 'Penyusunan minuta akta pendirian yayasan oleh Notaris sesuai UU No. 16/2001 jo. UU No. 28/2004 tentang Yayasan.'
      },
      {
        judul: 'Penandatanganan Minuta Akta',
        deskripsi: 'Penandatanganan akta pendirian yayasan oleh para pendiri di hadapan Notaris.'
      },
      {
        judul: 'Pengesahan Badan Hukum Kemenkumham',
        deskripsi: 'Pengajuan permohonan pengesahan dan penerbitan SK Menteri Hukum dan HAM atas status badan hukum yayasan.'
      },
      {
        judul: 'Pengambilan Berkas',
        deskripsi: 'Penyerahan salinan akta pendirian resmi, SK Pengesahan Kemenkumham, serta dokumen pendukung kepada pengurus yayasan.'
      }
    ];
  } else if (jenis === 'Koperasi') {
    templates = [
      {
        judul: 'Penerimaan Berkas',
        deskripsi: 'Penerimaan berita acara rapat pembentukan koperasi, daftar hadir pendiri, susunan pengurus/pengawas, dan bukti setoran modal simpanan.'
      },
      {
        judul: 'Pemeriksaan Dokumen & Verifikasi',
        deskripsi: 'Verifikasi kelengkapan administrasi dan rekomendasi penyuluhan dari Dinas Koperasi dan UKM setempat.'
      },
      {
        judul: 'Pembuatan Akta Pendirian Koperasi',
        deskripsi: 'Penyusunan akta pendirian koperasi oleh Notaris Pembuat Akta Koperasi (NPAK) sesuai anggaran dasar koperasi.'
      },
      {
        judul: 'Penandatanganan Akta oleh Kuasa Pendiri',
        deskripsi: 'Penandatanganan minuta akta oleh para kuasa pendiri yang ditunjuk di hadapan Notaris.'
      },
      {
        judul: 'Pengesahan Badan Hukum Kemenkumham',
        deskripsi: 'Pengajuan pengesahan badan hukum koperasi melalui Sistem AHU Kemenkumham Republik Indonesia.'
      },
      {
        judul: 'Pengambilan Berkas',
        deskripsi: 'Penyerahan salinan akta pendirian resmi, SK Menteri, dan dokumen legalitas koperasi kepada pengurus.'
      }
    ];
  } else {
    // CV & Firma
    templates = [
      {
        judul: 'Penerimaan Berkas',
        deskripsi: `Penerimaan identitas (KTP, NPWP) para sekutu aktif dan pasif, kesepakatan pembagian modal, dan bidang usaha persekutuan ${jenis}.`
      },
      {
        judul: 'Pemeriksaan Berkas & Pemesanan Nama',
        deskripsi: `Pemeriksaan kelengkapan berkas serta pemesanan nama persekutuan komanditer/firma di Sistem Administrasi Badan Usaha (SABU).`
      },
      {
        judul: 'Pembuatan Akta Pendirian',
        deskripsi: `Penyusunan minuta akta pendirian ${jenis} oleh Notaris yang memuat hak dan kewajiban masing-masing sekutu.`
      },
      {
        judul: 'Pendaftaran SKT ke Kemenkumham (SABU)',
        deskripsi: `Pendaftaran akta dan penerbitan Surat Keterangan Terdaftar (SKT) dari Kementerian Hukum dan HAM RI.`
      },
      {
        judul: 'Pengambilan Berkas',
        deskripsi: `Penyerahan salinan akta pendirian resmi dan bukti SKT SABU Kemenkumham kepada pihak sekutu/pemohon.`
      }
    ];
  }

  const total = templates.length;
  const docStatus = berkas.status;

  return templates.map((t, index) => {
    const stageNumber = index + 1;
    const isFirst = index === 0;
    const isLast = index === total - 1;
    const tipeTahapan: 'khusus' | 'checklist' = isFirst || isLast ? 'khusus' : 'checklist';

    let status: 'Pending' | 'Diproses' | 'Selesai' = 'Pending';
    let tanggalSelesai: string | undefined;

    if (docStatus === 'Selesai') {
      status = 'Selesai';
      tanggalSelesai = berkas.tanggalLengkap || '2026-09-20';
    } else if (docStatus === 'Pending') {
      if (isFirst) {
        status = 'Diproses';
      } else {
        status = 'Pending';
      }
    } else {
      // 'Diproses'
      const completedCount = Math.max(1, Math.floor(total * 0.5));
      if (index < completedCount) {
        status = 'Selesai';
        tanggalSelesai = '2026-09-18';
      } else if (index === completedCount) {
        status = 'Diproses';
      } else {
        status = 'Pending';
      }
    }

    const isStageDone = status === 'Selesai';

    // Build Riwayat Catatan for Tahapan Khusus
    let riwayatCatatan: RiwayatCatatanTahapan[] | undefined;
    if (tipeTahapan === 'khusus') {
      if (isFirst) {
        riwayatCatatan = [
          {
            id: `rc-${berkas.id}-1`,
            tanggal: '2026-09-22',
            jam: '10:38:36',
            petugas: currentPetugas,
            catatan: `Penerimaan berkas fisik dan kelengkapan dokumen persyaratan ${berkas.subJenis || berkas.jenis} dari pemohon.`
          }
        ];
      } else if (isLast && isStageDone) {
        riwayatCatatan = [
          {
            id: `rc-${berkas.id}-last`,
            tanggal: '2026-09-22',
            jam: '15:20:10',
            petugas: currentPetugas,
            catatan: 'Penyerahan salinan akta resmi, SK Menteri, dan berkas asli kepada pemohon disertai tanda terima.'
          }
        ];
      } else {
        riwayatCatatan = [];
      }
    }

    // Build Checklist Items for Intermediate Stages
    let checklistItems: ChecklistItemTahapan[] | undefined;
    if (tipeTahapan === 'checklist') {
      checklistItems = getDefaultChecklistItems(t.judul, jenis, isStageDone, currentPetugas);
    }

    return {
      id: `tahap-${berkas.id}-${stageNumber}`,
      nomor: stageNumber,
      judul: `${stageNumber}. ${t.judul}`,
      deskripsi: t.deskripsi,
      status,
      tipeTahapan,
      tanggalMasuk: isFirst ? '2026-09-22' : undefined,
      tanggalSelesai,
      riwayatCatatan,
      checklistItems,
      pic: index <= 2 ? 'Staff Administrasi' : 'Notaris (Hj. Ratna Sari, S.H.)',
      catatan: status === 'Selesai' ? 'Pekerjaan tahapan telah diverifikasi dan disetujui.' : undefined
    };
  });
}
