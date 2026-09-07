// Cek mandiri untuk lib/whatsapp.ts. Jalankan: node lib/whatsapp.check.mjs
// Logika normalizeWaNumber disalin persis dari sumbernya — file .ts tidak bisa
// diimpor node langsung tanpa loader, dan menambah dependensi hanya untuk satu
// berkas cek tidak sepadan. Kalau sumbernya berubah, ubah salinan ini juga.
import assert from 'node:assert/strict';

function normalizeWaNumber(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;
  let n = digits;
  if (n.startsWith('62')) {
    // sudah benar
  } else if (n.startsWith('0')) {
    n = '62' + n.slice(1);
  } else if (n.startsWith('8')) {
    n = '62' + n;
  } else {
    return null;
  }
  if (n.length < 11 || n.length > 15) return null;
  return n;
}

function buildWaLink(phone, text) {
  const n = normalizeWaNumber(phone);
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

// --- normalisasi nomor ---
assert.equal(normalizeWaNumber('081234567890'), '6281234567890', 'awalan 0');
assert.equal(normalizeWaNumber('+62 812-3456-7890'), '6281234567890', 'plus, spasi, strip');
assert.equal(normalizeWaNumber('6281234567890'), '6281234567890', 'sudah benar');
assert.equal(normalizeWaNumber('81234567890'), '6281234567890', 'tanpa prefiks');
// Ini kasus yang membuat kode lama salah: spasi di depan membuat /^0/ tidak
// kena, lalu \D dibuang belakangan sehingga "0" hilang -> nomor salah.
assert.equal(normalizeWaNumber(' 081234567890'), '6281234567890', 'spasi di depan');
assert.equal(normalizeWaNumber(''), null, 'kosong');
assert.equal(normalizeWaNumber(null), null, 'null');
assert.equal(normalizeWaNumber('   '), null, 'spasi saja');
assert.equal(normalizeWaNumber('abc'), null, 'bukan angka');
assert.equal(normalizeWaNumber('12345'), null, 'awalan tak dikenal');
assert.equal(normalizeWaNumber('0812'), null, 'terlalu pendek');
assert.equal(normalizeWaNumber('08123456789012345'), null, 'terlalu panjang');

// --- tautan ---
assert.equal(buildWaLink('abc', 'halo'), null, 'nomor invalid -> null, bukan tautan rusak');

const link = buildWaLink('081234567890', 'Baris satu\nBaris dua & Rp15.000');
assert.ok(link.startsWith('https://wa.me/6281234567890?text='), 'prefiks');
assert.ok(link.includes('%0A'), 'baris baru ter-encode');
assert.ok(link.includes('%26'), 'ampersand ter-encode (kalau tidak, teks terpotong)');
assert.ok(!link.includes(' '), 'tidak ada spasi mentah di URL');

// Rupiah dari Intl memakai spasi tak-putus (U+00A0) — pastikan ikut ter-encode.
const rp = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(15000);
const link2 = buildWaLink('081234567890', rp);
assert.ok(!/[ ]/.test(link2), 'spasi tak-putus tidak lolos mentah ke URL');

console.log('OK: 18 pemeriksaan lulus');
