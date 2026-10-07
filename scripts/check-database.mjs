import { PrismaClient } from '@prisma/client';

const connection = process.env.DATABASE_URL;
if (!connection || connection.includes('CHANGE_ME')) {
    console.error('DATABASE_URL belum diisi dengan koneksi MySQL yang sebenarnya. Edit .env.');
    process.exitCode = 1;
} else {
    const db = new PrismaClient({ log: [] });
    try {
        await db.$queryRaw`SELECT 1`;
        const tables = await db.$queryRaw`SELECT TABLE_NAME AS name FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE()`;
        console.log(`Koneksi MySQL berhasil. ${tables.length} tabel ditemukan.`);
        if (!tables.some(table => table.name === 'settings')) {
            throw new Error('MISSING_TABLES');
        }
        const settings = await db.setting.findUnique({ where: { key: 'general' }, select: { key: true } });
        if (!settings) throw new Error('MISSING_SEED');
        console.log('Pengaturan website tersedia. Database siap digunakan.');
    } catch (error) {
        const message = String(error.message);
        if (message.includes('Authentication failed')) {
            console.error('User/password MySQL pada DATABASE_URL belum sesuai dengan server database.');
        } else if (message.includes("Can't reach database server")) {
            console.error('Server MySQL tidak terjangkau. Periksa service MySQL, host dan port pada DATABASE_URL.');
        } else if (message.includes('MISSING_TABLES') || error.code === 'P2021') {
            console.error('Tabel belum lengkap. Import database/phpmyadmin-install.sql ke database kosong, atau jalankan db:migrate lalu db:seed.');
        } else if (message.includes('MISSING_SEED')) {
            console.error('Data awal belum tersedia. Jalankan npm run db:seed.');
        } else {
            console.error('Pemeriksaan database gagal. Periksa DATABASE_URL, nama database dan izin user.');
        }
        process.exitCode = 1;
    } finally {
        await db.$disconnect();
    }
}
