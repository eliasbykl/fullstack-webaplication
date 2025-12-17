'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface MenuItem {
  id: number
  name: string
  description: string | null
  price: number
  is_available: boolean
}

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
        const { data, error: supabaseError } = await supabase
          .from('menu_item')
          .select('id, name, description, price, is_available')
          .eq('is_available', true)
          .order('name')

        if (supabaseError) {
          throw supabaseError
        }

        setMenuItems(data || [])
        setError(null)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Klarte ikke å hente menyartikler'
        )
        setMenuItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Vår Meny</h1>
          <p className="text-lg text-slate-600">
            Smaksopplevelser laget med kjærlighet
          </p>
        </div>

        {/* Utvalgte Retter - Highlight Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-2">Utvalgte Retter</h2>
            <h3 className="text-3xl font-bold text-slate-900">Våre Favoritter</h3>
            <div className="w-24 h-1 bg-amber-500 mx-auto mt-4"></div>
          </div>

          <div className="space-y-4">
            {FEATURED_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 border-l-4 border-amber-500"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {item.name}
                  </h2>
                  <span className="text-2xl font-bold text-amber-600">
                    {item.price} kr
                  </span>
                </div>
                <p className="text-slate-600 text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-px bg-slate-300"></div>
          <span className="text-slate-500 font-semibold">Menyartikler fra database</span>
          <div className="flex-1 h-px bg-slate-300"></div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            <p className="font-semibold">Feil ved lasting av meny</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Menu Items from Database */}
        {!loading && !error && menuItems.length > 0 && (
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 border-l-4 border-slate-900"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {item.name}
                  </h2>
                  <span className="text-2xl font-bold text-slate-700">
                    {item.price.toFixed(2)} kr
                  </span>
                </div>
                {item.description && (
                  <p className="text-slate-600 text-base leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && menuItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">Ingen ytterligere menyartikler tilgjengelig</p>
          </div>
        )}

        {/* Navigation Button */}
        <div className="mt-12 flex justify-center gap-4">
          <a
            href="/"
            className="px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Hjem
          </a>
          <a
            href="/bestil-bord"
            className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
          >
            Bestill bord
          </a>
        </div>
      </div>
    </main>
  )
}
