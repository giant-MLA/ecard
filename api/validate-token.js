require('dotenv').config();
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: true,
  },
};


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  // Check if the token exists and is unused
  const { data, error } = await supabase
    .from('guests')
    .select('id, name, used')
    .eq('token', token)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.used) return res.status(403).json({ valid: false });

  return res.status(200).json({ valid: true, name: data.name });
}