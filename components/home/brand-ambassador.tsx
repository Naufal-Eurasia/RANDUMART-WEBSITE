"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, Heart, Star } from 'lucide-react';

export function BrandAmbassador() {
  return (
    <section id="ambassador" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/3784371/pexels-photo-3784371.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-emerald-900/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative mx-auto w-full max-w-[1080px] md:max-w-[1250px]">
              <div className="rounded-[28px] bg-white p-3 sm:p-4 md:p-6 shadow-[0_20px_60px_-20px_rgba(2,6,23,0.35)] overflow-hidden">
                <div className="relative w-full bg-white rounded-[20px] overflow-hidden">
                  <Image
                    src="/images/brand-ambassador/nagita-slavina.png"
                    alt="Brand Ambassador"
                    width={1300}
                    height={910}
                    priority
                    quality={95}
                    className="w-full h-auto object-cover rounded-[16px] scale-[1.04] md:scale-[1.08]"
                  />
                </div>

              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white order-1 lg:order-2"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-sm font-medium mb-5">
              <Star className="w-4 h-4 text-brand-gold" /> Brand Ambassador
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Nagita Slavina
            </h2>

            <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
              {[
                { icon: Award, value: '15+', label: 'Tahun Pengalaman' },
                { icon: Heart, value: '10K+', label: 'Pasien Puas' },
                { icon: Star, value: '25+', label: 'Penghargaan' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <s.icon className="w-6 h-6 mx-auto text-brand-gold mb-1" />
                  <p className="font-display font-bold text-xl">{s.value}</p>
                  <p className="text-xs text-white/70">{s.label}</p>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
