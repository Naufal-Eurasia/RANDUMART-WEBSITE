'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/lib/products';

export function BlogSection() {
  return (
    <section id="blog" className="py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold mb-3">
              Artikel & Tips
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Edukasi Kesehatan</h2>
            <p className="mt-2 text-muted-foreground">Tips kesehatan, kecantikan, dan herbal dari para ahli.</p>
          </motion.div>
          <Link href="#" className="hidden sm:block">
            <Button variant="outline" className="rounded-full">Semua Artikel <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group rounded-3xl overflow-hidden bg-white border border-border/60 shadow-soft hover:shadow-premium transition-all hover:-translate-y-1"
            >
              <Link href="#" className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-xs font-semibold">{post.category}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span>{new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h3 className="font-display font-semibold text-base leading-snug line-clamp-2 group-hover:text-brand-emerald transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">Baca selengkapnya <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
