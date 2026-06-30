/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from "axios";
import { Usesocket } from '../context/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, MapPin, Building, Lock, Loader2, CheckCircle, AlertCircle, X, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function OfficerForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [latLng, setLatLng] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [geolocating, setGeolocating] = useState(false);

  async function detectLocation() {
    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'Geolocation is not supported in this browser.' });
      return;
    }
    
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatLng({ lat, lng });

        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/map/address?lat=${lat}&lng=${lng}`,{
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
          });
          
          if (res.status === 200) {
            const data = await res.data;
            setAddress(data.address || data.formatted_address || '');
          } else {
            setAddress('');
          }
        } catch (err) {
          console.error('Reverse geocode error', err);
          setAddress('');
        }

        setGeolocating(false);
      },
      (err) => {
        console.error('Geo error', err);
        setMessage({ type: 'error', text: 'Could not get location. Please allow location access or enter manually.' });
        setGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !phone || !department || !email || !password || !city) {
      setMessage({ type: 'error', text: 'Please fill all required fields.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const form = new FormData();
      form.append('name', name);
      form.append('phone', phone);
      form.append('department', department);
      form.append('email', email);
      form.append('city', city);
      form.append('password', password);
      
      if (latLng) {
        form.append('lat', latLng.lat);
        form.append('lon', latLng.lng);
        form.append('address', address || '');
      }

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/officer/create`, 
        form, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status !== 201) throw new Error("error");
      
      const data = await res.data;
      setMessage({ 
        type: 'success', 
        text: `Officer created successfully! ID: ${data.officer?.id || data.id || 'N/A'}` 
      });

      // Reset form
      setName('');
      setPhone('');
      setDepartment('');
      setEmail('');
      setCity('');
      setPassword('');
      setLatLng(null);
      setAddress('');
      
    } catch (err) {
      console.error('Submit error', err);
      setMessage({ 
        type: 'error', 
        text: 'Submission failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  }

  // Reuse a Field helper to match the auth pages' design
  const Field = ({ label, icon: Icon, children, error }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        )}
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"
          animate={{ y: [0, 12, 0], x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
        <motion.div
          className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl"
          animate={{ y: [0, -10, 0], x: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
      </motion.div>

      <div className="relative w-full max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr] items-start">
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-3xl"
          >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center text-white shadow-lg shadow-fuchsia-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                  Create Officer Account
                </h1>
                <p className="text-sm text-slate-300">Add an officer to the civic system.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Field label="Full name" icon={User}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 h-12 rounded-3xl border border-white/10 bg-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  placeholder="Officer's full name"
                />
              </Field>

              <Field label="Email" icon={Mail}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 h-12 rounded-3xl border border-white/10 bg-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Phone" icon={Phone}>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 h-12 rounded-3xl border border-white/10 bg-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  placeholder="+919876543210"
                />
              </Field>

              <Field label="Department" icon={Building}>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-3 h-12 rounded-3xl border border-white/10 bg-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  placeholder="Department"
                />
              </Field>

              <Field label="City" icon={MapPin}>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-3 h-12 rounded-3xl border border-white/10 bg-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  placeholder="City of operation"
                />
              </Field>

              <Field label="Password" icon={Lock}>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 h-12 rounded-3xl border border-white/10 bg-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={geolocating}
                  className="flex-1 h-12 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold"
                >
                  {geolocating ? (
                    <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Detecting...</span>
                  ) : (
                    'Detect Location'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setLatLng(null); setAddress(''); }}
                  className="h-12 px-4 rounded-3xl border border-white/10 text-white"
                >
                  Clear
                </button>
              </div>

              {latLng && (
                <div className="rounded-3xl bg-amber-400/10 border border-amber-400/20 p-4 text-sm text-amber-100">
                  <div>Lat: {latLng.lat.toFixed(6)}</div>
                  <div>Lng: {latLng.lng.toFixed(6)}</div>
                  {address && <div className="mt-2">{address}</div>}
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -1 }}
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-fuchsia-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Creating officer...</span>
                ) : (
                  'Create Officer'
                )}
              </motion.button>

              {message && (
                <div className={`rounded-3xl px-4 py-3 text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-200 border border-red-400/20' : 'bg-emerald-500/10 text-emerald-200 border border-emerald-400/20'}`}>
                  <span className="font-medium">{message.type === 'error' ? 'Error' : 'Success'}:</span> {message.text}
                </div>
              )}

              <p className="text-xs text-slate-300 text-center">
                Already have an account? <Link to="/officerlogin" className="underline underline-offset-4 text-white">Sign in</Link>
              </p>
            </form>
          </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-[0_40px_100px_rgba(0,0,0,0.18)] backdrop-blur-3xl"
          >
            <div className="text-sm uppercase tracking-[0.24em] text-cyan-300 mb-4">
              Demo Credentials
            </div>
            <div className="space-y-4 text-sm text-slate-200">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-slate-400">email</div>
                <div className="mt-2 font-semibold">nikhill123@gmail.com</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-slate-400">password</div>
                <div className="mt-2 font-semibold">Nikhil@123</div>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              This is a prototype — use the credentials above to test functionality.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}