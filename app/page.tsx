import Image from "next/image";
// Merk: next/link er fjernet for å unngå feil i dette miljøet, og erstattet med standard <a> tagger

// Mock data for å vise hvordan menyen kan se ut (Basert på queries.sql)
const MOCK_MENU = [
  { name: "Kremet Fiskesuppe", price: 195, description: "Dagens fangst med sesongens grønnsaker og ferske urter" },
  { name: "Tangen Torv Burger", price: 289, description: "Hjemmelaget burger av høykvalitets kjøtt, med ost, bacon og trøffelmajones" },
  { name: "Pannacotta", price: 120, description: "Italiensk fløyelsdessert med sesongens bær og et hint av vanilje" },
];

// NY KOMPONENT: Enkel navigasjonsbar
const Header = () => (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
            {/* Logo / Navn */}
            <a href="/" className="text-2xl font-serif font-extrabold text-tangen-primary tracking-wider">
                Tangen Torv
            </a>
            
            {/* Navigasjonslenker */}
            <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-700 hover:text-tangen-accent transition duration-150 font-medium">Hjem</a>
                <a href="/menu" className="text-gray-700 hover:text-tangen-accent transition duration-150 font-medium">Meny</a>
                <a href="/booking" className="text-gray-700 hover:text-tangen-accent transition duration-150 font-medium">Bestill Bord</a>
                <a href="/admin" className="text-gray-700 hover:text-tangen-accent transition duration-150 font-medium">Admin</a>
            </nav>

            {/* CTA Knapp */}
            <a href="/booking" className="hidden md:block px-4 py-2 bg-tangen-accent text-tangen-primary font-bold rounded-full text-sm shadow-md hover:bg-yellow-300 transition duration-300">
                Reserver Nå
            </a>

            {/* Mobilmeny (forenklet for dette eksempelet) */}
            <button className="md:hidden text-tangen-primary text-2xl">
                ☰ 
            </button>
        </div>
    </header>
);


// OPPDATERT KOMPONENT: Mer dramatisk Hero Section
const HeroSection = () => (
  <div className="relative pt-16 h-[70vh] md:h-[90vh] bg-tangen-primary text-white flex items-center justify-center shadow-2xl shadow-tangen-primary/50">
    {/* Bakgrunnseffekt (Mock bilde/gradient) */}
    <div className="absolute inset-0 bg-cover bg-center opacity-20" 
         style={{ backgroundImage: "url('https://placehold.co/1200x800/4E342E/fff?text=Restaurant+Interiør')" }}>
    </div>
    
    <div className="relative z-10 text-center px-4 py-10 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10">
      <p className="text-xl uppercase tracking-widest text-tangen-accent mb-4 drop-shadow-md">
        Nyt Våre Smaker
      </p>
      <h1 className="text-6xl md:text-8xl font-serif font-extrabold leading-tight mb-6 drop-shadow-xl">
        Tangen Torv
      </h1>
      <p className="max-w-xl mx-auto text-xl font-light mb-10 opacity-90">
        Din destinasjon for moderne norsk matkunst, laget med lokale og sesongbaserte råvarer.
      </p>

      {/* CTA-knapper */}
      <div className="flex justify-center gap-6">
        <a href="/menu" className="px-10 py-4 bg-tangen-accent text-tangen-primary font-extrabold rounded-full text-lg shadow-xl hover:bg-yellow-300 transition duration-300 transform hover:scale-105">
          Se Meny
        </a>
        <a href="/booking" className="px-10 py-4 border-2 border-white text-white font-extrabold rounded-full text-lg shadow-xl hover:bg-white hover:text-tangen-primary transition duration-300 transform hover:scale-105">
          Bestill Bord
        </a>
      </div>
    </div>
  </div>
);


// OPPDATERT KOMPONENT: Menyutvalg med bedre layout
const MenuTeaser = () => (
    <section className="py-16 bg-white rounded-xl shadow-2xl border border-gray-100 mb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-serif font-bold text-tangen-primary mb-12 text-center border-b-2 border-tangen-accent/50 pb-2">
                Utvalgte Signaturretter
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                {MOCK_MENU.map((item, index) => (
                    <div key={index} className="flex flex-col space-y-2 group">
                        <div className="flex justify-between items-end">
                            <h3 className="text-2xl font-semibold text-tangen-primary group-hover:text-tangen-accent transition duration-200">{item.name}</h3>
                            <span className="flex-1 border-b border-dotted border-gray-400 mx-3 mb-1"></span>
                            <p className="text-2xl font-extrabold text-tangen-primary">{item.price},-</p>
                        </div>
                        <p className="text-gray-500 text-base italic">{item.description}</p>
                    </div>
                ))}
            </div>
            <div className="text-center mt-12">
                <a href="/menu" className="inline-block px-8 py-3 bg-tangen-primary text-white font-bold rounded-full text-lg shadow-xl hover:bg-tangen-primary/80 transition duration-300 transform hover:scale-105">
                    Utforsk Hele Menyen →
                </a>
            </div>
        </div>
    </section>
);


export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      
      <Header /> {/* Ny Navigasjonsbar */}
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* 2. Konsept og Historie - Forbedret layout */}
        <section className="grid md:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Mock bilde for å illustrere konseptet */}
          <div className="rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition duration-500">
             <img 
               src="https://placehold.co/600x400/4E342E/fff?text=Lidenskap+i+Kjøkkenet" 
               alt="Bilde av kokk eller matlaging" 
               className="w-full h-auto object-cover"
             />
          </div>

          <div className="p-4">
            <h2 className="text-5xl font-serif font-bold text-tangen-primary mb-6">
              Vår Historie og Filosofi
            </h2>
            <p className="text-gray-700 text-xl leading-relaxed">
              Tangen Torv handler om mer enn bare mat. Det handler om fellesskap, lokale råvarer, og lidenskapen for det gode måltid. Hver rett er laget med omhu, og vi streber etter å gi våre gjester en varm og minneverdig opplevelse.
            </p>
            <p className="text-gray-700 text-xl leading-relaxed mt-4 border-l-4 border-tangen-accent pl-4">
              "Vi endrer våre menyer ofte for å sikre at vi alltid serverer de ferskeste ingrediensene fra lokale leverandører – fra jord til bord."
            </p>
          </div>
        </section>
        
        {/* Menyutvalg */}
        <MenuTeaser />


        {/* 3. Åpningstider og Hurtiginfo - Forbedret med ikoner/emoji */}
        <section className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-tangen-accent/10">
          <h2 className="text-3xl font-serif font-bold text-tangen-primary mb-8 text-center">
            Informasjon & Reservering
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-4 border-r md:border-tangen-primary/20">
              <p className="text-4xl mb-2 text-tangen-accent">📍</p>
              <p className="text-xl font-semibold text-tangen-primary">Finn Oss</p>
              <p className="text-gray-600 mt-1">Torggata 1, 4800 Arendal</p>
            </div>
            
            <div className="p-4 border-r md:border-tangen-primary/20">
              <p className="text-4xl mb-2 text-tangen-accent">🕔</p>
              <p className="text-xl font-semibold text-tangen-primary">Åpningstider</p>
              <p className="text-gray-600 mt-1">Tirs - Lør: 11:00 - 22:00</p>
              <p className="text-gray-600">Søn: 12:00 - 18:00</p>
            </div>
            
            <div className="p-4">
              <p className="text-4xl mb-2 text-tangen-accent">📧</p>
              <p className="text-xl font-semibold text-tangen-primary">Kontakt</p>
              <p className="text-gray-600 mt-1">reservasjon@tangentorv.no</p>
              <p className="text-gray-600">+47 123 45 678</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-tangen-primary text-white mt-16 py-10 text-center">
        <p className="text-lg font-light">&copy; {new Date().getFullYear()} Tangen Torv. Lokal smaksopplevelse i hjertet av Arendal.</p>
        <p className="text-sm mt-1 opacity-70">Design og utvikling av [Ditt Navn]</p>
      </footer>
    </div>
  );
}