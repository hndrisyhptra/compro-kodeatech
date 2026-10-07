# Peta fitur dan arsitektur

Snapshot source 7 Oktober 2026. Keberadaan kode di bawah tidak berarti seluruh alur telah diuji end-to-end pada VPS; lihat [STATUS.md](STATUS.md).

## Stack dan alur data

Next.js App Router + React + TypeScript strict + Tailwind CSS 4; animasi Framer Motion, icon Lucide, editor Tiptap, Prisma/MySQL, bcryptjs, Zod, sanitize-html, Sharp. Font Geist lokal. Versi lockfile saat snapshot: Next **16.3.8**, React **19.3.0**, Prisma **6.19.0**. Gunakan `package-lock.json` untuk instalasi yang konsisten.

Alur public: Server Component → service konten/settings/SEO → Prisma → MySQL → komponen tampilan. Alur CMS: editor/picker → `hooks/use-admin.ts` → API dengan Origin/session/CSRF/RBAC → validasi/sanitasi → Prisma/storage → refresh tampilan. Media: input device → validasi dan optimasi Sharp → file UUID WebP → metadata MySQL → URL `/media/YYYY/MM/uuid.webp`.

| Lokasi | Tanggung jawab |
| --- | --- |
| `app/(public)/page.tsx` | Homepage, mengambil data featured dan settings |
| `app/(public)/[section]/page.tsx` | Halaman daftar, about, contact, careers, legal |
| `app/(public)/[section]/[slug]/page.tsx` | Detail service, solution, case study, blog |
| `app/admin/` dan `components/admin/` | Login, shell, dashboard, CMS/editor/media/settings/users |
| `features/cms/config.ts` | Resource registry, label, field tambahan editor |
| `services/content.ts` | Repository konten, publikasi, query/upsert, sinkronisasi relasi |
| `services/settings.ts`, `services/seo.ts` | General settings, metadata halaman |
| `lib/auth.ts`, `lib/api.ts`, `lib/validation.ts` | Session, Origin/CSRF/RBAC/rate limit, error API, schema input |
| `lib/db.ts`, `lib/html.ts`, `lib/media-validation.ts` | Prisma, sanitasi HTML, validasi referensi media |
| `lib/storage.ts`, `app/media/[...path]/route.ts` | Path storage aman, penghapusan file, serving gambar |
| `database/` | Prisma schema, migration, seed, SQL untuk phpMyAdmin |
| `deployment/`, `ecosystem.config.cjs` | Contoh reverse proxy dan PM2; perlu disesuaikan dengan server aktual |

## Website public

| URL | Isi |
| --- | --- |
| `/` | Hero, Client Wall, about/statistik, services, solutions, technologies, featured portfolio, testimonial, insight, CTA |
| `/about` | Profil perusahaan, statistik, team |
| `/services`, `/services/[slug]` | Daftar dan detail layanan; benefits/features/technology/workflow/FAQ/CTA |
| `/solutions`, `/solutions/[slug]` | Solusi dan capabilities/outcomes |
| `/portfolio`, `/portfolio/[slug]` | Filter/search case study, challenge/solution/result, metrics, gallery, teknologi, tanggal, URL |
| `/blog`, `/blog/[slug]` | Artikel, filter/search, rich content, kategori/tag, author, jadwal publikasi, SEO |
| `/testimonials`, `/partners` | Testimonial dan mitra published |
| `/contact` | Informasi CMS, Maps embed, form inquiry, WhatsApp/social |
| `/careers` | Konten halaman dan kontak email; belum ada sistem lowongan/aplikasi pelamar |
| `/privacy-policy`, `/terms` | Konten legal dari Pages |
| `/sitemap.xml`, `/robots.txt` | Endpoint SEO |

Halaman section memerlukan record Page published dengan slug yang sesuai. Tidak adanya record dapat menghasilkan 404 meski template tersedia. Detail hanya untuk empat jenis resource di atas; item draft tersembunyi dan scheduled tampil setelah `publishedAt` terlewati, tanpa cron publikasi.

Locale konten `en`/`id` dengan pasangan slug/locale unik. Section/detail mendukung `?lang=id`; homepage default Inggris dan propagasi bahasa di link internal belum lengkap. Ini bukan sistem multilingual menyeluruh yang sudah selesai.

## Desain yang telah disesuaikan

- Premium navy/blue/cyan/white, tanpa gradient; hero ilustrasi jaringan berbasis kode, dark/light mode tersimpan di browser, mobile menu, animasi halus/reduced motion.
- `components/brand-logo.tsx` menggunakan `public/logo-kodea.png` transparan dan crop berbasis CSS. Jika komposisi/dimensi file berubah, cek crop komponen. Public dapat memakai logo Settings; logo admin hanya sidebar, bukan topbar. Login memiliki branding sendiri.
- Favicon default `public/icon.svg`, dipilih melalui `lib/branding.ts` dengan versi cache `kodea-transparent-20261006`. Favicon custom CMS tetap dipertahankan.
- `components/client-logo-wall.tsx`: semua partner published diurutkan CMS, logo besar tanpa card/background/border. Scroll pelan sekitar 20 px/detik, kontrol pause/panah, mouse drag/touch/keyboard; pause saat hover/focus, tab tidak aktif, offscreen, dan reduced motion.
- `components/testimonial-slider.tsx`: tiga card desktop, dua tablet, satu mobile; paginasi tiga item. Homepage memakai featured published. Untuk tiga card terisi, perlu setidaknya tiga testimonial yang memenuhi syarat; seed hanya memiliki satu contoh.
- Foto testimonial 80 px desktop/72 px mobile. `components/admin/profile-photo-field.tsx` memberi preview bulat, zoom 100–300%, posisi X/Y, reset/remove. `lib/profile-photo.ts` menyimpan/clamp `data.photoCrop`; `components/profile-photo.tsx` menampilkan crop tanpa mengubah file asli.
- ImageField, MediaChooser, gallery, dan rich editor mendukung upload/pilih media dari laptop/HP; bukan hanya URL. Menghapus pilihan pada form berbeda dengan menghapus file di Media Library.

## Admin CMS

`/admin` mengarahkan ke `/admin/dashboard`; login `/admin/login`. Resource melalui `/admin/[resource]`, `/admin/[resource]/new`, dan `/admin/[resource]/[id]`:

| Resource | Field/fungsi khas |
| --- | --- |
| Pages | Konten halaman, eyebrow, section title/text |
| Services | Icon, benefits, features, teknologi, workflow, FAQ `question | answer` |
| Solutions | Icon, capabilities/features, outcomes/benefits |
| Portfolio | Client/category, thumbnail/cover/gallery, challenge/solution/result, metrics `value | label`, technology, date, URL |
| Blog | Tiptap, kategori/tag, author display, read time, jadwal publikasi |
| Testimonials | Nama, posisi, perusahaan, rating, foto/crop, featured/status |
| Partners | Logo, kategori, website, description, urutan/status |
| Team | Nama, posisi, foto, bio, LinkedIn/Instagram, urutan/status |
| Technologies | Nama, logo/image, kategori, simbol, urutan/status |

Field bersama: title, slug otomatis/manual, locale, excerpt, rich content, image, draft/published/scheduled, featured, sortOrder, publishedAt, SEO title/description/keywords/OG/canonical dan `data` JSON untuk field khusus. Periksa schema/editor per resource saat menambah field.

| Menu khusus | Fungsi |
| --- | --- |
| Dashboard | Count projects/services/blog/testimonials/partners, unread inquiries; pesan/project terbaru, bar inquiry enam bulan, quick actions |
| Media | Upload JPEG/PNG/WebP/AVIF, optimasi WebP, preview/search/pagination, edit alt/title/description, copy URL, hapus dengan proteksi referensi |
| Settings | Company/logo/favicon/contact/social/Maps/copyright; hero/CTA/about/stats/visual; analytics/Search Console dan SEO global |
| SEO | Metadata per page/resource dan global settings |
| Contact Messages | Unread/read/replied/archived, catatan internal; reply melalui mailto, tanpa pengiriman SMTP otomatis |
| Users | Admin user, active status, role OWNER/EDITOR/VIEWER; mutation users hanya OWNER |

Settings row `general` wajib ada. OWNER mengatur users/settings; EDITOR melakukan mutation konten/media/SEO/pesan; VIEWER akses baca. Cek enforcement di API, bukan hanya menu yang disembunyikan. Utility topbar tidak otomatis berarti semua interaksi sudah memiliki fitur backend.

Editor Tiptap: headings, paragraph, bold/italic, links, images, list, quote, code block. HTML disanitasi di backend. Konten utama berasal dari database, tetapi beberapa heading section, value about, CTA dan navigation label masih literal dalam source; kebutuhan seluruh copy editable belum sepenuhnya tercapai.

## API dan model data

| Endpoint | Method utama |
| --- | --- |
| `/api/auth/login`, `/api/auth/logout` | POST |
| `/api/contact` | POST, validasi/rate limit, simpan inquiry |
| `/api/admin/content/[resource]` | GET, POST upsert, DELETE |
| `/api/admin/media` | GET, POST upload, PATCH metadata, DELETE |
| `/api/admin/settings`, `/api/admin/seo`, `/api/admin/messages` | POST |
| `/api/admin/users` | POST, DELETE |
| `/media/[...path]` | GET file yang memiliki record media |

Sumber tabel/relasi: `database/schema.prisma`. Model mencakup roles/users/sessions, settings, pages, services, solutions, portfolio/portfolio_images, technologies, testimonials, partners, team_members, blog_posts/blog_categories/blog_tags, media, contact_messages, seo_metadata, rate_limits dan join relasi. Blog berelasi author/category/tags; portfolio memiliki gallery/technologies. Jangan mengubah nama tabel/relasi hanya berdasarkan daftar dokumentasi.

Seed realistis tetapi demonstrasi: 11 layanan, 8 solusi, 15 teknologi, 5 case study, 3 artikel, placeholder partner/testimonial/team, pages/settings/SEO. Ganti atau unpublish demo sebelum menganggapnya klaim bisnis. Seed upsert tidak mereset password/konten existing; environment seed bukan password login saat ini.

## Security, SEO, dan performance yang ada di kode

- Password bcrypt; session random token di cookie HttpOnly/SameSite strict, hash token di DB, masa delapan jam, Secure saat SITE_URL HTTPS. Authenticated mutation memakai Origin tepat, CSRF dan RBAC.
- Validasi Zod, sanitasi HTML, Prisma query, persistent rate limit login/contact, honeypot contact, batas request JSON.
- Upload maksimum 5 MB dan 40 megapixel, cocokkan MIME/decoded format, rotate EXIF, resize hingga 2400×2400, WebP, UUID; SVG/executable ditolak. Path storage terkontrol. Gambar yang dipakai konten tidak boleh dihapus.
- Metadata dinamis/canonical/OG/Twitter, sitemap/robots, JSON-LD Organization/Service/Article/Breadcrumb sesuai renderer. LocalBusiness/hreflang dan kelengkapan SEO tiap halaman perlu audit; tidak dianggap otomatis lengkap.
- SSR, Next Image/format AVIF-WebP, font lokal, lazy loading, cache media; tidak ada skor Lighthouse/WCAG terkini yang terukur.

## Menambah fitur dengan pola yang sudah ada

1. Identifikasi resource existing atau modul baru; cek apakah cukup field tambahan pada `data` JSON tanpa migration.
2. Jika relasi/kolom baru diperlukan: ubah Prisma schema dan buat migration pengembangan; jangan menjalankan db push atau migration dev pada production.
3. Sesuaikan registry/extraFields, service repository, schema input, editor bersama, media validation/referensi, dan renderer public.
4. Terapkan role/Origin/CSRF pada mutation; update metadata/sitemap bila ada URL baru. Jangan buat editor/upload/session duplikat.
5. Catat implementasi dan batas verifikasi pada STATUS. Jalankan pemeriksaan aplikasi hanya sesuai instruksi terbaru pemilik.
