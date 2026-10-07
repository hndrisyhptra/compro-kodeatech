import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { randomBytes, createHash } from 'node:crypto';
import { readFile, writeFile, chmod } from 'node:fs/promises';

const db = new PrismaClient({ log: [] });
const email = (process.env.SEED_ADMIN_EMAIL || 'admin@kodeatech.cloud').toLowerCase();

async function main() {
    const environment = await readFile('.env', 'utf8');
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new Error('Akun admin tidak ditemukan. Reset tidak dilakukan.');
    const password = randomBytes(18).toString('base64url');
    const passwordHash = await hash(password, 12);
    await db.$transaction([
        db.user.update({ where: { id: user.id }, data: { passwordHash } }),
        db.session.deleteMany({ where: { userId: user.id } }),
    ]);
    const line = `SEED_ADMIN_PASSWORD="${password}"`;
    const updated = /^SEED_ADMIN_PASSWORD=.*$/m.test(environment)
        ? environment.replace(/^SEED_ADMIN_PASSWORD=.*$/m, line)
        : `${environment.trimEnd()}\n${line}\n`;
    try {
        await writeFile('.env', updated, { mode: 0o600 });
        await chmod('.env', 0o600);
    } catch {
        console.error('Password database sudah diperbarui, tetapi .env belum tersimpan. Simpan password yang ditampilkan berikut.');
    }
    const saved = await db.user.findUniqueOrThrow({ where: { id: user.id } });
    const passwordVerified = await compare(password, saved.passwordHash);
    console.log(JSON.stringify({ reset: true, email, password, passwordVerified }));

    const origin = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
    if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname)) return;
    let sessionHash;
    try {
        const response = await fetch(`${origin}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Origin: origin },
            body: JSON.stringify({ email, password }),
            signal: AbortSignal.timeout(20000),
        });
        const cookie = response.headers.get('set-cookie')?.match(/kodea_session=([^;]+)/)?.[0];
        if (cookie) sessionHash = createHash('sha256').update(cookie.slice('kodea_session='.length)).digest('hex');
        if (!response.ok || !cookie) {
            console.log(JSON.stringify({ loginVerified: false, loginStatus: response.status }));
            return;
        }
        const dashboard = await fetch(`${origin}/admin/dashboard`, {
            headers: { Cookie: cookie },
            redirect: 'manual',
            signal: AbortSignal.timeout(20000),
        });
        const html = await dashboard.text();
        console.log(JSON.stringify({ loginVerified: true, dashboardVerified: dashboard.status === 200 && html.includes('Welcome back'), dashboardStatus: dashboard.status }));
    } catch {
        console.log(JSON.stringify({ loginVerified: false, reason: 'Password tersimpan; server lokal belum dapat diverifikasi.' }));
    } finally {
        if (sessionHash) await db.session.deleteMany({ where: { tokenHash: sessionHash } });
    }
}

main().catch(() => {
    console.error('Reset gagal. Periksa koneksi database dan pastikan akun SEED_ADMIN_EMAIL tersedia.');
    process.exitCode = 1;
}).finally(() => db.$disconnect());
