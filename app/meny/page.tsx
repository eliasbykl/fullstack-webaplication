'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

// --- NAVBAR KOMPONENT (Samme som på forsiden) ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8">
        <a href="/" className="text-2xl font-serif font-black tracking-widest uppercase text-stone-900">
          Tangen<span className="text-amber-500">Torv</span>
        </a>

        <nav className="hidden md:flex items-center space-x-8 text-stone-600">
          <a href="/" className="hover:text-amber-500 transition font-medium">Hjem</a>
          <a href="/menu" className="text-amber-600 font-bold transition font-medium">Meny</a>
          <a href="/bestil-bord" className="px-6 py-2.5 bg-stone-900 text-white rounded-full font-bold text-sm hover:bg-stone-800 transition hover:scale-105">
            Bestill Bord
          </a>
        </nav>

        <button className="md:hidden text-2xl text-stone-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-stone-100 md:hidden flex flex-col p-6 space-y-4">
          <a href="/" className="text-stone-800 text-lg font-medium border-b border-stone-100 pb-2">Hjem</a>
          <a href="/menu" className="text-amber-600 text-lg font-medium border-b border-stone-100 pb-2">Meny</a>
          <a href="/bestil-bord" className="text-stone-800 text-lg font-medium border-b border-stone-100 pb-2">Bestill Bord</a>
        </div>
      )}
    </header>
  );
};

// --- TYPE DEFINISJONER ---
interface MenuItem {
  id: string // UUID er string i Supabase
  name: string
  description: string | null
  price: number
  category?: string // Valgfritt felt hvis du bruker SQL-koden fra tidligere
  is_available: boolean
}

// --- STATISK DATA ---
const FEATURED_ITEMS = [
  {
    name: "Kremet Fiskesuppe",
    price: 195,
    description: "Dagens fangst med sesongens grønnsaker, ferske urter og godt brød.",
  },
  {
    name: "Tangen Torv Burger",
    price: 289,
    description: "Høykvalitets storfekjøtt, lagret cheddar, karamellisert løk og trøffelmajones.",
  },
  {
    name: "Pannacotta",
    price: 120,
    description: "Italiensk fløyelsdessert med coulis av skogsbær og et hint av ekte vanilje.",
  },
]

export default function MenyPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        setLoading(true)
        // MERK: Endret til 'menu_items' (flertall) som er standard. 
        // Endre tilbake til 'menu_item' hvis tabellen din heter det.
        const { data, error: supabaseError } = await supabase
          .from('menu_items') 
          .select('id, name, description, price, category, is_available')
          .eq('is_available', true)
          .order('category', { ascending: true }) // Sorterer gjerne på kategori først
          .order('name', { ascending: true })

        if (supabaseError) throw supabaseError

        setMenuItems(data || [])
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Kunne ikke laste hele menyen akkurat nå.')
        setMenuItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-amber-200">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Sidetittel */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6">
              Vår Meny
            </h1>
            <p className="text-xl text-stone-600 italic font-light">
              "Gode smaker skapes med gode råvarer og god tid."
            </p>
          </div>

          {/* --- DEL 1: STATISK DATA (Utvalgte Retter) --- */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px bg-amber-500 flex-1"></div>
              <h2 className="text-amber-600 font-bold tracking-widest uppercase text-sm">
                Våre Signaturretter
              </h2>
              <div className="h-px bg-amber-500 flex-1"></div>
            </div>

            <div className="space-y-8">
              {FEATURED_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-stone-100 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-xl font-bold text-amber-600 whitespace-nowrap ml-4">
                      {item.price},-
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-lg">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>


          {/* --- DEL 2: DATABASE DATA (Resten av menyen) --- */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px bg-stone-300 flex-1"></div>
              <h2 className="text-stone-500 font-bold tracking-widest uppercase text-sm">
                A La Carte
              </h2>
              <div className="h-px bg-stone-300 flex-1"></div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col justify-center items-center py-12 text-stone-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4"></div>
                <p>Henter retter fra kjøkkenet...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-8">
                <p className="font-bold">Beklager!</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Database Items */}
            {!loading && !error && (
              <div className="grid gap-6">
                {menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg p-6 shadow-sm border border-stone-200 hover:border-amber-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          {item.category && (
                            <span className="inline-block px-2 py-1 mb-2 text-xs font-bold tracking-wide uppercase text-stone-500 bg-stone-100 rounded">
                              {item.category}
                            </span>
                          )}
                          <h3 className="text-xl font-bold text-stone-900 mb-1">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-stone-600 text-base">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="text-lg font-bold text-stone-800 ml-4 whitespace-nowrap">
                          {item.price},-
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-stone-100 rounded-lg">
                    <p className="text-stone-500 italic">Vi oppdaterer menyen. Kom innom for dagens spesialiteter!</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Footer CTA */}
          <div className="mt-20 text-center space-y-4">
             <p className="text-stone-600">Finner du noe som frister?</p>
             <a
              href="/bestil-bord"
              className="inline-block px-10 py-4 bg-stone-900 text-white rounded-full font-bold shadow-lg hover:bg-amber-500 hover:text-stone-900 transition-all transform hover:scale-105"
            >
              Reserver Bord Nå
            </a>
          </div>

        </div>
      </main>
    </div>
  )
}