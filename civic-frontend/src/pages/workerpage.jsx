import React, { useEffect, useRef, useState } from 'react';

const OSM_TILE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTR = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>';

export default function WorkerTaskPage() {
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mapRef = useRef(null);

  function getQuery() {
    const qp = new URLSearchParams(window.location.search);
    return {
      taskId: qp.get('taskId'),
      token: qp.get('token')
    };
  }

  useEffect(() => {
    const { taskId, token } = getQuery();
    if (!taskId || !token) {
      setError('Missing taskId or token in URL');
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/task/${taskId}?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        setTask(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load task: ' + (err.message || err));
        setLoading(false);
      });
  }, []);

  // Init map once task is loaded
  useEffect(() => {
    if (!task || !task.location) return;
    const { lat, lon } = task.location;

    let leafletLoaded = false;

    function initLeafletMap() {
      if (leafletLoaded) return;
      leafletLoaded = true;
      const L = window.L;
      if (!L) return;
      const map = L.map('map-canvas', { zoomControl: true }).setView([lat, lon], 15);
      L.tileLayer(OSM_TILE, { attribution: OSM_ATTR, maxZoom: 19 }).addTo(map);
      L.marker([lat, lon]).addTo(map).bindPopup(task.address || 'Task location').openPopup();
      mapRef.current = map;
    }

    // Try Mappls first
    const key = import.meta.env.VITE_MAPPLS_KEY;
    if (key && !window.MapmyIndia) {
      const s = document.createElement('script');
      s.src = `https://apis.mapmyindia.com/advancedmaps/v1/${key}/map_load?v=1.5`;
      s.onload = () => {
        try {
          if (!window.MapmyIndia) { initLeafletMap(); return; }
          const map = new window.MapmyIndia.Map('map-canvas', {
            center: [lat, lon],
            zoomControl: true,
            marquee: false,
            zoom: 15
          });
          const marker = new window.L.marker([lat, lon]).addTo(map);
          marker.bindPopup(task.address || 'Task location').openPopup();
          mapRef.current = map;
        } catch (e) {
          console.warn('Mappls map init failed, using Leaflet fallback', e);
          initLeafletMap();
        }
      };
      s.onerror = () => {
        console.warn('Mappls script load failed, using Leaflet fallback');
        initLeafletMap();
      };
      document.head.appendChild(s);
    } else if (window.MapmyIndia) {
      try {
        const map = new window.MapmyIndia.Map('map-canvas', {
          center: [lat, lon],
          zoomControl: true,
          marquee: false,
          zoom: 15
        });
        const marker = new window.L.marker([lat, lon]).addTo(map);
        marker.bindPopup(task.address || 'Task location').openPopup();
        mapRef.current = map;
      } catch (e) {
        console.warn('Mappls init failed, using Leaflet fallback', e);
        initLeafletMap();
      }
    } else {
      // Load Leaflet dynamically
      if (!window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initLeafletMap;
        script.onerror = () => console.error('Leaflet failed to load');
        document.head.appendChild(script);
      } else {
        initLeafletMap();
      }
    }
  }, [task]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (e) {
      console.error('Camera error', e);
      setError('Camera access denied or not available');
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => {
      setPreviewSrc({ blob, url: URL.createObjectURL(blob) });
    }, 'image/jpeg', 0.9);
  }

  function stopCamera() {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
  }

  async function uploadProof() {
    if (!previewSrc || !previewSrc.blob) {
      setError('No photo to upload');
      return;
    }
    const { taskId, token } = getQuery();
    const fd = new FormData();
    fd.append('proof', previewSrc.blob, `proof-${taskId}.jpg`);

    setUploading(true);
    setUploadResult(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/task/${taskId}/upload?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        body: fd
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || JSON.stringify(json));
      setUploadResult({ ok: true, msg: json.message || 'Uploaded successfully!' });
      stopCamera();
    } catch (e) {
      console.error('Upload failed', e);
      setUploadResult({ ok: false, msg: e.message });
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8 text-white flex items-center justify-center"><span className="text-2xl">Loading task...</span></div>;
  if (error) return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8 text-red-400 flex items-center justify-center"><span className="text-2xl">{error}</span></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Task Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-6 border border-white/10 rounded-2xl bg-white/10 backdrop-blur-xl">
              <h2 className="font-semibold mb-2 text-cyan-300">Issue</h2>
              <p className="text-gray-300">{task.issue || 'No description provided'}</p>
            </div>

            <div className="p-6 border border-white/10 rounded-2xl bg-white/10 backdrop-blur-xl">
              <h2 className="font-semibold mb-3 text-cyan-300">Reported Image</h2>
              {task.reportedImage ? (
                <img src={task.reportedImage} alt="reported" className="w-full object-cover rounded-xl shadow-lg" />
              ) : (
                <p className="text-sm text-gray-400">No image provided</p>
              )}
            </div>

            <div className="p-6 border border-white/10 rounded-2xl bg-white/10 backdrop-blur-xl">
              <h2 className="font-semibold mb-2 text-cyan-300">Location</h2>
              <p className="text-gray-300 mb-3">{task.address}</p>
              {task.location && (
                <a
                  className="inline-block px-4 py-2 text-sm font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-600/20 hover:bg-cyan-600/30 rounded-lg transition-all border border-cyan-500/30"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location.lat + ',' + task.location.lon)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Google Maps →
                </a>
              )}
            </div>
          </div>

          <div>
            <div id="map-canvas" className="w-full h-64 mb-6 border border-white/10 rounded-2xl shadow-lg overflow-hidden bg-slate-800"></div>

            <div className="p-6 border border-white/10 rounded-2xl bg-white/10 backdrop-blur-xl">
              <h2 className="font-semibold mb-4 text-cyan-300">Capture Proof</h2>

              <div className="space-y-4">
                <div className="video-area">
                  <video ref={videoRef} className="w-full rounded-xl border border-white/10 bg-black/50" playsInline muted></video>
                  <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                </div>

                {!previewSrc && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={startCamera} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:from-green-500 hover:to-green-400 transition-all shadow-lg hover:shadow-xl">📷 Start Camera</button>
                    <button onClick={capturePhoto} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-xl">📸 Capture</button>
                    <label className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg hover:shadow-xl cursor-pointer text-center">
                      <input type="file" accept="image/*" onChange={(e) => {
                        const f = e.target.files && e.target.files[0];
                        if (f) setPreviewSrc({ blob: f, url: URL.createObjectURL(f) });
                      }} style={{ display: 'none' }} />
                      📁 Upload
                    </label>
                  </div>
                )}

                {previewSrc && (
                  <div className="space-y-3">
                    <img src={previewSrc.url} alt="preview" className="w-full rounded-xl border border-white/10 shadow-lg" />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button onClick={uploadProof} disabled={uploading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-medium hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                        {uploading ? '⏳ Uploading...' : '✅ Upload Proof'}
                      </button>
                      <button onClick={() => { setPreviewSrc(null); setUploadResult(null); }} className="flex-1 px-4 py-2.5 border border-white/10 text-gray-300 rounded-lg font-medium hover:bg-white/5 transition-all">🔄 Retake</button>
                    </div>
                  </div>
                )}

                {uploadResult && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${uploadResult.ok ? 'bg-green-600/20 text-green-300 border border-green-500/30' : 'bg-red-600/20 text-red-300 border border-red-500/30'}`}>
                    {uploadResult.msg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
