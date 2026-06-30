import axios from 'axios';

async function nominatimReverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&format=json&addressdetails=1&zoom=18`;
  const resp = await axios.get(url, {
    timeout: 5000,
    headers: { 'User-Agent': 'CivicIssueApp/1.0' }
  });
  const data = resp.data || {};
  const a = data.address || {};

  // Build city from available components
  const city = a.city || a.town || a.village || a.county || a.city_district || '';

  // Build display name from display_name (most complete)
  const displayName = data.display_name;
  if (displayName) {
    // Remove "India" suffix, trim
    let clean = displayName.replace(/,?\s*India\s*$/i, '').trim();

    // Deduplicate: if the same name appears consecutively, keep first only
    const parts = clean.split(',').map(s => s.trim()).filter(Boolean);
    const deduped = [];
    for (const p of parts) {
      if (deduped.length === 0 || p.toLowerCase() !== deduped[deduped.length - 1].toLowerCase()) {
        deduped.push(p);
      }
    }
    clean = deduped.join(', ');

    return [clean, city];
  }

  // Fallback: build from address components
  const road = [a.house_number, a.road].filter(Boolean).join(' ') || '';
  const area = a.neighbourhood || a.suburb || '';
  const locality = a.city || a.town || a.village || '';
  const district = a.state_district || '';
  const state = a.state || '';
  const pin = a.postcode || '';
  const unique = [road, area, locality, district, state, pin].filter(Boolean);
  const seen = new Set();
  const filtered = unique.filter(p => {
    const key = p.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (filtered.length > 0) {
    return [filtered.join(', '), city];
  }

  return null;
}

export async function reverseGeocode(lat, lng) {
  try {
    const result = await nominatimReverseGeocode(lat, lng);
    if (result) return result;
  } catch (err) {
    console.warn('Nominatim reverseGeocode failed:', err.message);
  }

  return `Lat:${lat},Lng:${lng}`;
}

export default { reverseGeocode };
