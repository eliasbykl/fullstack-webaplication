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

interface Booking {
  id: number
  customer_name: string
  email: string
  phone: string | null
  guests: number
  booking_datetime: string
  notes: string | null
  status: string
  created_at: string
}

export default function AdminPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<'menu' | 'bookings'>('menu')
  
  // Menu states
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuLoading, setMenuLoading] = useState(false)
  const [showMenuForm, setShowMenuForm] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null)
  
  // Bookings states
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  })

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Check if user is admin in employee table
        const { data: employee, error } = await supabase
          .from('employee')
          .select('role')
          .eq('email', session.user.email)
          .single()

        if (error) {
          console.error('Feil ved sjekk av admin-status:', error)
          setIsAdmin(false)
        } else if (employee && employee.role === 'admin') {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      }
      
      setSession(session)
      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        checkAuth()
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  // Fetch menu items
  useEffect(() => {
    if (session && activeTab === 'menu') {
      fetchMenuItems()
    }
  }, [session, activeTab])

  // Fetch bookings
  useEffect(() => {
    if (session && activeTab === 'bookings') {
      fetchBookings()
    }
  }, [session, activeTab])

  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true)
      const { data, error } = await supabase
        .from('menu_item')
        .select('*')
        .order('name')

      if (error) throw error
      setMenuItems(data || [])
    } catch (error) {
      console.error('Feil ved lasting av menyartikler:', error)
      alert('Klarte ikke å laste menyartikler')
    } finally {
      setMenuLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true)
      const { data, error } = await supabase
        .from('booking')
        .select('*')
        .order('booking_datetime', { ascending: true })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Feil ved lasting av bookinger:', error)
      alert('Klarte ikke å laste bookinger')
    } finally {
      setBookingsLoading(false)
    }
  }

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.price.trim()) {
      alert('Navn og pris er obligatorisk')
      return
    }

    try {
      if (editingMenu) {
        // Update
        const { error } = await supabase
          .from('menu_item')
          .update({
            name: formData.name,
            description: formData.description || null,
            price: parseFloat(formData.price),
          })
          .eq('id', editingMenu.id)

        if (error) throw error
        alert('Menyartikkel oppdatert!')
      } else {
        // Insert
        const { error } = await supabase
          .from('menu_item')
          .insert([
            {
              name: formData.name,
              description: formData.description || null,
              price: parseFloat(formData.price),
              is_available: true,
            },
          ])

        if (error) throw error
        alert('Menyartikkel opprettet!')
      }

      setFormData({ name: '', description: '', price: '' })
      setEditingMenu(null)
      setShowMenuForm(false)
      fetchMenuItems()
    } catch (error) {
      console.error('Feil ved lagring:', error)
      alert('Klarte ikke å lagre menyartikkel')
    }
  }

  const handleDeleteMenu = async (id: number) => {
    if (!confirm('Er du sikker på at du vil slette denne menyartikkelen?')) return

    try {
      const { error } = await supabase
        .from('menu_item')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('Menyartikkel slettet!')
      fetchMenuItems()
    } catch (error) {
      console.error('Feil ved sletting:', error)
      alert('Klarte ikke å slette menyartikkel')
    }
  }

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_item')
        .update({ is_available: !item.is_available })
        .eq('id', item.id)

      if (error) throw error
      fetchMenuItems()
    } catch (error) {
      console.error('Feil ved oppdatering:', error)
      alert('Klarte ikke å oppdatere tilgjengelighet')
    }
  }

  const handleBookingStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('booking')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error
      fetchBookings()
    } catch (error) {
      console.error('Feil ved oppdatering:', error)
      alert('Klarte ikke å oppdatere bookingstatus')
    }
  }

  const handleDeleteBooking = async (id: number) => {
    if (!confirm('Er du sikker på at du vil slette denne bookingen?')) return

    try {
      const { error } = await supabase
        .from('booking')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('Booking slettet!')
      fetchBookings()
    } catch (error) {
      console.error('Feil ved sletting:', error)
      alert('Klarte ikke å slette booking')
    }
  }

  const startEdit = (item: MenuItem) => {
    setEditingMenu(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
    })
    setShowMenuForm(true)
  }

  const cancelEdit = () => {
    setEditingMenu(null)
    setFormData({ name: '', description: '', price: '' })
    setShowMenuForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Admin Login</h1>
          <p className="text-slate-300 mb-8">Du må logge inn med Supabase-kontoen din</p>
          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
            className="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
          >
            Logg inn med GitHub
          </button>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 to-red-800">
        <div className="text-center text-white max-w-md">
          <h1 className="text-4xl font-bold mb-4">Ingen Tilgang</h1>
          <p className="text-red-100 mb-2">E-posten: <span className="font-semibold">{session.user.email}</span></p>
          <p className="text-red-100 mb-8">Du er ikke registrert som admin i systemet. Kontakt systemadministrator.</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-white text-red-900 px-8 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors"
          >
            Logg ut
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Tangen Torv Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{session.user.email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              Logg ut
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-4 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'menu'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Menyartikler
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-4 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'bookings'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Bookinger
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-slate-900">Administrer Meny</h2>
              <button
                onClick={() => {
                  cancelEdit()
                  setShowMenuForm(!showMenuForm)
                }}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold"
              >
                {showMenuForm ? 'Avbryt' : 'Ny Artikkell'}
              </button>
            </div>

            {/* Menu Form */}
            {showMenuForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-slate-900">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {editingMenu ? 'Rediger Artikkell' : 'Ny Menyartikkell'}
                </h3>
                <form onSubmit={handleMenuSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Navn *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="f.eks. Kremet Fiskesuppe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Beskrivelse
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                      rows={3}
                      placeholder="Beskrivelse av retten..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Pris (kr) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="f.eks. 195"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      {editingMenu ? 'Oppdater' : 'Opprett'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 transition-colors font-semibold"
                    >
                      Avbryt
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Menu Items List */}
            {menuLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
              </div>
            ) : menuItems.length > 0 ? (
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow flex justify-between items-start border-l-4 border-slate-900"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            item.is_available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.is_available ? 'Tilgjengelig' : 'Ikke tilgjengelig'}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-slate-600 mb-3">{item.description}</p>
                      )}
                      <p className="text-lg font-semibold text-slate-900">{item.price.toFixed(2)} kr</p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                          item.is_available
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {item.is_available ? 'Skjul' : 'Vis'}
                      </button>
                      <button
                        onClick={() => startEdit(item)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                      >
                        Rediger
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(item.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                      >
                        Slett
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">Ingen menyartikler</p>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Administrer Bookinger</h2>

            {bookingsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-slate-900"
                  >
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <p className="text-sm text-slate-600 font-semibold">Kunde</p>
                        <p className="text-lg font-bold text-slate-900">{booking.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-semibold">Gjester</p>
                        <p className="text-lg font-bold text-slate-900">{booking.guests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-semibold">Email</p>
                        <p className="text-sm text-slate-900">{booking.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-semibold">Telefon</p>
                        <p className="text-sm text-slate-900">{booking.phone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-semibold">Dato og tid</p>
                        <p className="text-sm text-slate-900">
                          {new Date(booking.booking_datetime).toLocaleDateString('nb-NO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-semibold">Status</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mb-4 p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="text-sm text-slate-600 font-semibold">Notat</p>
                        <p className="text-sm text-slate-900">{booking.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {booking.status !== 'confirmed' && (
                        <button
                          onClick={() => handleBookingStatusChange(booking.id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                        >
                          Bekreft
                        </button>
                      )}
                      {booking.status !== 'pending' && (
                        <button
                          onClick={() => handleBookingStatusChange(booking.id, 'pending')}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm"
                        >
                          Til Vurdering
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleBookingStatusChange(booking.id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                        >
                          Avslå
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors font-semibold text-sm ml-auto"
                      >
                        Slett
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">Ingen bookinger</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}