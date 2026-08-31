export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-brand-gold/20 text-brand-green border-brand-gold/40',
  MENUNGGU_ONGKIR: 'bg-amber-100 text-amber-700 border-transparent',
  MENUNGGU_BAYAR: 'bg-blue-100 text-blue-700 border-transparent',
  PAID: 'bg-brand-green text-brand-cream border-transparent',
  PROCESSING: 'bg-brand-cream text-brand-green border-brand-green/20',
  SHIPPED: 'bg-indigo-100 text-indigo-700 border-transparent',
  COMPLETED: 'bg-green-100 text-green-700 border-transparent',
  CANCELLED: 'bg-red-600 text-white border-transparent',
  EXPIRED: 'bg-gray-200 text-gray-700 border-transparent',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Checkout Lama (Pending)',
  MENUNGGU_ONGKIR: 'Menunggu Ongkir',
  MENUNGGU_BAYAR: 'Menunggu Bayar',
  PAID: 'Dibayar',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
  EXPIRED: 'Kedaluwarsa',
};
