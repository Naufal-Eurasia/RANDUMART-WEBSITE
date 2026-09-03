import { NextResponse } from 'next/server';

const RAJAONGKIR_BASE_URL = 'https://api.rajaongkir.com/starter';

type WilayahType = 'province' | 'city' | 'subdistrict';

interface ProvinceResult {
  province_id: string;
  province: string;
}

interface CityResult {
  city_id: string;
  type: string;
  city_name: string;
}

interface SubdistrictResult {
  subdistrict_id: string;
  subdistrict_name: string;
}

export async function GET(req: Request) {
  try {
    const apiKey = process.env.RAJAONGKIR_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'RAJAONGKIR_API_KEY belum diset di server' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as WilayahType | null;
    const id = searchParams.get('id');

    if (!type || !['province', 'city', 'subdistrict'].includes(type)) {
      return NextResponse.json({ message: 'Parameter type wajib salah satu dari: province, city, subdistrict' }, { status: 400 });
    }

    // city butuh id provinsi (parent), subdistrict butuh id kota (parent)
    if ((type === 'city' || type === 'subdistrict') && !id) {
      return NextResponse.json({ message: `Parameter id (parent) wajib diisi untuk type=${type}` }, { status: 400 });
    }

    let url: string;
    if (type === 'province') {
      url = `${RAJAONGKIR_BASE_URL}/province`;
    } else if (type === 'city') {
      url = `${RAJAONGKIR_BASE_URL}/city?province=${encodeURIComponent(id!)}`;
    } else {
      url = `${RAJAONGKIR_BASE_URL}/subdistrict?city=${encodeURIComponent(id!)}`;
    }

    const res = await fetch(url, {
      headers: { key: apiKey },
      cache: 'no-store',
    });

    const json = await res.json();
    const status = json?.rajaongkir?.status;

    if (!res.ok || !status || status.code !== 200) {
      return NextResponse.json(
        { message: status?.description || 'Gagal mengambil data wilayah dari RajaOngkir' },
        { status: 502 }
      );
    }

    const results = json.rajaongkir.results as ProvinceResult[] | CityResult[] | SubdistrictResult[];

    // Normalisasi tiap tipe wilayah ke bentuk { id, name } yang seragam untuk frontend
    const data = results.map((item) => {
      if (type === 'province') {
        const r = item as ProvinceResult;
        return { id: r.province_id, name: r.province };
      }
      if (type === 'city') {
        const r = item as CityResult;
        return { id: r.city_id, name: `${r.type} ${r.city_name}`.trim() };
      }
      const r = item as SubdistrictResult;
      return { id: r.subdistrict_id, name: r.subdistrict_name };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Wilayah (RajaOngkir) Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan saat mengambil data wilayah' }, { status: 500 });
  }
}
