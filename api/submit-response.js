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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, response } = req.body;

  // Validate token
  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .select('id, used')
    .eq('token', token)
    .single();

  if (guestError || guest.used) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Mark token as used
  await supabase.from('guests').update({ used: true }).eq('token', token);

  // Save response
  const { error: responseError } = await supabase.from('responses').insert([
    { guest_token: token, response },
  ]);

  if (responseError) return res.status(500).json({ error: responseError.message });

  return res.status(200).json({ success: true });
}