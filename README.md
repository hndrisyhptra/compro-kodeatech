# KODEA TECH

Website company profile dan CMS penuh untuk target VPS/aaPanel. Stack: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, Framer Motion, Lucide, Prisma 6, MySQL 8, Tiptap, dan Sharp. Rendering public dilakukan di server; konten diambil dari database, bukan fallback hardcode di komponen.

## 1. Installation

Gunakan Node.js 22.12+ atau 24 LTS dan npm. Dari direktori project:

```bash
npm ci
cp .env.example .env
```

Project yang diserahkan sudah memiliki `.env` lokal dengan password admin unik. File tersebut diabaikan Git. Jangan menyalin kredensial contoh ke production.

## 2. Environment variables

Isi `.env`:

```dotenv
DATABASE_URL="mysql://kodea:PASSWORD_URL_ENCODED@127.0.0.1:3306/kodeatech"
SITE_URL="http://localhost:3000"
SEED_ADMIN_EMAIL="admin@kodeatech.cloud"
SEED_ADMIN_PASSWORD="a-long-unique-password-at-least-12-characters"
STORAGE_ROOT="./storage/uploads"
TRUST_PROXY="false"
GOOGLE_ANALYTICS_ID=""
GOOGLE_SITE_VERIFICATION=""
```

URL-encode karakter khusus password database. Jangan gunakan awalan `NEXT_PUBLIC_` untuk secret. `SITE_URL` harus sama dengan origin browser, termasuk port; misalnya gunakan localhost di kedua tempat, bukan mencampur localhost dan 127.0.0.1. Untuk production gunakan `https://kodeatech.cloud`. Tambahkan `MYSQL_PASSWORD` dan `MYSQL_ROOT_PASSWORD` hanya bila menggunakan Docker Compose. Analytics dan Search Console juga dapat disetel melalui Settings; environment variable memiliki prioritas.

## 3. Database setup — phpMyAdmin

File **`database/phpmyadmin-install.sql`** berisi schema MySQL lengkap, foreign key, seed, akun admin, dan baseline Prisma migration. File **`database/schema-only.sql`** menyediakan schema tanpa data awal.

1. Buat database `kodeatech` dengan charset `utf8mb4` / collation `utf8mb4_unicode_ci` melalui aaPanel/phpMyAdmin.
2. Pilih database tersebut, buka tab **Import**, pilih `phpmyadmin-install.sql`, lalu jalankan. Gunakan database kosong. Jangan meng-import ulang ke database yang sudah berisi data.
3. Buat user database khusus dan berikan akses hanya ke database tersebut. Isi koneksi pada `DATABASE_URL`.
4. Akun admin menggunakan `SEED_ADMIN_EMAIL`. Password awal ada dalam `.env` lokal pada `SEED_ADMIN_PASSWORD`; SQL menyimpan hash bcrypt, bukan plaintext.
5. Jika ingin mengganti password seed sebelum export, edit `.env`, kemudian jalankan `npm run db:export`. Import file SQL yang baru. Mengubah `.env` saja tidak mengubah akun yang sudah di-import.

Alternatif menggunakan server MySQL yang sudah ada:

```sql
CREATE DATABASE kodeatech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'kodea'@'localhost' IDENTIFIED BY 'YOUR_DATABASE_PASSWORD';
GRANT ALL PRIVILEGES ON kodeatech.* TO 'kodea'@'localhost';
```

Alternatif development dengan Docker (bila terpasang): isi kedua password Docker di `.env`, kemudian `docker compose up -d mysql`. Database dan storage aplikasi harus tetap menggunakan MySQL; tidak ada database fallback saat koneksi gagal.

## 4. Migration

Jika database belum di-import melalui phpMyAdmin:

```bash
npm run db:generate
npm run db:migrate
```

Jika SQL lengkap sudah di-import, baseline migration sudah tercatat; `npm run db:migrate` aman untuk migration berikutnya. Untuk pengembangan schema gunakan `npm run db:dev -- --name nama_perubahan`, commit folder migration baru, dan jalankan `db:migrate` pada production. Jangan gunakan `db:dev` atau `db push` untuk production. Jangan menjalankan migration dan import schema terhadap database yang sama tanpa baseline.

## 5. Seed

```bash
npm run db:seed
```

Seed bersifat idempotent: tidak menimpa konten atau password admin yang sudah ada. Isinya 11 layanan, 8 solusi, 15 teknologi, 5 studi kasus demonstrasi, 3 artikel, placeholder partner/testimonial, tim berdasarkan fungsi, serta halaman public. Nama partner dan studi kasus sengaja diberi label contoh. Ganti atau unpublish contoh, nomor WhatsApp, alamat, statistik, kebijakan, dan informasi perusahaan sebelum publikasi. Jangan menganggapnya sebagai klaim klien atau pengalaman perusahaan.

## 6. Development

```bash
npm run dev
```

Public: `http://localhost:3000`. Admin: `/admin/login`. Login dengan akun yang ditentukan melalui seed/SQL. Tidak ada password admin hardcode atau bypass autentikasi. Draft tidak tampil public; konten scheduled tampil otomatis ketika tanggal publikasi terlewati. Pengaturan theme disimpan di browser. Halaman Bahasa Indonesia dapat dibuat dengan locale `id` dan slug sama; akses public menggunakan `?lang=id`. Default konten adalah English. Brand/navigation global mengikuti pengaturan perusahaan.

### CMS

- **Pages**: judul, deskripsi, konten, status, bahasa, SEO. **Settings**: hero, CTA, about, statistics, logo/favicon, kontak, sosial, analytics.
- **Services/Solutions**: CRUD, ikon, benefits, features, technology, workflow, FAQ.
- **Portfolio**: client, category, thumbnail, cover, gallery dengan upload dan pengurutan gambar, challenge/solution/result, technology, date, URL, featured, status, SEO.
- **Blog**: Tiptap rich editor (headings, bold/italic, lists, links, images, quotes, code), category/tags, author, drafts and scheduling.
- **Testimonials/Partners/Team/Technologies**: CRUD dan pengurutan. Status Published adalah aktif; Draft adalah nonaktif. Featured memilih konten homepage. Client Wall homepage menampilkan seluruh partner Published sesuai urutan CMS, dengan logo lebih besar tanpa kartu atau bingkai, pergerakan pelan, tombol jeda/panah, dan geser mouse atau sentuhan. Pergerakan berhenti saat hover/fokus, tab tidak aktif, area di luar layar, atau preferensi reduced motion aktif. Testimonial ditampilkan dalam tiga kolom di desktop, dua di tablet, dan satu di HP; lebih dari tiga testimonial memiliki navigasi halaman. Agar homepage berisi tiga kartu, sediakan minimal tiga testimonial Published dengan Featured aktif. Ikon dapat dipilih melalui nama yang dijelaskan di form.
- **Testimonial profile photo**: setelah upload dari device atau memilih Media Library, atur Zoom, Horizontal position, dan Vertical position di tab Content. Pratinjau lingkaran memakai pengaturan yang sama dengan website. Klik Save changes untuk menyimpan; Reset position mengembalikan posisi tengah dan zoom 100%. Pengaturan disimpan dalam data testimonial, gambar asli tetap di Media Library, dan tidak diperlukan migration database baru.
- **Media**: upload, preview, search, orientation filter, metadata, copy URL, delete. Gambar yang masih direferensikan konten tidak dapat dihapus sampai referensinya dilepas. Semua field logo/foto/gambar menyediakan **Upload from device** (pemilih file laptop atau galeri foto HP) dan **Choose from library** (pilih gambar tanpa menyalin URL). Tombol gambar pada rich editor memakai pemilih yang sama. Format JPEG/PNG/WebP/AVIF, maksimal 5 MB per file. Preview, hapus pilihan, upload beberapa gambar dan pengurutan tersedia untuk galeri portfolio. Gambar yang dihapus dari form tetap berada di library sampai dihapus melalui menu Media. Klik Save setelah upload selesai untuk menerapkan pilihan. Hero/About homepage memiliki gambar opsional di Settings; logo tampil di header/footer dan logo teknologi pada homepage. Tidak perlu migration/import SQL baru karena field disimpan dalam struktur media dan settings yang sudah ada.
- **Messages**: unread/read/replied/archived, internal notes. Membuka inquiry menandainya sebagai read. Tombol reply membuka aplikasi email; situs tidak mengirim email otomatis.
- **SEO**: metadata public pages. SEO detail dikelola dalam item terkait. SEO global di Settings.
- **Roles**: OWNER mengelola semua termasuk settings/users; EDITOR mengelola konten/media/inquiries/SEO; VIEWER read-only. User nonaktif tidak bisa login. Perubahan user membatalkan session user tersebut.

Tes integrasi media lokal tambahan: jalankan server development, lalu `npm run test:media`. Tes membutuhkan MySQL aktif, membuat akun/data uji sementara, memeriksa upload, pencarian, CSRF/RBAC, validasi file dan penyimpanan cover/galeri/SEO, lalu membersihkannya. Hanya diizinkan untuk target localhost.

## 7. Quality checks & production build

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Build tidak memerlukan koneksi database karena public pages dirender secara dinamis; menjalankan website memerlukan MySQL yang sudah dimigration dan diseed. Lihat `VALIDATION.md` untuk hasil pemeriksaan saat penyerahan. Tidak ada klaim skor Lighthouse sebelum pengukuran pada deployment nyata.

## 8. Deployment VPS / aaPanel

1. Pasang Node.js 24 LTS, MySQL 8.x, Nginx, dan PM2 melalui aaPanel/OS. Pilih aplikasi Node, bukan PHP.
2. Buat website/domain `kodeatech.cloud`. Letakkan source di `/www/wwwroot/kodeatech.cloud` dan database user khusus. Import SQL lengkap atau gunakan migration + seed.
3. Isi `.env` production, `SITE_URL=https://kodeatech.cloud`, `DATABASE_URL` private, `STORAGE_ROOT=/www/wwwroot/kodeatech-storage/uploads`, `TRUST_PROXY=true` hanya jika Nginx meng-overwrite X-Real-IP dan port Node hanya listen localhost.
4. Jalankan sebagai user aplikasi dengan akses source dan storage:

```bash
npm ci
npm run db:migrate
# Seed hanya jika belum menggunakan SQL lengkap
npm run db:seed
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

5. `ecosystem.config.cjs` menggunakan satu process Next.js di `127.0.0.1:3000`. aaPanel Node Project juga dapat menggunakan `npm start`; gunakan hanya satu process manager. Environment `.env` dibaca oleh Next; restart PM2 setelah mengubahnya.
6. Tambahkan konfigurasi `deployment/nginx.conf` di server block website. Preserve konfigurasi SSL/ACME milik aaPanel. Set request body limit 6 MB. Jangan expose root source sebagai PHP/static directory.
7. Reload Nginx dan periksa public pages, login, upload, inquiry, `/sitemap.xml`, dan `/robots.txt` setelah deployment.
8. Untuk update: backup DB/media, `npm ci`, `npm run db:migrate`, `npm run build`, lalu `pm2 restart kodeatech --update-env`. Jangan jalankan seed untuk overwrite konten.

Output standalone tersedia. Bila menjalankan `node .next/standalone/server.js`, copy `.next/static` ke `.next/standalone/.next/static` dan `public` ke `.next/standalone/public`, set `HOSTNAME=127.0.0.1`, `PORT=3000`, dan `STORAGE_ROOT` absolut. Cara PM2 di atas tidak memerlukan pemindahan file standalone.

## 9. Domain configuration

Atur record A `kodeatech.cloud` ke IP VPS. Opsional CNAME `www` menuju domain utama. Tunggu propagasi DNS dan tambahkan kedua domain ke website aaPanel. Arahkan `www` ke canonical `https://kodeatech.cloud` dengan redirect 301. Jangan cache `/admin`, `/api`, form, atau session lewat CDN.

## 10. SSL

Gunakan Let's Encrypt melalui aaPanel setelah DNS benar. Aktifkan renewal otomatis dan force HTTPS; session cookie Secure aktif ketika `SITE_URL` HTTPS. Jangan gunakan SSL self-signed untuk production. HSTS dapat diaktifkan di Nginx setelah HTTPS dan subdomain siap.

## 11. Database backup

Gunakan scheduled backup aaPanel harian dengan retensi dan salinan off-server terenkripsi. Untuk CLI, gunakan MySQL login-path / file credential berpermission 600 agar password tidak tampil dalam process list:

```bash
mysqldump --login-path=kodea_backup --single-transaction --routines --triggers kodeatech > kodeatech-backup.sql
mysql --login-path=kodea_backup kodeatech < kodeatech-backup.sql
```

Uji restore secara berkala di database terpisah. Backup database dan media pada waktu yang berdekatan; simpan `.env` secara aman dan jangan ikutkan ke backup public.

## 12. Media storage

File tersimpan di `STORAGE_ROOT/YYYY/MM/UUID.webp`, metadata di tabel `media`. Upload dibatasi 5 MB, JPEG/PNG/WebP/AVIF, divalidasi format hasil decode, diproses Sharp, dibatasi 40 megapixel, dan diresize maksimal 2400 px. SVG/file executable ditolak. File disajikan lewat `/media/...` dengan cache immutable dan next/image responsive. Pastikan direktori dapat dibaca/ditulis user Node; gunakan direktori 750/file 640 dan ownership user aplikasi. Jangan gunakan chmod 777. Storage di luar source memudahkan deployment dan backup. Pindahkan seluruh folder, lalu update `STORAGE_ROOT`; URL tetap sama. Storage harus shared bila suatu saat memakai beberapa server.

## Security & operating notes

Session token random disimpan sebagai hash di DB, cookie HttpOnly/SameSite, bcrypt cost 12, pemeriksaan origin dan CSRF token untuk mutation admin, validation Zod, sanitized rich HTML, parameterized Prisma queries, role checks di server, dan rate limit persisten di MySQL. Login dibatasi 8 attempt/15 menit; contact 5 inquiry/jam per IP ketika trusted proxy aktif. Development memakai satu bucket lokal. Bersihkan tabel rate_limits yang expired secara terjadwal bila volume besar. CSP, frame protection dan MIME sniff protection dikonfigurasi. Editor dan upload hanya untuk authenticated users. Analytics memerlukan consent.

Structured data Organization, Service, Article, Breadcrumb, dynamic canonical/OG/Twitter, robots dan sitemap sudah tersedia. LocalBusiness schema tidak dipasang sampai alamat kantor yang benar tersedia. Template Privacy/Terms adalah konten awal yang perlu disesuaikan dengan operasional perusahaan.

Chart dashboard memakai data inquiry aktual. Hero network dan project concept visuals dibuat dari SVG/CSS, tanpa stock image dan tanpa gradient. Komponen konten reusable, server/database logic dipisahkan. Model database memakai tabel terpisah dengan common publication fields, JSON terstruktur untuk detail fleksibel, serta relasi author/categories/tags, portfolio technologies dan gallery.

## Project structure

```
app/          public routes, admin routes, REST endpoints, metadata
components/   reusable public UI and admin UI
features/cms/ resource registry and field definitions
services/     database repositories, settings and SEO
lib/          auth, validation, sanitization, storage, database
hooks/        reusable admin request state
types/        shared TypeScript interfaces
database/     schema, migrations, seed and phpMyAdmin SQL
public/       favicon and self-hosted Geist font
storage/      managed uploads (ignored by Git)
deployment/   Nginx example
tests/        security and workflow validation
```

## Troubleshooting localhost:3000

Pesan “We couldn't load this page” dapat muncul jika koneksi database belum sesuai atau data awal belum tersedia. Membuat database di phpMyAdmin saja tidak mengubah koneksi website.

```bash
npm run db:check
```

Untuk XAMPP lokal dengan konfigurasi bawaan user root, tanpa password, dan port 3306, gunakan `.env`:

```dotenv
DATABASE_URL="mysql://root@127.0.0.1:3306/kodeatech"
SITE_URL="http://localhost:3000"
```

Gunakan kredensial aktual jika konfigurasi XAMPP berbeda. Koneksi root ini hanya contoh development lokal; production tetap menggunakan user khusus database seperti panduan deployment. Setelah mengubah `.env`, restart development server (Ctrl+C, lalu `npm run dev`) bila halaman masih menunjukkan koneksi lama. Prisma client development juga mengikuti perubahan DATABASE_URL saat module dimuat ulang. Jangan import ulang SQL lengkap ke database yang sudah berisi 23 tabel dan data awal.

### Reset password admin

Jika password admin hilang, jalankan `npm run admin:reset-password`. Perintah ini mengganti password akun SEED_ADMIN_EMAIL dengan password acak baru, menghapus session lama akun tersebut, serta menyimpan password baru di .env. Password ditampilkan satu kali di terminal. Jalankan hanya saat memang ingin mengganti password; command ini tidak membuat akun baru atau mengganti role. Pada localhost, command juga memeriksa login dan dashboard, lalu menghapus session pengujian.
