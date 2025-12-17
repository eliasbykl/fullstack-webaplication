"use client";

import React, { useState, useEffect } from "react";

// --- KOMPONENTER ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg py-2" : "bg-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className={`text-2xl font-serif font-black tracking-widest uppercase ${scrolled ? 'text-stone-900' : 'text-white'}`}>
          Tangen<span className="text-amber-500">Torv</span>
        </a>

        {/* Desktop Nav */}
        <nav className={`hidden md:flex items-center space-x-8 ${scrolled ? 'text-stone-600' : 'text-white/90'}`}>
          <a href="/" className="hover:text-amber-500 transition font-medium">Hjem</a>
          <a href="/meny" className="hover:text-amber-500 transition font-medium">Meny</a>
          <a href="/about" className="hover:text-amber-500 transition font-medium">Om Oss</a>

          {/* ENDRET HER: Linker nå til /bestil-bord */}
          <a
            href="/bestil-bord"
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105 ${scrolled
                ? "bg-stone-900 text-white hover:bg-stone-800"
                : "bg-white text-stone-900 hover:bg-amber-400"
              }`}
          >
            Bestill Bord
          </a>
        </nav>

        {/* Mobilmeny-knapp */}
        <button
          className={`md:hidden text-2xl ${scrolled ? 'text-stone-900' : 'text-white'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobilmeny Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-stone-100 md:hidden flex flex-col p-6 space-y-4">
          <a href="/" className="text-stone-800 text-lg font-medium border-b border-stone-100 pb-2">Hjem</a>
          <a href="/meny" className="text-stone-800 text-lg font-medium border-b border-stone-100 pb-2">Meny</a>
          {/* ENDRET HER: Linker nå til /bestil-bord */}
          <a href="/bestil-bord" className="text-stone-800 text-lg font-medium border-b border-stone-100 pb-2">Bestill Bord</a>
          <a href="/admin" className="text-stone-500 text-sm">Admin Innlogging</a>
        </div>
      )}
    </header>
  );
};

const HeroSection = () => (
  <div className="relative h-screen min-h-[600px] flex items-center justify-center bg-stone-900 text-white overflow-hidden">
    {/* Bakgrunnsbilde med overlay */}
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        alt="Stemningsbilde restaurant"
        className="w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent"></div>
    </div>

    {/* Innhold */}
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
      <p className="text-amber-400 font-bold tracking-[0.2em] uppercase mb-4 animate-fade-in-up">
        Etablert 2024
      </p>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
        Smaken av <br />
        <span className="italic font-light text-amber-500">Øyeblikket</span>
      </h1>
      <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
        En kulinarisk møteplass i hjertet av kristiansand. Vi kombinerer lokale råvarer med moderne kokkekunst for å skape uforglemmelige minner.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {/* ENDRET HER: Linker nå til /bestil-bord */}
        <a
          href="/bestil-bord"
          className="px-8 py-4 bg-amber-500 text-stone-900 font-bold text-lg rounded-full shadow-lg hover:bg-amber-400 transition-all hover:scale-105"
        >
          Reserver Bord
        </a>
        <a
          href="/meny"
          className="px-8 py-4 bg-transparent border border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-stone-900 transition-all"
        >
          Se Menyen
        </a>
      </div>
    </div>
  </div>
);



const StorySection = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-100 rounded-full z-0"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-stone-100 rounded-full z-0"></div>
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Kokk som legger opp mat"
            className="relative z-10 rounded-2xl shadow-2xl w-full object-cover h-[500px] transform hover:scale-[1.01] transition duration-500"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
            Lidenskap i <br /> hvert måltid
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed">
            Hos Tangen Torv handler det om mer enn bare å spise seg mett. Det handler om fellesskap, atmosfære og kjærligheten til gode råvarer.
          </p>
          <p className="text-lg text-stone-600 leading-relaxed">
            Vårt kjøkken er inspirert av både norsk tradisjonsmat og kontinentale smaker, alltid tilberedt med sesongens beste ingredienser fra lokale bønder og fiskere.
          </p>

          <div className="pt-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-2xl">🥬</div>
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-2xl">🐟</div>
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-2xl">🍷</div>
            </div>
            <p className="text-sm text-stone-400 mt-2 font-medium">Lokalt & Bærekraftig</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const InfoSection = () => (
  <section className="bg-stone-900 text-stone-300 py-20">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

      <div className="space-y-4">
        <h3 className="text-white text-xl font-serif font-bold mb-2">Finn Oss</h3>
        <p>kristiansand</p>
        <p>Vi ligger midt i hjertet av byen, <br />med utsikt over torvet.</p>
        <a href="https://maps.google.com" target="_blank" className="text-amber-500 hover:text-amber-400 underline inline-block mt-2">Vis i kart</a>
      </div>

      <div className="space-y-4 border-t md:border-t-0 md:border-l border-stone-800 pt-8 md:pt-0 md:pl-12">
        <h3 className="text-white text-xl font-serif font-bold mb-2">Åpningstider</h3>
        <div className="flex justify-between md:justify-start gap-8">
          <div className="text-left">
            <span className="block text-sm text-stone-500 uppercase">Tirs - Tor</span>
            <span className="block font-medium">16:00 - 22:00</span>
          </div>
          <div className="text-left">
            <span className="block text-sm text-stone-500 uppercase">Fre - Lør</span>
            <span className="block font-medium">15:00 - 23:00</span>
          </div>
        </div>
        <div className="text-left">
          <span className="block text-sm text-stone-500 uppercase">Søndag</span>
          <span className="block font-medium">13:00 - 20:00</span>
        </div>
      </div>

      <div className="space-y-4 border-t md:border-t-0 md:border-l border-stone-800 pt-8 md:pt-0 md:pl-12">
        <h3 className="text-white text-xl font-serif font-bold mb-2">Kontakt</h3>
        <p className="text-2xl font-light text-white">+47 123 45 678</p>
        <p>reservasjon@tangentorv.no</p>
        <div className="pt-4 flex gap-4 justify-center md:justify-start">
          <div className="w-8 h-8 bg-stone-700 rounded-full hover:bg-amber-500 transition cursor-pointer"></div>
          <div className="w-8 h-8 bg-stone-700 rounded-full hover:bg-amber-500 transition cursor-pointer"></div>
        </div>
      </div>

    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-stone-950 text-stone-600 py-8 text-center text-sm">
    <p>&copy; {new Date().getFullYear()} Tangen Torv AS. Alle rettigheter reservert.</p>
  </footer>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-stone-800 selection:bg-amber-200 selection:text-stone-900">
      <Navbar />
      <HeroSection />
      <StorySection />
      <InfoSection />
      <Footer />
    </div>
  );
}