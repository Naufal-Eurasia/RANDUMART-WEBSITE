'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '@/lib/products';

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const display = n >= 1000 ? `${Math.floor(n / 1000)}K` : n.toLocaleString('id-ID');
  return <span ref={ref}>{display}{suffix}</span>;
}

export function StatsCounter() {
  return (
    <section className="py-16 lg:py-20 bg-brand-emerald text-white relative overflow-hidden">
      <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-brand-gold/10 blur-3xl" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="text-center"
          >
            <p className="font-display text-4xl sm:text-5xl font-bold text-brand-gold">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-white/80 text-sm sm:text-base">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
