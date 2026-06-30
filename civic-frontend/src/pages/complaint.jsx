/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import axios from "axios";
import { useEffect } from 'react';
import { UserContext } from '../context/user.context';
import { useContext } from 'react';
import { Socketcontext } from '../context/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, User, Phone, AlertTriangle, Loader2, CheckCircle, AlertCircle, X, Sparkles, Navigation, Upload, Edit3, Image } from 'lucide-react';

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
      stiffness: 100,
      damping: 12
    }
  }
};

const floatingVariants = {
  float: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function ComplaintForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [problemType, setProblemType] = useState('garbage');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [latLng, setLatLng] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiTitle, setAiTitle] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [aiSeverity, setAiSeverity] = useState('');
  const fileInputRef = useRef(null);
  
  const data = useContext(UserContext);
  const {sendmessage, getmessage} = useContext(Socketcontext);
    
  useEffect(() => {
    sendmessage("join", {
      userType: "user",
      userId: data.user?._id
    });
  }, []);
  
  async function analyzeUploadedImage(imageFile) {
    setAnalyzing(true);
    try {
      const form = new FormData();
      form.append('media', imageFile);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/complaint/analyze`,
        form,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        const analysis = res.data;
        setAiTitle(analysis.title || '');
        setAiDescription(analysis.description || '');
        setAiSeverity(analysis.severity_level || '');
        setProblemType(analysis.problem_type || problemType);
      }
    } catch (err) {
      console.error('Image analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  }

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    if (f) {
      setPreview(URL.createObjectURL(f));
      analyzeUploadedImage(f);
    } else {
      setPreview(null);
      setAiTitle('');
      setAiDescription('');
      setAiSeverity('');
    }
  }

  function handleRemoveImage() {
    setFile(null);
    setPreview(null);
    setAiTitle('');
    setAiDescription('');
    setAiSeverity('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

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
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/map/address?lat=${lat}&lng=${lng}`, {
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
    if (!name || !phone) {
      setMessage({ type: 'error', text: 'Please fill name and phone number.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const form = new FormData();
      form.append('name', name);
      form.append('phone', phone);
      form.append('problemType', problemType);
      if (aiTitle) form.append('title', aiTitle);
      if (aiDescription) form.append('description', aiDescription);
      
      if (latLng) {
        form.append('lat', latLng.lat);
        form.append('lon', latLng.lng);
        form.append('address', address || '');
      }
      
      if (file) form.append('media', file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/complaint/createcomplaint`, 
        form,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status !== 200) throw new Error("error");
      
      const data = await res.data;
      setMessage({ 
        type: 'success', 
        text: `Complaint submitted successfully! Your reference ID: ${data.complaint?._id || 'N/A'}` 
      });

      // Reset form
      setName('');
      setPhone('');
      setProblemType('garbage');
      setFile(null);
      setPreview(null);
      setAiTitle('');
      setAiDescription('');
      setAiSeverity('');
      setLatLng(null);
      setAddress('');
      
    } catch (err) {
      console.error('Submit error', err);
      setMessage({ 
        type: 'error', 
        text: 'Submission failed. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const problemTypes = [
    { value: 'garbage', label: 'Garbage Issue', icon: '🗑️' },
    { value: 'pothole', label: 'Pothole', icon: '🕳️' },
    { value: 'water', label: 'Water Problem', icon: '💧' },
    { value: 'electricity', label: 'Electricity Issue', icon: '⚡' },
    { value: 'road', label: 'Road Damage', icon: '🛣️' },
    { value: 'other', label: 'Other Issue', icon: '📌' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-8 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        variants={floatingVariants}
        animate="float"
        className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
      />
      <motion.div 
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 1 }}
        className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="max-w-2xl mx-auto relative z-10"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl mb-4 shadow-2xl"
          >
            <AlertTriangle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
            Report an Issue
          </h1>
          <p className="text-gray-300 text-lg">Help us make your community cleaner and safer</p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-yellow-300" />
                Civic Issue Report
              </h2>
              <p className="text-cyan-100">Fill in the details to report a community issue</p>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`mb-6 p-4 rounded-2xl flex items-center shadow-lg ${
                    message.type === 'error' 
                      ? 'bg-red-900/20 border border-red-500/30' 
                      : 'bg-green-900/20 border border-green-500/30'
                  }`}
                >
                  <div className={`p-3 rounded-full mr-4 ${
                    message.type === 'error' ? 'bg-red-500/20' : 'bg-green-500/20'
                  }`}>
                    {message.type === 'error' ? (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                  </div>
                  <span className={`flex-1 font-medium ${message.type === 'error' ? 'text-red-300' : 'text-green-300'}`}>{message.text}</span>
                  <button 
                    onClick={() => setMessage(null)}
                    className="ml-4 text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Basic Information Grid */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-cyan-300 flex items-center">
                    <User className="w-4 h-4 mr-2 text-cyan-400" />
                    Your Name *
                  </label>
                  <div className="relative">
                    <input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full px-4 py-3 pl-11 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 bg-white/5 text-white placeholder:text-gray-400" 
                      placeholder="Full name" 
                      required
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-cyan-300 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-cyan-400" />
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="w-full px-4 py-3 pl-11 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 bg-white/5 text-white placeholder:text-gray-400" 
                      placeholder="10-digit phone number" 
                      required
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  </div>
                </div>
              </motion.div>

              {/* Problem Type Selection */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-semibold text-cyan-300 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-cyan-400" />
                  Problem Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {problemTypes.map((pt) => (
                    <motion.button
                      key={pt.value}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setProblemType(pt.value)}
                      className={`p-3 rounded-xl border transition-all duration-200 text-sm font-medium flex flex-col items-center gap-1 ${
                        problemType === pt.value
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-gray-200'
                      }`}
                    >
                      <span className="text-xl">{pt.icon}</span>
                      <span>{pt.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Photo Upload Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <label className="block text-sm font-semibold text-cyan-300 flex items-center">
                  <Camera className="w-4 h-4 mr-2 text-cyan-400" />
                  Photo Evidence
                </label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Upload Button */}
                  <motion.label 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-cyan-400 transition-all duration-300 bg-white/5 hover:bg-cyan-500/10">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-300">Click to upload photo</p>
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG (Max 5MB)</p>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </motion.label>
                  
                  {/* Preview */}
                  {preview && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative"
                    >
                      <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-cyan-400/30 shadow-lg">
                        <img 
                          src={preview} 
                          alt="preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </div>

                {analyzing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20"
                  >
                    <div className="flex items-center text-blue-300">
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      <span className="font-medium">Analyzing image with AI...</span>
                    </div>
                  </motion.div>
                )}

                {aiTitle && !analyzing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/30"
                  >
                    <div className="flex items-center mb-3">
                      <Image className="w-5 h-5 mr-2 text-cyan-400" />
                      <span className="font-semibold text-cyan-300">AI Analysis Result</span>
                      <span className="ml-2 px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-300 rounded-full">Auto-detected</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1 flex items-center">
                          <Edit3 className="w-3 h-3 mr-1" /> Title
                        </label>
                        <input
                          value={aiTitle}
                          onChange={(e) => setAiTitle(e.target.value)}
                          className="w-full px-4 py-2.5 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300"
                          placeholder="Issue title"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1 flex items-center">
                          <Edit3 className="w-3 h-3 mr-1" /> Description
                        </label>
                        <textarea
                          value={aiDescription}
                          onChange={(e) => setAiDescription(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300 resize-none"
                          placeholder="Issue description"
                        />
                      </div>

                      {aiSeverity && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Severity:</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            aiSeverity === 'high' ? 'text-red-300 bg-red-500/20' :
                            aiSeverity === 'medium' ? 'text-yellow-300 bg-yellow-500/20' :
                            'text-green-300 bg-green-500/20'
                          }`}>
                            {aiSeverity}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Location Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <label className="block text-sm font-semibold text-cyan-300 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                  Location Detection
                </label>
                
                <div className="flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button" 
                    onClick={detectLocation} 
                    disabled={geolocating}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {geolocating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Detecting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-5 h-5 mr-2" />
                        Auto-Detect My Location
                      </>
                    )}
                  </motion.button>
                  
                  {latLng && (
                    <motion.button 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      type="button" 
                      onClick={() => { setLatLng(null); setAddress(''); }} 
                      className="px-6 py-4 border border-white/20 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 shadow-sm text-gray-300"
                    >
                      Clear
                    </motion.button>
                  )}
                </div>
                
                {latLng && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-sm"
                  >
                    <div className="text-sm text-cyan-300 space-y-2">
                      <div className="flex items-center font-semibold">
                        <MapPin className="w-4 h-4 mr-2" />
                        Location Detected Successfully!
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-cyan-400">Latitude</div>
                          <div className="font-mono text-gray-300">{latLng.lat.toFixed(6)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-cyan-400">Longitude</div>
                          <div className="font-mono text-gray-300">{latLng.lng.toFixed(6)}</div>
                        </div>
                      </div>
                      
                      {address && (
                        <div>
                          <div className="text-xs text-cyan-400 mt-2">📍 Full Address</div>
                          <div className="font-medium text-gray-300 leading-relaxed bg-white/5 rounded-xl p-3 border border-white/10 mt-1">
                            {address.split(',').map((part, i) => (
                              <span key={i}>
                                <span className="text-gray-100">{part.trim()}</span>
                                {i < address.split(',').length - 1 && <span className="text-gray-600 mx-1">•</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div 
                variants={itemVariants}
                className="pt-4"
              >
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(34, 211, 238, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl disabled:opacity-50 flex items-center justify-center text-lg shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"></div>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin relative z-10" />
                      <span className="relative z-10">Submitting Complaint...</span>
                    </>
                  ) : (
                    <span className="relative z-10 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Submit Complaint
                    </span>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          <p>We'll address your issue within 24 hours. Thank you for your contribution!</p>
        </motion.div>
      </motion.div>
    </div>
  );
}