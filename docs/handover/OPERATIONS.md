# Konteks operasi VPS/aaPanel

Snapshot laporan pemilik 7 Oktober 2026; **bukan inventaris server yang telah diperiksa langsung**. Contoh perintah di sini hanya panduan untuk operator di server Linux, bukan untuk dijalankan otomatis pada laptop saat membaca handover.

## Lokasi dan runtime yang dilaporkan

| Item | Nilai/keterangan |
| --- | --- |
| Host | `srv1457974` |
| Domain canonical | `https://kodeatech.cloud` |
| Source di VPS | `/www/wwwroot/compro-kodeatech` |
| Linux user aplikasi | `kodea` |
| Database | MySQL `kodeatech`; user aplikasi yang disebut `kodeatech_app`, berbeda dengan user Linux/PMA |
| Node terbaru di log | 24.21.0, aaPanel `/www/server/nodejs/v24.*/bin/node`; pastikan path aktual |
| PM2 runtime yang disarankan | `/home/kodea/pm2-runtime/node_modules/pm2/bin/pm2` |
| PM2 home/proses | `/home/kodea/.pm2`, nama proses `kodeatech` |
| Private npm cache | `/home/kodea/.npm` |
| Bind aplikasi | `127.0.0.1:3000`, Nginx reverse proxy |
| Storage production | `/www/wwwroot/kodeatech-storage/uploads` |

PM2 root dan PM2 kodea memiliki proses/daemon berbeda. Melihat status sebagai root tidak otomatis melihat proses kodea. Jangan mematikan daemon PM2 global karena satu aplikasi bermasalah.

## Memulihkan shell yang kehilangan Node/PM2

`su kodea` tidak menjamin PATH atau variabel sesi sebelumnya terbawa. `$KODEA_NODE` dan `$KODEA_PM2` bukan variabel bawaan OS. Pesan `Command '' not found` berarti command dari variabel kosong. `npm not found` berarti PATH belum menunjuk runtime yang benar; jangan langsung menginstall npm distro yang dapat memakai Node lama.

Masuk sebagai kodea menggunakan login shell dari root (`su - kodea`), lalu cek ketersediaan runtime:

```bash
find /www/server/nodejs -maxdepth 3 -path '*/v24.*/bin/node' -print
ls -l /home/kodea/pm2-runtime/node_modules/pm2/bin/pm2
```

Set path **yang benar-benar ditemukan**, jangan menyalin placeholder:

```bash
export KODEA_NODE="/www/server/nodejs/VERSI_NODE_AKTUAL/bin/node"
export KODEA_PM2="/home/kodea/pm2-runtime/node_modules/pm2/bin/pm2"
export PATH="$(dirname "$KODEA_NODE"):$PATH"
export PM2_HOME="/home/kodea/.pm2"
export npm_config_cache="/home/kodea/.npm"

"$KODEA_NODE" -v
npm -v
"$KODEA_NODE" "$KODEA_PM2" status
```

Jika PM2 file belum ada, setup runtime perlu dilakukan terlebih dahulu; jangan menganggap instalasi private sudah tersedia hanya karena tercantum di panduan. Variabel dapat disimpan pada `/home/kodea/.kodeatech-env.sh` dan di-source dari startup shell yang sesuai. Langkah permanen ini belum dikonfirmasi dilakukan. Jangan menyimpan DATABASE_URL/password dalam file shell yang dibagikan.

Log terarah setelah mengulangi error:

```bash
"$KODEA_NODE" "$KODEA_PM2" logs kodeatech --lines 60 --nostream
```

Samarkan secret, informasi pelanggan, cookie/token, dan pesan privat sebelum membagikan log. Hindari dump seluruh `.env`, `pm2 env`, atau `pm2 jlist` ke chat.

## Environment dan database

Konfigurasi nonrahasia utama:

```dotenv
SITE_URL="https://kodeatech.cloud"
STORAGE_ROOT="/www/wwwroot/kodeatech-storage/uploads"
TRUST_PROXY="true"
```

`DATABASE_URL` memakai dedicated MySQL user dengan password URL-encoded; jangan masukkan password nyata ke contoh atau repo. Nama database tidak memiliki password sendiri: aplikasi mengautentikasi sebagai user MySQL. Password login phpMyAdmin tidak otomatis membuat dedicated app user. Cocokkan host grant dengan koneksi aktual.

Runtime environment PM2 dapat mengalahkan file `.env`; Next juga dapat membaca `.env.production.local`, `.env.local`, `.env.production`, `.env`. Restart biasa tidak selalu mengganti environment yang disimpan PM2; gunakan pembaruan environment sesuai mode startup yang benar setelah konfigurasi disiapkan. Jangan berasumsi mengedit `.env` sudah mengubah SITE_URL runtime.

`Invalid request origin` harus ditangani dengan SITE_URL canonical, protokol/host/port browser, konfigurasi proxy dan runtime; jangan menghapus checkOrigin atau CSRF. TRUST_PROXY hanya aman bila Nginx menimpa header IP dan Node tidak diekspos langsung ke internet.

Jalur instalasi baru: migration + seed **atau** import SQL lengkap ke database kosong yang sudah menyediakan baseline. Untuk produksi existing gunakan migration deploy yang terencana; jangan import seed SQL ulang atau db push untuk troubleshooting. Mengubah `SEED_ADMIN_PASSWORD` tidak mereset akun existing. Helper `admin:reset-password` hanya digunakan bila reset memang diminta.

## Media/storage

Upload disimpan sebagai `YYYY/MM/UUID.webp` pada STORAGE_ROOT; referensi `/media/...` ada di DB. Storage tidak dibawa Git. `/media` dilayani route aplikasi, sehingga Nginx tidak perlu membaca file langsung pada pola saat ini.

Persiapan directory membutuhkan root karena parent `/www/wwwroot` biasanya tidak writable oleh kodea. Bila memang diminta menyiapkan storage, operator root dapat memakai:

```bash
mkdir -p /www/wwwroot/kodeatech-storage/uploads
chown -R kodea:kodea /www/wwwroot/kodeatech-storage
find /www/wwwroot/kodeatech-storage -type d -exec chmod 750 {} \;
find /www/wwwroot/kodeatech-storage -type f -exec chmod 640 {} \;
```

Batasi perubahan hanya pada directory storage tersebut; jangan chmod 777, chown seluruh wwwroot, atau mengubah cache bersama aaPanel. Periksa user proses dan izin parent directory juga. Batas aplikasi 5 MB, proxy contoh 6 MB. Hapus ditolak jika media masih dipakai konten/settings/SEO. File fisik yang hilang boleh ditoleransi saat menghapus record tidak terpakai; permission error tidak boleh diabaikan.

## Build, process manager, proxy

- Gunakan npm lockfile, install dependency build dengan private cache. Source server harus writable untuk user yang membangun; bukan mengubah permission global aaPanel.
- **Ketidaksesuaian yang masih ada:** repo mengaktifkan `output: standalone` tetapi contoh start memakai next start. Untuk standalone gunakan `.next/standalone/server.js`, salin `public` dan `.next/static` ke layout standalone yang sesuai, bind HOSTNAME/PORT internal, serta absolute STORAGE_ROOT. Alternatif standard next start perlu keputusan eksplisit mengubah output dan rebuild. Jangan menerapkan campuran tanpa audit.
- **Contoh cwd lama:** ecosystem.config.cjs `/www/wwwroot/kodeatech.cloud`; source aktual `/www/wwwroot/compro-kodeatech`. Cocokkan juga script/interpreter/env dengan mode yang dipilih sebelum memakai config itu.
- Nginx aaPanel proxy `/` menuju `http://127.0.0.1:3000`, Host diteruskan, X-Real-IP dan X-Forwarded-For ditimpa dari remote_addr, X-Forwarded-Proto mengikuti scheme. Pertahankan ACME/SSL location dan hindari duplicate location dengan konfigurasi aaPanel.
- Jangan cache response admin/auth/API atau meneruskan ke default index.html. Bind localhost, DNS domain benar, SSL valid, arahkan domain alternatif ke canonical. Tidak perlu membuka port 3000 ke internet.
- PM2 save/startup harus memakai user/runtime yang benar. Startup setelah reboot dan renewal SSL belum terbukti melalui handover ini.

README utama memuat tahapan instalasi/deployment. Sebelum update production, cek perubahan lokal server, backup data, install/build sesuai mode, migration bila diperlukan, lalu restart proses yang benar. Build adalah tindakan deployment tersendiri, bukan bagian otomatis dari audit source.

## Backup dan pindah environment

Backup **MySQL + storage upload + konfigurasi privat** secara terpisah dari source. Gunakan timestamp, permission terbatas, retensi dan lokasi di luar web root publik. Jangan menaruh `.env`/dump di public atau Git. DB dump berisi data pribadi/password hash/session; perlakukan sebagai data sensitif.

Restore harus menjaga pasangan filename metadata dan file fisik, grants MySQL, env domain, ownership storage, migration history serta runtime. Uji restore pada environment terisolasi hanya bila validasi memang diminta. Clone baru tanpa restore data bukan replika production.
