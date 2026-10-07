---
name: kodeatech-maintainer
description: "Gunakan saat menganalisis, mengaudit, memperbaiki, atau menambah fitur pada repository KODEA TECH: Next.js/MySQL, public website, admin CMS, authentication, media, SEO, dan deployment aaPanel kodeatech.cloud. Juga untuk melanjutkan project dari akun Codex lain melalui paket handover repository."
---

# KodeaTech Maintainer

Skill ini adalah panduan project; tidak membawa kredensial, akses VPS, atau salinan database.

## Baca konteks sesuai scope

1. Mulai dari [AGENTS.md](../../../AGENTS.md) dan [handover README](../../../docs/handover/README.md).
2. Selalu baca [STATUS](../../../docs/handover/STATUS.md), lalu cocokkan dengan HEAD/source aktual. Laporan pemilik tentang server bukan verifikasi server langsung.
3. Untuk fitur atau perubahan kode, baca [FEATURES](../../../docs/handover/FEATURES.md).
4. Untuk MySQL/storage/Node/PM2/aaPanel, baca [OPERATIONS](../../../docs/handover/OPERATIONS.md).
5. Untuk audit, gunakan [AUDIT](../../../docs/handover/AUDIT.md). Baca file implementasi yang relevan; jangan memuat seluruh project tanpa kebutuhan.

## Alur tindakan

- Tentukan apakah user meminta ringkasan, audit source, implementasi, atau operasi deployment. Jangan menjalankan langkah operasional hanya karena ada contoh command dalam dokumentasi.
- Inspect sebelum edit; reuse registry CMS, service, validation, picker, auth dan design system. Database tetap MySQL/Prisma dan konten berasal dari CMS.
- Prioritas terbuka saat snapshot adalah upload/hapus media production. Pulihkan konteks runtime sebelum menyimpulkan akar masalah API; minta bukti terbaru jika diperlukan.
- Pertahankan Origin/CSRF/RBAC, sanitasi, upload validation dan referenced-media protection. Jangan membaca/menampilkan secret atau menggunakan data production sebagai objek uji.
- Ikuti preferensi testing dan keputusan desain pada AGENTS; instruksi terbaru user berlaku lebih dahulu. Tidak ada klaim pengujian/deployment jika belum dilakukan.
- Setelah perubahan signifikan, update STATUS: file/commit, perilaku, bukti, batas verifikasi, deployment aktual, dan pekerjaan terbuka. Jangan menyimpan password/hash/log privat dalam handover.

## Hasil yang disampaikan

Gunakan Bahasa Indonesia. Untuk audit berikan temuan terprioritas dengan bukti file/baris. Untuk implementasi jelaskan perubahan, alasan, pemeriksaan yang benar-benar dilakukan, serta migration/configuration/deployment yang masih diperlukan. Ringkasan akhir harus dapat dipahami tanpa riwayat chat.
