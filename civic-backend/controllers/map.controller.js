import { reverseGeocode } from "../service/map.serivice.js";

export const Addressbylanlat =  async (req, res) => {
  const { lat, lng } = req.query;
  console.log(lat,lng);
  if (!lat || !lng) return res.status(400).json({ error: 'lat & lng required' });

  try {
    const result = await reverseGeocode(lat, lng);
    const address = Array.isArray(result) ? result[0] : result;
    return res.status(200).json({ address });
  } catch (err) {
    console.error('reverse proxy error', err);
    return res.status(500).json({ error: 'Reverse geocode failed' });
  }
}