import { formatRupiah } from '@/lib/categories';

/**
 * Pembangun pesan & tautan WhatsApp.
 *
 * Semua "otomatis" di sini hanya menyiapkan tautan wa.me berisi teks jadi.
 * Tidak ada pesan yang dikirim dari server — manusia yang menekan kirim.
 */

/**
 * Ubah nomor apa pun jadi format wa.me (62xxxx, tanpa + dan tanpa pemisah).
 *
 * Urutan penting: buang non-digit DULU, baru urus awalan. Kode lama memakai
 * urutan terbalik (`replace(/^0/,'62')` sebelum `replace(/\D/g,'')`), sehingga
 * nomor yang diawali spasi seperti " 0812..." kehilangan prefiksnya dan jadi
 * "812..." — tautan mengarah ke nomor yang salah tanpa error.
 *
 * Mengembalikan null kalau nomor tidak masuk akal, supaya pemanggil bisa
 * menonaktifkan tombol alih-alih membuat tautan ke nomor asing.
 */
export function normalizeWaNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;

  let n = digits;
  if (n.startsWith('62')) {
    // sudah benar
  } else if (n.startsWith('0')) {
    n = '62' + n.slice(1);
  } else if (n.startsWith('8')) {
    // orang sering menulis "812..." tanpa 0 maupun 62
    n = '62' + n;
  } else {
    return null;
  }

  // 62 + 9..13 digit. Di luar itu hampir pasti salah ketik, bukan nomor Indonesia.
  if (n.length < 11 || n.length > 15) return null;
  return n;
}

/** Bangun URL wa.me. Mengembalikan null kalau nomornya tidak valid. */
export function buildWaLink(phone: string | null | undefined, text: string): string | null {
  const n = normalizeWaNumber(phone);
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

type MessageItem = {
  quantity: number;
  priceAtPurchase: unknown;
  product: { name: string };
};

type MessageOrder = {
  midtransOrderId: string;
  items: MessageItem[];
  totalAmount: unknown;
  shippingCost?: unknown;
};

const SEP = '\n------------------------\n';

function itemLines(items: MessageItem[]): string {
  return items
    .map((i) => `${i.quantity}x ${i.product.name}\n   ${formatRupiah(Number(i.priceAtPurchase) * i.quantity)}`)
    .join('\n');
}

/** Subtotal dihitung dari item, bukan dari totalAmount — totalAmount berubah
 *  makna antar status (subtotal saat MENUNGGU_ONGKIR, subtotal+ongkir setelahnya). */
export function subtotalOf(items: MessageItem[]): number {
  return items.reduce((n, i) => n + Number(i.priceAtPurchase) * i.quantity, 0);
}

/**
 * Pesan customer -> admin. Tanpa nama, nomor HP, atau alamat: teks ini masuk
 * ke atribut href di halaman publik, jadi apa pun di sini ikut terbaca orang
 * lain. Admin membuka detail lengkapnya di panel lewat kode pesanan.
 */
export function buildOrderMessage(order: MessageOrder): string {
  return (
    `Halo Admin *Randumart*, saya ingin mengkonfirmasi pesanan saya.\n\n` +
    `Kode Pesanan: *${order.midtransOrderId}*\n` +
    SEP +
    itemLines(order.items) +
    SEP +
    `Subtotal: *${formatRupiah(subtotalOf(order.items))}*\n` +
    `_(Belum termasuk ongkir)_\n\n` +
    `Mohon informasi ongkir untuk alamat saya. Terima kasih!`
  );
}

/**
 * Invoice admin -> customer, dikirim setelah ongkir diisi.
 *
 * Info rekening sengaja TIDAK ditanam di kode: menaruh nomor rekening di repo
 * adalah kebocoran data. Pesan menyisakan tempat agar admin menempelkannya
 * sendiri di WhatsApp sebelum menekan kirim.
 */
export function buildInvoiceMessage(order: MessageOrder, trackUrl?: string): string {
  const subtotal = subtotalOf(order.items);
  const ongkir = Number(order.shippingCost ?? 0);

  return (
    `Halo Kak, berikut rincian tagihan pesanan Anda di *Randumart*.\n\n` +
    `Kode Pesanan: *${order.midtransOrderId}*\n` +
    SEP +
    itemLines(order.items) +
    SEP +
    `Subtotal: ${formatRupiah(subtotal)}\n` +
    `Ongkir: ${formatRupiah(ongkir)}\n` +
    `*TOTAL: ${formatRupiah(subtotal + ongkir)}*\n\n` +
    `Silakan transfer ke rekening berikut:\n` +
    `[isi nomor rekening di sini]\n\n` +
    (trackUrl ? `Lacak pesanan:\n${trackUrl}\n\n` : '') +
    `Mohon kirim bukti transfer setelah pembayaran. Terima kasih!`
  );
}
