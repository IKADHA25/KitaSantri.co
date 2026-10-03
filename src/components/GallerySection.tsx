"use client";

import ScrollReveal from "./ScrollReveal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await supabase
          .from('galeri')
          .select('url_foto')
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (data) {
          setGalleryImages(data.map(item => item.url_foto));
        }
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading || galleryImages.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-16">
      <ScrollReveal className="text-center mb-10" direction="up">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Galeri & Kenangan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Momen-momen kebersamaan yang tak terlupakan selama di pondok dan kegiatan alumni IKADHA 25.</p>
      </ScrollReveal>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {galleryImages.map((src, index) => (
          <ScrollReveal 
            key={index} 
            direction="up" 
            delay={0.1 * index}
            className={`relative overflow-hidden rounded-2xl group ${index === 4 ? 'col-span-2 md:col-span-1 row-span-2' : ''}`}
          >
            <div className={`w-full ${index === 4 ? 'h-105' : 'h-48 md:h-56'} relative`}>
              <Image 
                src={src}
                alt={`Dokumentasi ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
