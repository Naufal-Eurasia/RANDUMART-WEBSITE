import { NextResponse } from 'next/server';

const RAJAONGKIR_BASE_URL = 'https://api.rajaongkir.com/starter';

interface CostDetail {
  value: number;
  etd: string;
  note: string;
}

interface CostService {
  service: string;
  description: string;
  cost: CostDetail[];
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RAJAONGKIR_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'RAJAONGKIR_API_KEY belum diset di server' }, { status: 500 });
    }

    const { origin, destination, weight, courier } = await req.json();

    if (!origin || !destination || !weight || !courier) {
      return NextResponse.json({ message: 'origin, destination, weight, dan courier wajib diisi' }, { status: 400 });
    }

    const form = new URLSearchParams({
      origin: String(origin),
      destination: String(destination),
      weight: String(weight),
      courier: String(courier),
    });

    const res = await fetch(`${RAJAONGKIR_BASE_URL}/cost`, {
      method: 'POST',
      headers: {
        key: apiKey,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: form,
      cache: 'no-store',
    });

    const json = await res.json();
    const status = json?.rajaongkir?.status;

    if (!res.ok || !status || status.code !== 200) {
      return NextResponse.json({ message: status?.description || 'Gagal menghitung ongkir' }, { status: 502 });
    }

    const results = json.rajaongkir.results as { costs: CostService[] }[];
    const costs = (results?.[0]?.costs || []).map((c) => ({
      service: c.service,
      description: c.description,
      cost: c.cost[0]?.value ?? 0,
      etd: c.cost[0]?.etd ?? '-',
    }));

    return NextResponse.json({ costs });
  } catch (error) {
    console.error('API Ongkir (RajaOngkir) Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan saat menghitung ongkir' }, { status: 500 });
  }
}
