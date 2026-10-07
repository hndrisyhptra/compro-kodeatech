import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { unlink } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import sharp from 'sharp';

// Integration fixtures stay private, are never published, and are removed after the test.
const origin = new URL(process.env.SITE_URL || 'http://localhost:3000').origin;
if (!['localhost', '127.0.0.1'].includes(new URL(origin).hostname)) throw new Error('Media checks are allowed only against localhost.');
const db = new PrismaClient();
const userIds = [], mediaIds = [], projectIds = [];

async function createUser(roleName) {
    const role = await db.role.findUniqueOrThrow({ where: { name: roleName } });
    const email = `media-check-${randomUUID()}@example.invalid`;
    const password = randomBytes(24).toString('base64url');
    const user = await db.user.create({ data: { email, name: 'Temporary media check', roleId: role.id, active: true, passwordHash: await hash(password, 12) } });
    userIds.push(user.id);
    return { id: user.id, email, password };
}
async function login(user) {
    const response = await fetch(`${origin}/api/auth/login`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email, password: user.password }) });
    assert.equal(response.status, 200, 'Test account login');
    const cookie = response.headers.get('set-cookie').match(/kodea_session=[^;]+/)[0];
    const session = await db.session.findFirstOrThrow({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    return { Cookie: cookie, Origin: origin, 'x-csrf-token': session.csrfToken };
}
async function main() {
    const owner = await createUser('OWNER');
    const headers = await login(owner);
    assert.equal((await fetch(`${origin}/api/admin/media`)).status, 401, 'Unauthenticated library access denied');
    const viewer = await createUser('VIEWER');
    const viewerHeaders = await login(viewer);
    assert.equal((await fetch(`${origin}/api/admin/media`, { headers: viewerHeaders })).status, 200, 'Viewer can read library');
    assert.equal((await fetch(`${origin}/api/admin/media`, { method: 'POST', headers: viewerHeaders, body: new FormData() })).status, 403, 'Viewer upload denied');
    const name = `media-api-check-${randomUUID()}.png`;
    const png = await sharp({ create: { width: 32, height: 24, channels: 4, background: { r: 36, g: 85, b: 245, alpha: 0.5 } } }).png().toBuffer();
    function form(bytes, type, filename = name) { const body = new FormData(); body.set('file', new File([bytes], filename, { type })); return body; }
    assert.equal((await fetch(`${origin}/api/admin/media`, { method: 'POST', headers: { Cookie: headers.Cookie, Origin: origin }, body: form(png, 'image/png') })).status, 403, 'CSRF required');
    assert.equal((await fetch(`${origin}/api/admin/media`, { method: 'POST', headers, body: form('<svg/>', 'image/svg+xml') })).status, 422, 'Executable image format denied');
    assert.equal((await fetch(`${origin}/api/admin/media`, { method: 'POST', headers, body: form(png, 'image/jpeg') })).status, 422, 'Spoofed MIME denied');
    assert.equal((await fetch(`${origin}/api/admin/media`, { method: 'POST', headers, body: form(Buffer.alloc(5 * 1024 * 1024 + 1), 'image/png') })).status, 422, 'Oversized image denied');
    const upload = await fetch(`${origin}/api/admin/media`, { method: 'POST', headers, body: form(png, 'image/png') });
    assert.equal(upload.status, 201, 'Device image upload');
    const asset = await upload.json(); mediaIds.push(asset.id);
    assert.equal(asset.mime, 'image/webp'); assert.equal(asset.width, 32); assert.equal(asset.height, 24);
    const imageResponse = await fetch(`${origin}/media/${asset.filename}`);
    assert.equal(imageResponse.status, 200); assert.equal(imageResponse.headers.get('content-type'), 'image/webp');
    assert.equal((await sharp(Buffer.from(await imageResponse.arrayBuffer())).metadata()).hasAlpha, true, 'Transparent logos remain transparent');
    const listing = await fetch(`${origin}/api/admin/media?search=${encodeURIComponent(name)}`, { headers });
    assert.equal(listing.status, 200); assert.match(listing.headers.get('cache-control'), /no-store/);
    assert.equal((await listing.json()).items[0].id, asset.id, 'Library search finds uploaded asset');
    const url = `/media/${asset.filename}`;
    const record = { title: 'Temporary media verification', slug: `media-check-${randomUUID()}`, locale: 'en', excerpt: '', content: `<p>Upload verification</p><img src="${url}" alt="Test image">`, image: url, ogImage: url, data: { thumbnail: url, gallery: [url] }, status: 'draft', featured: false, sortOrder: 0, seoTitle: '', seoDescription: '', canonical: '', keywords: '', publishedAt: null };
    const saved = await fetch(`${origin}/api/admin/content/portfolio`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ record }) });
    assert.equal(saved.status, 200, 'Cover, thumbnail, gallery, rich text and OG image save together');
    const project = await saved.json(); projectIds.push(project.id);
    const stored = await db.portfolio.findUniqueOrThrow({ where: { id: project.id }, include: { images: true } });
    assert.equal(stored.image, url); assert.equal(stored.ogImage, url); assert.equal(stored.images[0].url, url);
    assert.equal((await fetch(`${origin}/api/admin/media`, { method: 'DELETE', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: asset.id }) })).status, 409, 'Referenced images cannot be deleted');
    // Invalid new homepage image URLs are checked before any settings write.
    const setting = await db.setting.findUniqueOrThrow({ where: { key: 'general' } });
    assert.equal((await fetch(`${origin}/api/admin/settings`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...setting.value, heroImage: '/media/not-in-library.webp' }) })).status, 422, 'Homepage images must be managed media');
    console.log('PASS: authenticated search, role/CSRF restrictions, file validation, WebP/alpha preservation, persisted image fields and deletion protection.');
}
try { await main(); } finally {
    for (const id of projectIds) await db.portfolio.delete({ where: { id } });
    for (const id of mediaIds) {
        const media = await db.media.findUnique({ where: { id } });
        if (media) { const { resolve } = await import('node:path'); await unlink(resolve(process.env.STORAGE_ROOT || './storage/uploads', media.filename)); await db.media.delete({ where: { id } }); }
    }
    for (const id of userIds) await db.user.delete({ where: { id } });
    await db.$disconnect();
}
