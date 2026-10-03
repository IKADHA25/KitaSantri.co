"use client";

import ScrollReveal from "./ScrollReveal";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'Aktif')
          .order('id', { ascending: false })
          .limit(3);
          
        if (data) {
          setTestimonials(data);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading || testimonials.length === 0) return null;

  return (
    <section className="bg-emerald-900 mt-20 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-800/50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-green-800/40 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-16" direction="up">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kata Sambutan</h2>
          <p className="text-emerald-100 max-w-2xl mx-auto text-lg">Pesan hangat dari pengasuh pondok dan tokoh masyarakat.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 lg:gap-12">
          {testimonials.map((item, index) => {
            const delay = 0.1 * (index + 1);
            const direction = index === 0 ? "right" : index === 1 ? "up" : "left";
            return (
              <ScrollReveal key={item.id} direction={direction as any} delay={delay} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 relative">
                <div className="absolute -top-6 left-8 bg-emerald-500 rounded-full p-3 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                </div>
                <div className="mt-4 flex flex-col h-full">
                  <p className="text-emerald-50 text-base md:text-lg italic leading-relaxed mb-6 grow">
                    "{item.isi}"
                  </p>
                  <div className="flex items-center mt-auto">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-200 rounded-full flex items-center justify-center mr-4 border-2 border-emerald-400 shrink-0 text-emerald-600">
                      <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base md:text-lg">{item.nama}</h4>
                      <p className="text-emerald-300 text-xs md:text-sm">{item.peran}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  );
}
