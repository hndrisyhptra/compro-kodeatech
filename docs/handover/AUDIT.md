# Panduan audit dan lanjut perbaikan

Audit awal berarti membaca source dan bukti yang tersedia. Ikuti [AGENTS.md](../../AGENTS.md), [STATUS.md](STATUS.md) dan permintaan terbaru pemilik. Jangan otomatis menjalankan aplikasi/testing, mengakses server, mereset password, atau mengubah data produksi untuk membuktikan temuan.

## Urutan kerja

1. Periksa git status/HEAD, struktur project, package-lock, perubahan lokal dan dokumen handover. Jangan menyamakan commit lokal dengan commit VPS.
2. Tentukan environment yang sedang dianalisis: laptop, source clone, atau VPS. Jika bukti server tidak tersedia, laporkan batas itu.
3. Cocokkan fitur/route yang relevan dengan FEATURES. Baca registry CMS, service, API, validation dan renderer terkait sebelum mengusulkan perubahan.
4. Untuk masalah terakhir, mulai dari API media/storage dan runtime aaPanel. Minta log mutation terbaru yang disamarkan bila diperlukan; source tidak dapat membuktikan permission server.
5. Laporkan temuan konkret dan prioritas. Bedakan bug terbukti lewat source, dugaan runtime yang butuh bukti, dan fitur yang memang belum dibuat.
6. Jika implementasi diminta, buat perubahan kecil yang menjaga pola existing. Dokumentasikan migration/configuration/deployment yang benar-benar dibutuhkan.
7. Update STATUS dengan bukti dan pemeriksaan yang dilakukan. Jangan mencatat hasil historis sebagai pemeriksaan baru.

## Area pemeriksaan

| Area | Hal yang perlu dicocokkan |
| --- | --- |
| Auth/RBAC | OWNER/EDITOR/VIEWER pada API, session expiry, user inactive, pencabutan session, logout VIEWER yang memakai authorizeWrite |
| Origin/CSRF/proxy | SITE_URL exact origin, x-csrf-token, cookie HTTPS, TRUST_PROXY dan header yang ditimpa Nginx; jangan bypass untuk memperbaiki deployment |
| CMS/relasi | Upsert/delete, locale+slug uniqueness, draft/scheduled filtering, category/tag/technology/gallery relations, kebutuhan Page published |
| Media | MIME/ukuran/decode, Sharp, safe storage path, permission, cleanup, pemulihan file, referenced-media rejection, image/OG/gallery/rich content/settings coverage |
| Referensi delete | Pencarian referensi memakai JSON/filename; audit kemungkinan false positive dan referensi baru yang tidak tercakup sebelum memperluas resource |
| Form/upload UX | Error/pending/success, chooser device/pagination, remove selection vs delete asset, confirm dialog saat request asynchronous, crop preview vs public |
| Contact | Validasi/honeypot/rate limit, status/notes, unread counters; mailto bukan delivery email yang diverifikasi |
| Settings/content | Field yang benar-benar tersimpan/dirender, literal copy yang belum editable, favicon/logo override, demo/published content |
| Locale | ?lang=id pada section/detail, homepage, propagasi internal link, sitemap/hreflang, duplicate slug locale |
| SEO | Metadata global/per record, canonical/OG/Twitter, JSON-LD sesuai page, robots/sitemap untuk published saja, base URL HTTPS |
| Deployment | Runtime Node/PM2 user, cwd/path, standalone vs start, private npm cache, .env vs process env, storage di luar source, backup/reboot/SSL |
| UI/accessibility | Dark/light mode, mobile menu/sidebar/tables, keyboard/focus/label/contrast, reduced motion, logo tanpa card, testimonial responsive |

Kandidat audit bukan daftar bug yang semuanya sudah terkonfirmasi. Sebagai contoh, permission storage perlu bukti server; pembatasan VIEWER pada authorizeWrite dapat dianalisis lewat alur logout source. Sertakan file dan baris aktual setelah dibaca, bukan nomor baris tebakan dari snapshot.

## Validasi bila pemilik meminta

Perintah tersedia: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, `npm run db:check`, `npm run test:media`. Lihat package.json untuk script aktual. Jangan menjalankan typecheck bersamaan dengan build karena generated `.next/types` dapat berubah.

`test:media` melakukan mutation data/file untuk pengujian lokal. Gunakan database/storage terisolasi dan cakupan yang disetujui, bukan production. Jangan menggunakan helper reset/import/seed sebagai shortcut validasi koneksi. Browser acceptance menggunakan akun/data contoh terpisah jika diperlukan, bukan menghapus foto pelanggan nyata.

Jika testing tidak diminta, cukup laporkan analisis source beserta batas runtime yang belum diverifikasi. Tidak boleh mengklaim build, CRUD, performance, WCAG atau keamanan production lulus tanpa bukti.

## Format laporan audit

```text
Cakupan dan environment:
Commit/source yang dibaca:
Ringkasan fitur relevan:

Temuan:
- Prioritas (tinggi/sedang/rendah):
- Trigger dan perilaku actual vs expected:
- Bukti: file:baris atau log/request tersamarkan:
- Status: terbukti dari source / laporan pemilik / perlu bukti runtime:
- Dampak dan perbaikan minimal:

Pemeriksaan yang dijalankan (atau tidak dijalankan):
Rencana perubahan/migration/deployment bila diperlukan:
Masalah terbuka dan konteks tambahan yang dibutuhkan:
```

Audit harus berguna untuk tindakan berikutnya, tanpa mengulang seluruh requirement awal atau menambahkan fitur di luar scope.
