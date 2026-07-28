'use client';

import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, BadgeCheck, FlaskConical, Users, Sparkles, Truck, Store } from 'lucide-react';
import { whyChoose } from '@/lib/products';

const icons = { Leaf, ShieldCheck, BadgeCheck, FlaskConical, Users, Sparkles, Truck, Store } as const;

export function WhyChoose() {
  return (
    <section id="about" className="py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
            Keunggulan Kami
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Mengapa Memilih Randumart Herbal?</h2>
          <p className="mt-2 text-muted-foreground">Komitmen kami untuk produk alami berkualitas tinggi.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {whyChoose.map((w, i) => {
            const Icon = icons[w.icon as keyof typeof icons];
            return (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                className="group rounded-3xl bg-white border border-border/60 p-5 sm:p-6 shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
              >
                <div className="grid place-items-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-base mb-1">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
