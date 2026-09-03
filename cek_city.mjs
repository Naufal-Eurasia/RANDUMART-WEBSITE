const API_KEY = 'ISI_RAJAONGKIR_API_KEY_KAMU_DISINI'; // Ambil dari .env
const provinceId = '11'; // Jawa Timur

const res = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/city/11`, {
  headers: { 'x-api-key': API_KEY } // Ganti 'key' jadi 'x-api-key'
});
const data = await res.json();
console.log(data);