# Handover KODEA TECH

Paket konteks portabel untuk akun Codex baru, audit, perbaikan, dan penambahan fitur. Snapshot: **7 Oktober 2026**. Disusun dari source project dan riwayat laporan pemilik; tidak merupakan sertifikasi production readiness.

Brand: **KODEA TECH**. Domain: **https://kodeatech.cloud**. Repository pemilik: **https://github.com/hndrisyhptra/compro-kodeatech**. Commit aplikasi terbaru yang terlihat saat penyusunan: `a91d5cd` — `Fix media deletion and storage error handling`, sebelumnya `4f12547` — `Initial KodeaTech website and CMS`. Paket handover ini dibuat setelah commit tersebut; cek HEAD aktual sebelum melanjutkan.

## Cara menggunakan pada akun lain

1. Push/transfer file project termasuk `AGENTS.md`, `docs/handover/`, dan `.agents/skills/kodeatech-maintainer/`. Jangan ikutkan secret atau backup ke Git.
2. Buka folder project/clone repository pada akun Codex baru. `AGENTS.md` memberi petunjuk awal kepada agent yang mendukung instruksi project.
3. Panggil skill `$kodeatech-maintainer` jika tercantum pada daftar skill akun baru. Jika tidak muncul, sebutkan file `docs/handover/README.md` atau `.agents/skills/kodeatech-maintainer/SKILL.md` secara langsung; dokumentasi tetap dapat digunakan tanpa instalasi skill global.
4. Mulai dengan membaca status dan audit source. Berikan instruksi terpisah ketika memang ingin implementasi, build, pengujian, atau deployment.

Contoh permintaan:

```text
Baca AGENTS.md dan docs/handover/README.md, lalu gunakan panduan
.agents/skills/kodeatech-maintainer/SKILL.md.
Audit source KodeaTech dan cocokkan dengan STATUS.md. Rangkum fitur,
temuan beserta file terkait, dan prioritas perbaikan. Jangan menjalankan
testing, mengubah database/server, atau menampilkan secret.
```

Untuk melanjutkan masalah terakhir:

```text
Baca docs/handover/STATUS.md dan OPERATIONS.md. Lanjutkan diagnosis
upload/hapus Media Library yang gagal pada aaPanel. Bedakan masalah
shell/PATH, izin storage, referensi media, dan API berdasarkan bukti.
Periksa source terlebih dahulu; saya akan memberikan log server terbaru
yang sudah disamarkan. Jangan menjalankan testing aplikasi.
```

## Peta dokumen

| File | Isi |
| --- | --- |
| [FEATURES.md](FEATURES.md) | Public site, CMS, API, model data, file utama, pola penambahan fitur |
| [STATUS.md](STATUS.md) | Pekerjaan terakhir, hasil yang dikonfirmasi, isu terbuka, batas verifikasi |
| [OPERATIONS.md](OPERATIONS.md) | Konteks VPS/aaPanel, Node/PM2, database, media, backup, diagnosis |
| [AUDIT.md](AUDIT.md) | Urutan audit source, area berisiko, format laporan, validasi opsional |
| [Skill proyek](../../.agents/skills/kodeatech-maintainer/SKILL.md) | Alur kerja Codex untuk membaca dan memperbarui konteks |
| [README utama](../../README.md) | Instalasi, migration, seed, deployment, perintah operasional |
| [VALIDATION.md](../../VALIDATION.md) | Riwayat pemeriksaan bertanggal; bukan hasil terbaru untuk setiap perubahan |

## Yang perlu ikut saat pindah environment

- **Source dan dokumentasi:** repository Git.
- **Database:** backup MySQL yang dikelola terpisah dan dipulihkan secara aman, termasuk konten, user, settings, relasi media, dan riwayat migration. Jangan unggah dump produksi ke repo/chat.
- **Media:** seluruh isi storage upload, terpisah dari Git. Database menyimpan metadata/path, bukan byte gambar.
- **Environment:** `.env` dan konfigurasi runtime/server melalui jalur privat. Buat `.env` dari `.env.example` bila memulai baru. Kredensial admin aktual tidak tersedia di dokumen ini.

Account Codex baru tidak otomatis memiliki akses VPS, MySQL, kredensial, atau seluruh chat lama. Paket ini menggantikan konteks percakapan, bukan akses infrastruktur. Cocokkan fakta bertanggal dengan kondisi terbaru; perubahan source tidak berarti sudah dipull ke VPS.
