import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { getBlogPostBySlug } from '@/lib/products';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/#blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-brand-green mb-6">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Artikel
      </Link>

      <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-brand-blue text-sm font-semibold mb-4">
        {post.category}
      </span>

      <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">{post.title}</h1>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
        <span className="inline-flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
        <span>{new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
      </div>

      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-muted mt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <p className="text-lg text-muted-foreground leading-relaxed mt-8">{post.excerpt}</p>
    </article>
  );
}
