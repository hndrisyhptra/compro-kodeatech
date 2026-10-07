# Status dan pekerjaan berikutnya

Diperbarui **7 Oktober 2026**, berdasarkan source lokal sampai `a91d5cd` dan laporan pemilik. Dokumen ini tidak membaca langsung VPS. Setelah perbaikan baru, tambahkan tanggal, bukti, commit, dan status deployment; jangan menghapus riwayat yang masih relevan.

## Ringkasan kondisi

| Bagian | Bukti/status |
| --- | --- |
| Public/CMS/backend/MySQL/auth | Implementasi tersedia di source; bukan sekadar mockup |
| Domain public | Pemilik mengonfirmasi website `kodeatech.cloud` berhasil diakses |
| Login admin production | Pemilik mengonfirmasi berhasil setelah perbaikan Origin/configuration |
| Node/PM2 | Laporan server: Node 24.21.0, proses `kodeatech` pernah online, Next Ready pada 127.0.0.1:3000 |
| Media production | **Masih terbuka:** upload dan hapus gagal dengan pesan generik |
| Patch media lokal | Ada pada commit `a91d5cd`; belum ada bukti commit ini sudah dipush/pull/build pada VPS |
| Shell sesi terakhir | Setelah `su kodea`, `npm` tidak ditemukan dan variabel KODEA_NODE/KODEA_PM2 kosong |
| Testing terbaru | Tidak dijalankan untuk patch media maupun handover ini, sesuai permintaan pemilik |

## Perubahan yang telah dibuat pada source

1. Website/CMS database-backed, SQL phpMyAdmin, dashboard, role/auth, CRUD, upload/SEO/contact, deployment guide dan helper database/password.
2. Gambar/logo/foto dari device dan Media Library tersedia di editor berbagai resource/settings, rich content dan gallery.
3. Branding public/admin disesuaikan untuk logo transparan `public/logo-kodea.png`; logo CMS hanya sidebar. Favicon transparan melalui `public/icon.svg` dan cache version helper.
4. Client Wall diperbesar, tanpa card, bergerak pelan dengan kontrol/drag/touch/keyboard/reduced motion.
5. Testimonial tiga card desktop, dua tablet, satu mobile; foto diperbesar. CMS menyediakan crop/zoom/posisi foto dengan preview; tidak membutuhkan migration.
6. Patch penghapusan/storage media: hanya ENOENT yang diabaikan; media yang dipakai mendapat 409; record tidak ada mendapat 404; permission/disk error dilaporkan lebih jelas. Cleanup upload tidak menutupi error asal; pilihan media baru dikosongkan jika delete berhasil.

File patch media: `app/api/admin/media/route.ts`, `lib/storage.ts`, `components/admin/media-library.tsx`, `README.md`. Patch belum membuktikan masalah produksi selesai.

## Prioritas berikutnya: upload/hapus media

Urutan diagnosis yang belum selesai:

1. Pulihkan PATH Node/npm serta variabel PM2 pada shell **kodea**. Ini masalah sesi shell, belum merupakan bukti bug upload.
2. Bandingkan commit/source server dengan `a91d5cd`; tentukan apakah perlu pull/install/build/restart. Jangan menganggap build lokal otomatis berlaku di server.
3. Pastikan runtime memakai `STORAGE_ROOT=/www/wwwroot/kodeatech-storage/uploads`; directory ada dan dapat diakses/tulis oleh user proses kodea. Pembuatan directory pernah gagal karena dilakukan sebagai kodea pada parent root-owned. Keberhasilan pembuatan ulang sebagai root belum dikonfirmasi.
4. Dapatkan log **baru tepat setelah satu percobaan upload/hapus**, status HTTP dan pesan response yang sudah disamarkan. Log lama hanya menunjukkan GET gambar tidak valid; itu tidak cukup mendiagnosis mutation.
5. Bedakan 403 Origin/CSRF/role, 409 gambar masih direferensikan, 413 batas proxy, 400 validasi file, dan 500 filesystem/database. Jangan menghilangkan proteksi referensi atau memakai chmod 777 untuk menyamarkan masalah.
6. Bila DB diimpor dari laptop, bandingkan metadata dengan file asli pada storage. DB dan Git tidak membawa byte upload; media lama mungkin perlu dipulihkan dari backup.

Belum ada log mutation terbaru untuk memastikan akar masalah. Perbaikan setelah diagnosis harus dicatat terpisah dari hipotesis.

## Masalah deployment sebelumnya dan hasilnya

| Kejadian | Penyebab/bukti | Kondisi terakhir |
| --- | --- | --- |
| aaPanel menampilkan default index.html | Site statis belum mem-proxy aplikasi Next | Domain public kemudian dikonfirmasi berhasil |
| PM2 errored, connection refused | Node 18.20.8 terlalu lama untuk Next; lalu daemon PM2 menunjuk container path Node18 yang hilang | Node24 + PM2 runtime milik kodea pernah berhasil online |
| Npm cache permission/command not found | Cache aaPanel bersama root-owned; PATH/session Node tidak tersedia | Private cache disarankan; PATH kembali bermasalah pada sesi terakhir |
| HTTP 500 Prisma authentication | User/password DATABASE_URL tidak cocok; password mengandung karakter yang perlu URL-encode | Public kemudian berhasil; jangan menganggap password PMA sama dengan user aplikasi |
| Login Invalid request origin | SITE_URL/runtime origin tidak sesuai domain browser | Login berhasil dikonfirmasi pemilik |
| GET media invalid image | URL media tidak menghasilkan byte gambar valid | Penyebab file/permission belum dibuktikan |

Password database pernah dikirim di chat lama. Jangan menyalinnya ke dokumentasi; rotasi melalui jalur privat disarankan, belum ada konfirmasi sudah dilakukan. Password admin telah diubah pemilik; nilai seed `.env` tidak boleh dianggap kredensial login saat ini.

## Area yang perlu audit, belum otomatis diperbaiki

- `ecosystem.config.cjs` masih memakai contoh cwd `/www/wwwroot/kodeatech.cloud`, sementara folder server yang dilaporkan adalah `/www/wwwroot/compro-kodeatech`.
- `next.config.ts` memakai `output: standalone`, tetapi npm start/contoh PM2 memakai next start. Server memberi warning penggunaan standalone server.js. Pilih satu mode deployment konsisten dan dokumentasikan setelah benar-benar diterapkan.
- Lingkungan shell permanen `.kodeatech-env.sh`/.bashrc pernah disarankan, belum dikonfirmasi dibuat. PM2 startup setelah reboot, backup/restore dan SSL renewal belum diaudit langsung.
- Sebagian copy UI masih literal; locale link/hreflang belum lengkap. Audit batas CMS versus requirement awal, jangan mengklaim seluruh konten sudah editable.
- Logout memanggil `authorizeWrite`, yang membatasi VIEWER. Evaluasi apakah VIEWER dapat logout; kandidat masalah dari pembacaan kode, belum diuji runtime.
- Admin responsive/accessibility, semua role, contact, scheduled publish, rich editor, crop, media referensi dan SEO production belum memiliki acceptance report menyeluruh.
- Careers berupa halaman konten; belum ATS. Reply inquiry mailto; belum SMTP. Tidak ada backend newsletter. Jangan membuat fitur tambahan ini tanpa cakupan baru dari pemilik.

## Riwayat validasi

`VALIDATION.md` berisi snapshot pemeriksaan 5 Oktober 2026: lint/typecheck, sembilan unit tests, production build, dan audit dependency saat itu. Bagian lanjutannya mencatat verifikasi localhost serta perubahan berikutnya. Hasil tersebut tidak mencakup semua perubahan terakhir dan tidak membuktikan semua alur VPS sudah diuji.

Preferensi terbaru pemilik adalah memeriksa langsung di browser dan tidak meminta testing otomatis. Tidak ada lint/typecheck/build/test aplikasi yang dijalankan dalam pembuatan handover. Pemeriksaan struktur/link dokumentasi atau metadata skill harus dilaporkan sebagai pemeriksaan dokumentasi saja.

## Format pembaruan status

**Pembaruan dokumentasi — 7 Oktober 2026:** paket `docs/handover/`, root `AGENTS.md`, skill `.agents/skills/kodeatech-maintainer/`, dan tautan README/VALIDATION telah ditambahkan. Tautan Markdown lokal serta YAML skill/interface diperiksa; semua valid. Validator Python bawaan tidak tersedia karena PyYAML tidak terpasang, sehingga format YAML diperiksa dengan dependency `js-yaml` yang sudah ada, tanpa instalasi baru. Source aplikasi, database, credential, dan server tidak diubah; tidak ada testing aplikasi, commit, push, atau deployment dalam pekerjaan ini.

```text
Tanggal:
Permintaan/cakupan:
File dan commit:
Perubahan:
Bukti (source / laporan pemilik / pemeriksaan yang benar-benar dijalankan):
Deployment (lokal / pushed / pulled / built / restarted, sertakan bukti):
Belum diverifikasi / masalah terbuka:
Langkah berikutnya:
```
