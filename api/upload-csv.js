require('dotenv').config();
const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/upload-csv', upload.single('file'), async (req, res) => {
  const data = [];
  

  req.file.buffer.pipe(csvParser()).on('data', (row) => data.push(row)).on('end', async () => {
    
    const attendees = data.map((attendee) => ({
      name: attendee.name,
      token: generateToken(),
      used: false
    }));

    
    const { error } = await supabase.from('guests').insert(attendees);
    if (error) return res.status(500).json({ error });

    
    const links = attendees.map((attendee) => ({
      name: attendee.name,
      link: `https://ecard-eight.vercel.app/ecards/ecard.html?name=${encodeURIComponent(attendee.name)}&token=${attendee.token}`
    }));

    res.json({ success: true, links });
  });
});


function generateToken() {
  return Math.random().toString(36).substring(2, 10);
}

module.exports = router;