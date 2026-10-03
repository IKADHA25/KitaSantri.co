"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import banner1 from "@/assets/banner1.jpg";
import banner2 from "@/assets/banner2.jpg";
import banner3 from "@/assets/banner3.jpg";

const images = [banner1, banner2, banner3];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 5000); // Ganti slide setiap 5 detik

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full h-75 md:h-125 lg:h-150 overflow-hidden group bg-gray-100">
      {/* Slider Items */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full h-full shrink-0 relative">
            <Image 
              src={src} 
              alt={`Slide ${index + 1}`} 
              className="w-full h-full object-cover"
              priority={index === 0}
            />
            
            {/* Overlay gelap agar teks lebih mudah dibaca */}
            <div className="absolute inset-0 bg-black/30"></div>
            
            {/* Caption di tengah slider */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-4 translate-y-4 opacity-0 animate-[fade-in-up_0.8s_ease-out_forwards]" style={{ animationDelay: '0.2s' }}>
                {index === 0 && "Selamat Datang di IKADHA 25"}
                {index === 1 && "Menjalin Silaturahmi Tanpa Batas"}
                {index === 2 && "Bersama Membangun Masa Depan"}
              </h2>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl drop-shadow-md translate-y-4 opacity-0 animate-[fade-in-up_0.8s_ease-out_forwards]" style={{ animationDelay: '0.4s' }}>
                Wadah silaturahmi, informasi, dan kolaborasi alumni Darul Huda Mayak.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol Previous */}
      <button 
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-white/40 hover:scale-110 transition-all duration-300 focus:outline-none"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Tombol Next */}
      <button 
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-white/40 hover:scale-110 transition-all duration-300 focus:outline-none"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indikator Titik (Dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Tailwind Keyframes Injector */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
}

