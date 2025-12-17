"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

// Definer typer for skjemadata
interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string;
}

const SimpleHeader = () => (
  <header className="absolute top-0 w-full z-10 py-6 px-6">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <a href="/" className="text-2xl font-serif font-black tracking-widest uppercase text-stone-900">
        Tangen<span className="text-amber-600">Torv</span>
      </a>
      <a href="/" className="text-stone-600 hover:text-amber-600 font-medium transition">
        ← Tilbake til forsiden
      </a>
    </div>
  </header>
);

export default function BookingPage() {
  const [loading, setLoading] = useState(false);
  
  // FIKS 1: Fortell TypeScript at dette kan være en streng eller null
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    message: "",
  });

  const timeSlots = [
    "16:00", "16:30", "17:00", "17:30", "18:00", 
    "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
  ];

  // TypeScript trenger å vite hva slags event "e" er
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionStatus(null);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            time: formData.time,
            guests: parseInt(formData.guests, 10),
            message: formData.message,
            status: 'pending',
          },
        ]);

      if (data) console.info('Supabase insert data:', data);
      if (error) {
        const serialized = (() => {
          try {
            return JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
          } catch (e) {
            return String(error);
          }
        })();
        console.error('Supabase insert error (serialized):', serialized);
        throw error;
      }

      setSubmissionStatus("success");
      setFormData({ name: "", email: "", phone: "", date: "", time: "", guests: "2", message: "" });
      
    } catch (error) {
      console.error("Feil ved booking:", error);
      setSubmissionStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-amber-200">
      <SimpleHeader />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
                Bestill Bord
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed">
                Vi gleder oss til å ta imot deg. For selskaper over 8 personer, vennligst ta kontakt med oss direkte på telefon eller e-post.
              </p>
            </div>

            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
               <img 
                 src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                 alt="Restaurantbord"
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-stone-900/20"></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <h3 className="font-serif font-bold text-xl mb-4 text-stone-900">Kontaktinfo</h3>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-center gap-3">
                  <span className="text-amber-500">📍</span> Torggata 1, 4800 Arendal
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-500">📞</span> +47 123 45 678
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-amber-500">✉️</span> booking@tangentorv.no
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-t-4 border-amber-500">
            {submissionStatus === "success" ? (
              <div className="text-center py-10 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Takk for din bestilling!</h3>
                <p className="text-stone-600">Vi har mottatt din forespørsel. Du vil motta en bekreftelse på e-post innen kort tid.</p>
                <button 
                  onClick={() => setSubmissionStatus(null)}
                  className="mt-6 text-amber-600 font-bold hover:underline"
                >
                  Bestill et bord til
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Fullt Navn</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-stone-50 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                    placeholder="Ola Nordmann"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">E-post</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-stone-50 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                      placeholder="ola@eksempel.no"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Telefon</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-stone-50 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                      placeholder="900 00 000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Dato</label>
                    <input
                      required
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-stone-50 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Tidspunkt</label>
                    <select
                      required
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-stone-50 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition appearance-none"
                    >
                      <option value="">Velg tid</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Gjester</label>
                    <select
                      required
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-stone-50 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={String(num)}>{num} personer</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Spesielle ønsker (valgfritt)</label>
                  {/* FIKS 2: rows={3} istedenfor rows="3" */}
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-stone-50 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                    placeholder="Allergier, bursdag, barnevogn..."
                  ></textarea>
                </div>

                {submissionStatus === "error" && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    Noe gikk galt. Vennligst sjekk internettforbindelsen eller prøv igjen senere.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] ${
                    loading 
                    ? "bg-stone-300 text-stone-500 cursor-not-allowed" 
                    : "bg-stone-900 text-white hover:bg-stone-800"
                  }`}
                >
                  {loading ? "Sender bestilling..." : "Bekreft Booking"}
                </button>

              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}