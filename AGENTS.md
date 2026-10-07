# Petunjuk kerja KODEA TECH

Project ini adalah website company profile dan CMS KODEA TECH, bukan landing page statis. Bahasa komunikasi pemilik: Indonesia. Konten public default: Inggris; CMS memiliki field locale Inggris/Indonesia.

## Mulai di sini

1. Baca `docs/handover/README.md` dan `docs/handover/STATUS.md` sebelum analisis atau perubahan pertama.
2. Baca `FEATURES.md`, `OPERATIONS.md`, atau `AUDIT.md` di folder tersebut sesuai pekerjaan. Cocokkan dokumentasi dengan source dan kondisi environment saat ini.
3. Skill proyek tersedia di `.agents/skills/kodeatech-maintainer/SKILL.md`. Jika tidak terdeteksi oleh Codex, baca file itu langsung; jangan menganggap skill sudah terpasang di akun baru.

## Batas dan kebiasaan project

- Inspect struktur, package manager, git status, dan implementasi terkait sebelum mengubah file. Gunakan npm dan lockfile yang ada. Jangan menimpa perubahan pemilik.
- Source, database MySQL, file upload, dan konfigurasi rahasia adalah empat bagian terpisah. Clone Git saja tidak memulihkan konten produksi atau media.
- Data bisnis berasal dari Prisma/MySQL dan CMS. Jangan menambahkan fallback data demo untuk menyembunyikan kegagalan koneksi.
- Gunakan komponen dan editor CMS bersama; registry resource ada di `features/cms/config.ts`. TypeScript strict, tanpa `any` yang tidak diperlukan.
- Preferensi terakhir pemilik: tidak menjalankan testing aplikasi; pemilik memeriksa langsung di browser. Jangan otomatis menjalankan lint/typecheck/build/tests/browser audit. Jika pemilik meminta validasi atau deployment yang membutuhkan build, ikuti instruksi terbaru itu dan laporkan hasil sebenarnya.
- Jangan mengubah database produksi, menjalankan seed/import/reset password, menghapus media nyata, push Git, atau mengubah server hanya karena diminta membaca handover atau audit. Ikuti cakupan tindakan yang benar-benar diminta.
- Jangan membaca atau menyalin secret untuk dokumentasi. Jangan commit `.env`, SQL export produksi, backup, session, password/hash, atau file upload privat. Gunakan placeholder dan laporkan konfigurasi nonrahasia saja.
- Pertahankan autentikasi, RBAC, validasi Origin/CSRF, sanitasi HTML, rate limit, dan validasi upload. Jangan mematikan pengamanan untuk mengatasi konfigurasi deployment.
- Catat perubahan signifikan dan verifikasi terbaru di `docs/handover/STATUS.md`. Pisahkan bukti source, laporan pemilik, dan hal yang belum diverifikasi; jangan menulis testing lulus jika tidak dijalankan.

## Keputusan desain yang harus dipertahankan

- Premium, clean, responsif; tanpa gradient. Gunakan design system yang sudah ada.
- Logo admin hanya di sidebar, tidak di topbar. Logo public/brand default bersumber dari `public/logo-kodea.png`; favicon default `public/icon.svg`.
- Client Wall: logo besar, tanpa card/background/border, bergerak pelan dengan kontrol dan dukungan reduced motion.
- Testimonial: tiga card pada desktop, dua tablet, satu mobile; foto besar dan crop dapat diatur melalui CMS.
- Mengganti gambar dari laptop/HP menggunakan uploader/picker media, bukan field URL saja. Jangan hilangkan fasilitas pemilihan media yang sudah tersedia.
